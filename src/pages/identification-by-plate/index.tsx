import TemplatePage from '../template';
import styles from './styles.module.scss';
import { useUser } from '../../providers/userContextValues';

const IdentificationByPlate = () => {
  const { getVehiclesByPlate, navigate, setVehicleSelected, setPneusSelected } = useUser();

  const handlePlateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const plate = raw.trim().toUpperCase();

    const pattern1 = /^[A-Z]{3}-\d{4}$/i;
    const pattern2 = /^[A-Z]{3}\d[A-Z]\d{2}$/i;

    if (pattern1.test(plate) || pattern2.test(plate)) {
      const vehicle = getVehiclesByPlate(plate);
      if (vehicle) {
        setVehicleSelected(vehicle);
        setPneusSelected(vehicle.pneus);
        navigate('/vehicle-dashboard');
      }
    } else {
      return;
    }
  }

  return (
    <TemplatePage>
      <main className={styles.identificationContainer}>
        <h1>Identificação do veículo</h1>
        <p>Digite a placa do veículo</p>
        <input type="text" placeholder="ABC-1234 / BRA2E19" onChange={handlePlateInputChange}/>
      </main>
    </TemplatePage>
  )
}

export default IdentificationByPlate;