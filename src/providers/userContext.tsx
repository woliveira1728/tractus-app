import {
  useState,
  type ReactNode,
} from "react";
import type { User, Login } from "./interfaces";
import { MOCK_USERS, MOCK_VEHICLES } from "../data/mockData";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


import { UserContext } from './userContextValues';
import type { Pneu, Veiculo } from "../types";

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
        }}
    >
      {children}
    </UserContext.Provider>
  );
}

// Hook de conveniência para consumir o contexto com tipagem segura
// NOTE: hooks and context getters moved to `userContextValues.ts` to keep this file
// exporting only the provider component (improves Fast Refresh compatibility).