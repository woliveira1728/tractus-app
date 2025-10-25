import TemplatePage from '../template';
import styles from './styles.module.scss';

const IdentificationByPlate = () => {

  return (
    <TemplatePage>
      <main className={styles.identificationContainer}>
        <h1>Identificação do veículo</h1>
        <p>Digite a placa do veículo</p>
        <input type="text" placeholder="ABC-1234 / BRA2E19"/>
      </main>
    </TemplatePage>
  )
}

export default IdentificationByPlate;