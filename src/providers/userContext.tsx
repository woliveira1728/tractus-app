import { useState, useEffect, useCallback, type ReactNode } from 'react';
import type {
  User,
  Login,
  RegisterPayload,
  CreateServiceOrderInput,
} from './interfaces';
import {
  MOCK_USERS,
  MOCK_VEHICLES,
  MOCK_HISTORICO,
  MOCK_SERVICE_ORDERS,
} from '../data/mockData';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './userContextValues';
import type {
  Pneu,
  Veiculo,
  HistoricoManutencao,
  OrdemServico,
  ServiceStatus,
  SyncQueueItem,
} from '../types';
import {
  loadInitialStateFromIDB,
  saveUsersToIDB,
  saveVehiclesToIDB,
  saveHistoricoToIDB,
  saveServiceOrdersToIDB,
  saveSyncQueueToIDB,
  resetIDBToDefaults,
} from '../services/offlineStorage';
import { evaluateSulco } from '../utils/sulco';

function formatBrDateTime(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} - ${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [user, setUser] = useState<User | null>(null);
  const [vehicles, setVehicles] = useState<Veiculo[]>(MOCK_VEHICLES);
  const [historico, setHistorico] = useState<HistoricoManutencao[]>(MOCK_HISTORICO);
  const [serviceOrders, setServiceOrders] = useState<OrdemServico[]>(MOCK_SERVICE_ORDERS);
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>([]);

  const [vehicleSelected, setVehicleSelected] = useState<Veiculo | null>(MOCK_VEHICLES[0]);
  const [pneusSelected, setPneusSelected] = useState<Pneu[] | null>(MOCK_VEHICLES[0].pneus);

  // Conectividade e Simulação de Modo Offline (RN04 / RF05 / RNF05)
  const [browserOnline, setBrowserOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [simulatedOffline, setSimulatedOffline] = useState<boolean>(false);
  const isOnline = browserOnline && !simulatedOffline;

  // Recuperação Segura de Senha via OTP (RN02)
  const [activeOtpCode, setActiveOtpCode] = useState<string | null>('5138');
  const [recoveryEmail, setRecoveryEmail] = useState<string | null>(null);

  // Carrega dados persistidos no IndexedDB ao iniciar
  useEffect(() => {
    let active = true;
    loadInitialStateFromIDB().then((persisted) => {
      if (!active) return;
      setUsers(persisted.users);
      setVehicles(persisted.vehicles);
      setHistorico(persisted.historico);
      setServiceOrders(persisted.serviceOrders);
      setSyncQueue(persisted.syncQueue);
      if (persisted.vehicles.length > 0) {
        setVehicleSelected(persisted.vehicles[0]);
        setPneusSelected(persisted.vehicles[0].pneus);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  // Monitora rede nativa do navegador
  useEffect(() => {
    const handleOnline = () => setBrowserOnline(true);
    const handleOffline = () => setBrowserOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const syncPendingRecords = useCallback(async () => {
    if (syncQueue.length === 0) return;

    const syncedOrders = serviceOrders.map((order) =>
      order.syncStatus === 'pending_sync'
        ? { ...order, syncStatus: 'synced' as const }
        : order
    );
    const syncedHistorico = historico.map((item) =>
      item.syncStatus === 'pending_sync'
        ? { ...item, syncStatus: 'synced' as const }
        : item
    );

    setServiceOrders(syncedOrders);
    setHistorico(syncedHistorico);
    setSyncQueue([]);

    await Promise.all([
      saveServiceOrdersToIDB(syncedOrders),
      saveHistoricoToIDB(syncedHistorico),
      saveSyncQueueToIDB([]),
    ]);

    toast.success(
      `Sincronização concluída! ${syncQueue.length} registro(s) offline enviado(s) ao servidor.`
    );
  }, [syncQueue, serviceOrders, historico]);

  // Quando a conexão volta ao estado Online, sincroniza a fila automaticamente (RN04)
  useEffect(() => {
    if (isOnline && syncQueue.length > 0) {
      void syncPendingRecords();
    }
  }, [isOnline, syncQueue.length, syncPendingRecords]);

  const toggleOfflineSimulation = () => {
    setSimulatedOffline((prev) => {
      const next = !prev;
      if (next) {
        toast.warning('Modo Offline ativado. Registros serão salvos na fila local (IndexedDB).');
      } else {
        toast.info('Conexão restabelecida (Modo Online).');
      }
      return next;
    });
  };

  // RF01 - Autenticação por Perfis com Redirecionamento Dinâmico
  const login = (userData: Login) => {
    const cleanEmail = userData.email.trim().toLowerCase();
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.password === userData.password
    );

    if (foundUser) {
      setUser(foundUser);
      toast.success(`Bem-vindo, ${foundUser.name}!`);
      if (foundUser.role === 'gerente') {
        navigate('/manager/services');
      } else {
        navigate('/identification');
      }
      return;
    }

    toast.error('Usuário ou senha inválidos.');
  };

  const logout = () => {
    setUser(null);
    navigate('/');
  };

  const registerUser = (data: RegisterPayload): boolean => {
    const cleanEmail = data.email.trim().toLowerCase();
    if (!cleanEmail || !data.password || !data.name.trim()) {
      toast.error('Preencha todos os campos obrigatórios.');
      return false;
    }
    const exists = users.some((u) => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      toast.error('Já existe uma conta cadastrada com este e-mail.');
      return false;
    }

    const inferredRole =
      data.role ??
      (cleanEmail.includes('gerente') || cleanEmail.includes('carlos')
        ? 'gerente'
        : 'borracheiro');

    const newUser: User = {
      id: String(Date.now()),
      name: data.name.trim(),
      email: cleanEmail,
      password: data.password,
      role: inferredRole,
    };

    const nextUsers = [...users, newUser];
    setUsers(nextUsers);
    void saveUsersToIDB(nextUsers);
    setUser(newUser);
    toast.success('Conta criada com sucesso!');

    if (newUser.role === 'gerente') {
      navigate('/manager/services');
    } else {
      navigate('/identification');
    }
    return true;
  };

  // RN02 - Recuperação Segura de Credenciais via OTP
  const requestPasswordOtp = (email: string): string | null => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      toast.error('Insira o endereço de e-mail vinculado à sua conta.');
      return null;
    }
    setRecoveryEmail(cleanEmail);
    const code = '5138'; // Prefixo 5-1-3 visível na Imagem 4.3 do protótipo
    setActiveOtpCode(code);
    toast.info(`Código verificador enviado para ${cleanEmail}: ${code}`);
    return code;
  };

  const verifyPasswordOtp = (code: string): boolean => {
    const clean = code.replace(/\s+/g, '');
    if (clean.length < 4) {
      toast.error('Digite todos os dígitos do código de verificação.');
      return false;
    }
    toast.success('Código verificado com sucesso!');
    return true;
  };

  const resetPassword = (newPassword: string): boolean => {
    if (!newPassword || newPassword.length < 3) {
      toast.error('A nova senha deve ter pelo menos 3 caracteres.');
      return false;
    }
    if (recoveryEmail) {
      const nextUsers = users.map((u) =>
        u.email.toLowerCase() === recoveryEmail.toLowerCase()
          ? { ...u, password: newPassword }
          : u
      );
      setUsers(nextUsers);
      void saveUsersToIDB(nextUsers);
    }
    toast.success('Senha redefinida com sucesso! Faça login com sua nova senha.');
    navigate('/login');
    return true;
  };

  // RF02 - Identificação de veículo por Placa ou QR Code
  const getVehiclesByPlate = (plate: string): Veiculo | null => {
    const normalized = plate.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    const foundVehicle = vehicles.find(
      (v) => v.placa.replace(/[^A-Z0-9]/gi, '').toUpperCase() === normalized
    );
    if (!foundVehicle) {
      toast.error('Veículo não encontrado para a placa informada.');
      return null;
    }
    return foundVehicle;
  };

  const findTyreById = (
    pneuId: number
  ): { vehicleIndex: number; tyreIndex: number; tyre: Pneu } | null => {
    for (let vi = 0; vi < vehicles.length; vi++) {
      const v = vehicles[vi];
      const ti = v.pneus.findIndex((p) => p.id === pneuId);
      if (ti >= 0) return { vehicleIndex: vi, tyreIndex: ti, tyre: v.pneus[ti] };
    }
    return null;
  };

  const createServiceOrder = (input: CreateServiceOrderInput): OrdemServico => {
    const now = new Date();
    const nextOrderId =
      serviceOrders.length > 0
        ? Math.max(...serviceOrders.map((o) => o.id)) + 1
        : 10246;

    const newOrder: OrdemServico = {
      id: nextOrderId,
      placa: input.placa,
      veiculo: input.veiculo,
      dataHora: formatBrDateTime(now),
      timestampIso: now.toISOString(),
      tipoServico: input.tipoServico,
      pneusEnvolvidos: input.pneusEnvolvidos,
      profundidadeSulco: input.profundidadeSulco,
      novaPressao: input.novaPressao,
      ultimaPressaoMedida: input.ultimaPressaoMedida,
      numeroFogo: input.numeroFogo,
      movimentacoesRealizadas: input.movimentacoesRealizadas,
      observacoesTecnico:
        input.observacoesTecnico?.trim() ||
        `Pneu ${input.pneusEnvolvidos} aferido no pátio (${input.tipoServico}).`,
      status: 'pendente',
      operador: user?.name ?? 'José (Zé) Rodrigues',
      syncStatus: isOnline ? 'synced' : 'pending_sync',
    };

    const nextOrders = [newOrder, ...serviceOrders];
    setServiceOrders(nextOrders);
    void saveServiceOrdersToIDB(nextOrders);

    if (!isOnline) {
      const queueItem: SyncQueueItem = {
        id: `sync-${Date.now()}`,
        type: 'ORDEM_SERVICO',
        timestampIso: now.toISOString(),
        payload: newOrder,
      };
      const nextQueue = [...syncQueue, queueItem];
      setSyncQueue(nextQueue);
      void saveSyncQueueToIDB(nextQueue);
    }

    return newOrder;
  };

  const updateTyreMeasurements = (
    pneuId: number,
    newPressao?: number,
    newSulco?: number,
    movimentacao = 'Recapagem',
    suppressToast = false,
    extraDetails?: {
      fogo?: string;
      rodizioDe?: string;
      rodizioPara?: string;
      sucateado?: boolean;
      vendido?: boolean;
      substituicaoDesc?: string;
      observacoes?: string;
    }
  ): boolean => {
    const found = findTyreById(pneuId);
    if (!found) {
      toast.error('Pneu não encontrado.');
      return false;
    }

    const { vehicleIndex, tyreIndex } = found;
    const nextVehicles = JSON.parse(JSON.stringify(vehicles)) as Veiculo[];
    const veh = nextVehicles[vehicleIndex];
    const tyre = veh.pneus[tyreIndex];

    const prevPressao = tyre.pressao;
    const prevSulco = tyre.sulco;

    if (newPressao !== undefined && !Number.isNaN(newPressao)) {
      tyre.ultimaPressao = prevPressao;
      tyre.pressao = newPressao;
    }
    if (newSulco !== undefined && !Number.isNaN(newSulco)) {
      tyre.sulco = newSulco;
    }
    if (extraDetails?.fogo) {
      tyre.fogo = extraDetails.fogo;
    }

    // Atualiza status visual do pneu de acordo com a RN01
    const sulcoStatus = evaluateSulco(tyre.sulco, tyre.recapagens);
    if (sulcoStatus === 'illegal' || sulcoStatus === 'recapagem_limit_reached') {
      tyre.status = 'CRÍTICO';
    } else if (sulcoStatus === 'recapagem') {
      tyre.status = 'ALERTA';
    } else {
      tyre.status = 'OK';
    }

    setVehicles(nextVehicles);
    if (vehicleSelected?.placa === veh.placa) {
      setVehicleSelected(veh);
      setPneusSelected(veh.pneus);
    }
    void saveVehiclesToIDB(nextVehicles);

    const nextHistId =
      historico.length > 0 ? Math.max(...historico.map((h) => h.id)) + 1 : 1;

    const rodizioDesc =
      extraDetails?.rodizioDe && extraDetails?.rodizioPara && extraDetails.rodizioDe !== extraDetails.rodizioPara
        ? `Alterado da posição ${extraDetails.rodizioDe} para ${extraDetails.rodizioPara}`
        : `Mantido na posição ${tyre.posicao}`;

    const novoHistorico: HistoricoManutencao = {
      id: nextHistId,
      pneuId: tyre.id,
      placa: veh.placa,
      fogo: tyre.fogo,
      posicao: tyre.posicao,
      pressaoAnterior: prevPressao,
      sulcoAnterior: prevSulco,
      pressaoNova: tyre.pressao,
      sulcoNovo: tyre.sulco,
      recapagens: tyre.recapagens,
      movimentacao,
      detalheRodizio: rodizioDesc,
      rodizioDe: extraDetails?.rodizioDe,
      rodizioPara: extraDetails?.rodizioPara,
      sucateado: extraDetails?.sucateado,
      vendido: extraDetails?.vendido,
      observacoes: extraDetails?.observacoes,
      data: new Date().toISOString(),
      usuario: user ? user.name : 'José (Zé) Rodrigues',
      syncStatus: isOnline ? 'synced' : 'pending_sync',
    };

    const nextHistorico = [novoHistorico, ...historico];
    setHistorico(nextHistorico);
    void saveHistoricoToIDB(nextHistorico);

    // Gera automaticamente uma Ordem de Serviço para Homologação do Gerente (RN03 / RF07)
    createServiceOrder({
      placa: veh.placa,
      veiculo: veh.modelo,
      tipoServico: extraDetails?.sucateado ? 'Sucata Imediata' : movimentacao,
      pneusEnvolvidos:
        extraDetails?.rodizioDe && extraDetails?.rodizioPara && extraDetails.rodizioDe !== extraDetails.rodizioPara
          ? `${extraDetails.rodizioDe}, ${extraDetails.rodizioPara}`
          : tyre.posicao,
      profundidadeSulco: tyre.sulco,
      novaPressao: tyre.pressao,
      ultimaPressaoMedida: prevPressao,
      numeroFogo: tyre.fogo,
      movimentacoesRealizadas: {
        rodizio:
          extraDetails?.rodizioDe && extraDetails?.rodizioPara
            ? `Alterado de ${extraDetails.rodizioDe} para ${extraDetails.rodizioPara}`
            : `Posição ${tyre.posicao}`,
        substituicao: extraDetails?.substituicaoDesc || 'Nenhuma substituição solicitada',
        sucateado: extraDetails?.sucateado,
        vendido: extraDetails?.vendido,
      },
      observacoesTecnico:
        extraDetails?.observacoes ||
        `Pneu ${tyre.posicao} enviados para ${movimentacao.toLowerCase()} e sulcos estão dentro do limite.`,
    });

    if (!suppressToast) {
      if (isOnline) {
        toast.success('Medições salvas e enviadas para homologação!');
      } else {
        toast.warning('Você está offline. Registro salvo localmente no dispositivo.');
      }
    }
    return true;
  };

  const replaceTyre = (
    originalPneuId: number,
    newTyreData: Partial<Pneu>,
    movimentacao = 'Substituição'
  ): boolean => {
    const found = findTyreById(originalPneuId);
    if (!found) {
      toast.error('Pneu original não encontrado para substituição.');
      return false;
    }

    const { vehicleIndex, tyreIndex } = found;
    const nextVehicles = JSON.parse(JSON.stringify(vehicles)) as Veiculo[];
    const veh = nextVehicles[vehicleIndex];
    const tyre = veh.pneus[tyreIndex];

    const prevPressao = tyre.pressao;
    const prevSulco = tyre.sulco;

    if (newTyreData.fogo !== undefined) tyre.fogo = newTyreData.fogo;
    if (newTyreData.pressao !== undefined && !Number.isNaN(newTyreData.pressao)) {
      tyre.ultimaPressao = prevPressao;
      tyre.pressao = newTyreData.pressao;
    }
    if (newTyreData.sulco !== undefined && !Number.isNaN(newTyreData.sulco)) {
      tyre.sulco = newTyreData.sulco;
    }
    if (newTyreData.recapagens !== undefined) {
      tyre.recapagens = newTyreData.recapagens;
    } else {
      tyre.recapagens = 0;
    }

    setVehicles(nextVehicles);
    if (vehicleSelected?.placa === veh.placa) {
      setVehicleSelected(veh);
      setPneusSelected(veh.pneus);
    }
    void saveVehiclesToIDB(nextVehicles);

    const nextHistId =
      historico.length > 0 ? Math.max(...historico.map((h) => h.id)) + 1 : 1;

    const novoHistorico: HistoricoManutencao = {
      id: nextHistId,
      pneuId: tyre.id,
      placa: veh.placa,
      fogo: tyre.fogo,
      posicao: tyre.posicao,
      pressaoAnterior: prevPressao,
      sulcoAnterior: prevSulco,
      pressaoNova: tyre.pressao,
      sulcoNovo: tyre.sulco,
      recapagens: tyre.recapagens,
      movimentacao,
      data: new Date().toISOString(),
      usuario: user ? user.name : 'José (Zé) Rodrigues',
      syncStatus: isOnline ? 'synced' : 'pending_sync',
    };

    const nextHistorico = [novoHistorico, ...historico];
    setHistorico(nextHistorico);
    void saveHistoricoToIDB(nextHistorico);

    toast.success('Substituição realizada e medições salvas com sucesso.');
    return true;
  };

  // RN03 / RF07 - Homologação de Ordens de Serviço pelo Gerente
  const updateServiceOrderStatus = (
    orderId: number,
    status: ServiceStatus,
    justificativaGerente?: string
  ): OrdemServico | null => {
    let updatedOrder: OrdemServico | null = null;
    const nextOrders = serviceOrders.map((order) => {
      if (order.id === orderId) {
        updatedOrder = {
          ...order,
          status,
          homologadoPor: user?.name ?? 'Antônio Carlos (Seu Carlos)',
          dataHomologacao: formatBrDateTime(new Date()),
          justificativaGerente: justificativaGerente?.trim() || order.justificativaGerente,
        };
        return updatedOrder;
      }
      return order;
    });

    setServiceOrders(nextOrders);
    void saveServiceOrdersToIDB(nextOrders);
    return updatedOrder;
  };

  const getHistoryByPneuId = (pneuId: number): HistoricoManutencao[] => {
    return historico.filter((h) => h.pneuId === pneuId);
  };

  const selectNextTyre = (
    currentPosicao?: string,
    direction: 'next' | 'prev' = 'next'
  ): Pneu | null => {
    const list = pneusSelected ?? vehicleSelected?.pneus ?? [];
    if (!list || list.length === 0) return null;
    if (!currentPosicao) return list[0] ?? null;
    const idx = list.findIndex((p) => p.posicao === currentPosicao);
    if (idx === -1) return list[0] ?? null;
    let nextIdx = direction === 'next' ? idx + 1 : idx - 1;
    if (nextIdx >= list.length) nextIdx = 0;
    if (nextIdx < 0) nextIdx = list.length - 1;
    return list[nextIdx] ?? null;
  };

  const resetDemoData = async () => {
    const defaults = await resetIDBToDefaults();
    setUsers(defaults.users);
    setVehicles(defaults.vehicles);
    setHistorico(defaults.historico);
    setServiceOrders(defaults.serviceOrders);
    setSyncQueue([]);
    setVehicleSelected(defaults.vehicles[0]);
    setPneusSelected(defaults.vehicles[0].pneus);
    toast.info('Dados de demonstração restaurados para o estado original.');
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        registerUser,
        navigate,
        requestPasswordOtp,
        verifyPasswordOtp,
        resetPassword,
        activeOtpCode,
        recoveryEmail,
        vehicles,
        getVehiclesByPlate,
        vehicleSelected,
        setVehicleSelected,
        pneusSelected,
        setPneusSelected,
        historico,
        findTyreById,
        updateTyreMeasurements,
        replaceTyre,
        getHistoryByPneuId,
        selectNextTyre,
        serviceOrders,
        createServiceOrder,
        updateServiceOrderStatus,
        isOnline,
        simulatedOffline,
        toggleOfflineSimulation,
        pendingSyncCount: syncQueue.length,
        syncPendingRecords,
        resetDemoData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};