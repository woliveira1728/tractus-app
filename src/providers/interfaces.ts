import type {
  Pneu,
  Veiculo,
  HistoricoManutencao,
  OrdemServico,
  UserRole,
  ServiceStatus,
} from '../types';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface CreateServiceOrderInput {
  placa: string;
  veiculo: string;
  tipoServico: string;
  pneusEnvolvidos: string;
  profundidadeSulco: number;
  novaPressao: number;
  ultimaPressaoMedida: number;
  numeroFogo: string;
  movimentacoesRealizadas: {
    rodizio: string;
    substituicao: string;
    sucateado?: boolean;
    vendido?: boolean;
  };
  observacoesTecnico?: string;
}

export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (userData: Login) => void;
  logout: () => void;
  registerUser: (data: RegisterPayload) => boolean;
  navigate: (path: string) => void;

  /* Recuperação Segura de Credenciais (RN02 - OTP) */
  requestPasswordOtp: (email: string) => string | null;
  verifyPasswordOtp: (code: string) => boolean;
  resetPassword: (newPassword: string) => boolean;
  activeOtpCode: string | null;
  recoveryEmail: string | null;

  /* Veículos e Pneus */
  vehicles: Veiculo[];
  getVehiclesByPlate: (plate: string) => Veiculo | null;
  vehicleSelected: Veiculo | null;
  setVehicleSelected: (vehicle: Veiculo | null) => void;
  pneusSelected: Pneu[] | null;
  setPneusSelected: (pneus: Pneu[] | null) => void;

  /* Tyre / history helpers */
  historico: HistoricoManutencao[];
  findTyreById?: (pneuId: number) => { vehicleIndex: number; tyreIndex: number; tyre: Pneu } | null;
  updateTyreMeasurements?: (
    pneuId: number,
    newPressao?: number,
    newSulco?: number,
    movimentacao?: string,
    suppressToast?: boolean,
    extraDetails?: {
      fogo?: string;
      rodizioDe?: string;
      rodizioPara?: string;
      sucateado?: boolean;
      vendido?: boolean;
      substituicaoDesc?: string;
      observacoes?: string;
    }
  ) => boolean;
  replaceTyre?: (originalPneuId: number, newTyreData: Partial<Pneu>, movimentacao?: string) => boolean;
  getHistoryByPneuId?: (pneuId: number) => HistoricoManutencao[];
  selectNextTyre?: (currentPosicao?: string, direction?: 'next' | 'prev') => Pneu | null;

  /* Ordens de Serviço e Homologação Gerencial (RN03 / RF07) */
  serviceOrders: OrdemServico[];
  createServiceOrder: (input: CreateServiceOrderInput) => OrdemServico;
  updateServiceOrderStatus: (
    orderId: number,
    status: ServiceStatus,
    justificativaGerente?: string
  ) => OrdemServico | null;

  /* Operação Offline e Sincronização Assíncrona (RN04 / RF05 / RNF05) */
  isOnline: boolean;
  simulatedOffline: boolean;
  toggleOfflineSimulation: () => void;
  pendingSyncCount: number;
  syncPendingRecords: () => Promise<void>;
  resetDemoData: () => Promise<void>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface Login {
  email: string;
  password: string;
}