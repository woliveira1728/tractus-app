import TemplatePage from '../template';
import styles from './styles.module.scss';

const VehicleDashboard = () => {

  return (
    <TemplatePage>
      <main className={styles.vehicleDashboardContainer}>
        <h1>Identificação do veículo</h1>
        <button className={styles.buttonQrCode}> Histórico do veículo </button>
      </main>
    </TemplatePage>
  )
}

export default VehicleDashboard;