import TemplatePage from '../template';
import styles from './styles.module.scss';
import { FaQrcode } from 'react-icons/fa';

const Identification = () => {

  return (
    <TemplatePage>
      <main className={styles.identificationContainer}>
        <h1>Identificação do veículo</h1>
        <button className={styles.buttonPlate}>Identificar pela placa</button>
        <button className={styles.buttonQrCode}> <FaQrcode /> </button>
      </main>
    </TemplatePage>
  )
}

export default Identification;