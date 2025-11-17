import type { Pneu, Veiculo } from "../types";


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