import TemplatePage from '../template';
import styles from './styles.module.scss';
import { FaQrcode } from 'react-icons/fa';
import { useUser } from '../../providers/userContextValues';

const Identification = () => {
  const { navigate } = useUser();


  return (
    <TemplatePage>
      <main className={styles.identificationContainer}>
        <h1>Identificação do veículo</h1>
        <button
          className={styles.buttonPlate}
          onClick={() => {
            console.log('Identificar pela placa');
            navigate('/identification-by-plate');
          }}
        >
          Identificar pela placa
        </button>
        <button
          className={styles.buttonQrCode}
          onClick={() => {
            console.log('Identificar pelo QR Code');
            navigate('/identification-by-qrcode');
          }}
        >
          <FaQrcode />
        </button>
      </main>
    </TemplatePage>
  )
}

export default Identification;