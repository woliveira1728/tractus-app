import {
  useState,
  type ReactNode,
} from "react";
import type { User, Login } from "./interfaces";
import { MOCK_USERS, MOCK_VEHICLES, MOCK_HISTORICO } from "../data/mockData";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


import { UserContext } from './userContextValues';
import type { Pneu, Veiculo, HistoricoManutencao } from "../types";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const [ vehicleSelected, setVehicleSelected ] = useState<Veiculo | null>(null);
  const [ pneusSelected, setPneusSelected ] = useState<Pneu[] | null>(null);

  const login = (userData: Login) => {
    const foundUser = MOCK_USERS.find(u => u.email === userData.email && u.password === userData.password);
    if (foundUser) {
      setUser(foundUser);
      toast.success('Login realizado com sucesso!');
      navigate('/identification');
      return;
    }

    toast.error('Usuário ou senha inválidos.');
    return;
    
  };

  const getVehiclesByPlate = (plate: string): Veiculo | null=> {
    
    const foundVehicle = MOCK_VEHICLES.find(v => v.placa === plate);
    if (!foundVehicle) {
      toast.error('Veículo não encontrado para a placa informada.');
      return null;
    }
    return foundVehicle;

  };

  // --- Tyre / historic helpers (centralized) ---
  const findTyreById = (pneuId: number): { vehicleIndex: number; tyreIndex: number; tyre: Pneu } | null => {
    for (let vi = 0; vi < MOCK_VEHICLES.length; vi++) {
      const v = MOCK_VEHICLES[vi];
      const ti = v.pneus.findIndex(p => p.id === pneuId);
      if (ti >= 0) return { vehicleIndex: vi, tyreIndex: ti, tyre: v.pneus[ti] };
    }
    return null;
  };

  let nextHistoricoId = MOCK_HISTORICO.length ? Math.max(...MOCK_HISTORICO.map(h => h.id)) + 1 : 1;

  const updateTyreMeasurements = (pneuId: number, newPressao?: number, newSulco?: number, movimentacao = 'Sem Movimentação') => {
    const found = findTyreById(pneuId);
    if (!found) {
      toast.error('Pneu não encontrado.');
      return false;
    }

    const { vehicleIndex, tyreIndex } = found;
    const veh = MOCK_VEHICLES[vehicleIndex];
    const tyre = veh.pneus[tyreIndex];

    const prevPressao = tyre.pressao;
    const prevSulco = tyre.sulco;

    if (newPressao !== undefined && !Number.isNaN(newPressao)) tyre.pressao = newPressao;
    if (newSulco !== undefined && !Number.isNaN(newSulco)) tyre.sulco = newSulco;

    const historico: HistoricoManutencao = {
      id: nextHistoricoId++,
      pneuId: tyre.id,
      posicao: tyre.posicao,
      pressaoAnterior: prevPressao,
      sulcoAnterior: prevSulco,
      pressaoNova: tyre.pressao,
      sulcoNovo: tyre.sulco,
      movimentacao,
      detalheRodizio: undefined,
      data: new Date().toISOString(),
      usuario: user ? user.name : 'Sistema'
    };

    MOCK_HISTORICO.push(historico);
    toast.success('Medições salvas com sucesso.');
    return true;
  };

  const getHistoryByPneuId = (pneuId: number): HistoricoManutencao[] => {
    return MOCK_HISTORICO.filter(h => h.pneuId === pneuId);
  };

  const selectNextTyre = (currentPosicao?: string, direction: 'next' | 'prev' = 'next'): Pneu | null => {
    const list = pneusSelected ?? vehicleSelected?.pneus ?? [];
    if (!list || list.length === 0) return null;
    if (!currentPosicao) return list[0] ?? null;
    const idx = list.findIndex(p => p.posicao === currentPosicao);
    if (idx === -1) return list[0] ?? null;
    let nextIdx = direction === 'next' ? idx + 1 : idx - 1;
    if (nextIdx >= list.length) nextIdx = 0;
    if (nextIdx < 0) nextIdx = list.length - 1;
    return list[nextIdx] ?? null;
  };

  return (
    <UserContext.Provider
        value={{
            user,
            setUser,
            login,
            navigate,
            getVehiclesByPlate,
            vehicleSelected,
            setVehicleSelected,
            pneusSelected,
            setPneusSelected,
            findTyreById,
            updateTyreMeasurements,
            getHistoryByPneuId,
            selectNextTyre,
        }}
    >
      {children}
    </UserContext.Provider>
  );
}

// Hook de conveniência para consumir o contexto com tipagem segura
// NOTE: hooks and context getters moved to `userContextValues.ts` to keep this file
// exporting only the provider component (improves Fast Refresh compatibility).