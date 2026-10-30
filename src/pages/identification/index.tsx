import React, { useState } from 'react';
import TemplatePage from '../template';
import styles from './styles.module.scss';
import { FaQrcode } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useUser } from '../../providers/userContextValues';
import type { Veiculo } from '../../types';

const Identification = () => {
  const { vehicles, getVehiclesByPlate, navigate, setVehicleSelected, setPneusSelected } = useUser();
  const [plate, setPlate] = useState('');

  const openVehicle = (vehicle: Veiculo) => {
    setVehicleSelected(vehicle);
    setPneusSelected(vehicle.pneus);
    navigate('/vehicle-dashboard');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!plate.trim()) {
      toast.warn('Digite a placa do veículo.');
      return;
    }

    const vehicle = getVehiclesByPlate(plate);
    if (vehicle) openVehicle(vehicle);
  };

  return (
    <TemplatePage>
      <main className={styles.identificationContainer}>
        <h1 className={styles.title}>Identificação do veículo</h1>

        <form className={styles.formContainer} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Digite a placa"
            name="plate"
            value={plate}
            maxLength={8}
            onChange={(e) => setPlate(e.target.value.toUpperCase())}
          />

          <button type="submit" className={styles.buttonNext}>
            Avançar
          </button>
        </form>

        <div className={styles.dividerRow}>
          <span className={styles.line} />
          <span className={styles.dividerText}>Ou leia o Qr Code</span>
          <span className={styles.line} />
        </div>

        <button
          type="button"
          className={styles.buttonQrCode}
          aria-label="Ler QR Code"
          onClick={() => navigate('/identification-by-qrcode')}
        >
          <FaQrcode size={32} />
        </button>

        <div className={styles.demoBox}>
          <span className={styles.demoLabel}>Placas disponíveis (demonstração):</span>
          <div className={styles.demoButtons}>
            {vehicles.map((vehicle) => (
              <button
                key={vehicle.placa}
                type="button"
                className={styles.demoPlateBtn}
                onClick={() => openVehicle(vehicle)}
                title={vehicle.modelo}
              >
                {vehicle.placa}
                <small>{vehicle.pneus.length} pneus</small>
              </button>
            ))}
          </div>
        </div>
      </main>
    </TemplatePage>
  );
};

export default Identification;
