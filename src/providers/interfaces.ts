import type { Pneu, Veiculo, HistoricoManutencao } from "../types";


export interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    login: (userData: Login) => void;
    navigate: (path: string) => void;
    getVehiclesByPlate: (plate: string) => Veiculo | null;
    vehicleSelected: Veiculo | null;
    setVehicleSelected: (vehicle: Veiculo | null) => void;
    pneusSelected: Pneu[] | null;
    setPneusSelected: (pneus: Pneu[] | null) => void;

    /* Tyre / history helpers */
    findTyreById?: (pneuId: number) => { vehicleIndex: number; tyreIndex: number; tyre: Pneu } | null;
    updateTyreMeasurements?: (pneuId: number, newPressao?: number, newSulco?: number, movimentacao?: string, suppressToast?: boolean) => boolean;
    replaceTyre?: (originalPneuId: number, newTyreData: Partial<Pneu>, movimentacao?: string) => boolean;
    getHistoryByPneuId?: (pneuId: number) => HistoricoManutencao[];
    selectNextTyre?: (currentPosicao?: string, direction?: 'next' | 'prev') => Pneu | null;
}

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
}

export interface Login {
    email: string;
    password: string;
}