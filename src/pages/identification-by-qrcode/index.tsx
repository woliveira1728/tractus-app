import TemplatePage from '../template';
import styles from './styles.module.scss';
import { FaQrcode } from 'react-icons/fa';

const IdentificationByQrCode = () => {

  return (
    <TemplatePage>
      <main className={styles.identificationContainer}>
        <h1>Identificação do veículo</h1>
        <button className={styles.buttonQrCode}>
          <FaQrcode size={300} />
        </button>
        <p>Escanear QR Code</p>
      </main>
    </TemplatePage>
  )
}

export default IdentificationByQrCode;