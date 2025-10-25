import TemplatePage from '../template';
import styles from './styles.module.scss';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Historical = () => {

  return (
    <TemplatePage>
      <main className={styles.historicalContainer}>
        <div className={styles.contentServices}>
          <div className={styles.serviceItem}>
            <p>Histórico de serviços</p>
          </div>
        </div>
        <div className={styles.buttonsContainer}>
          <button className={styles.button} aria-label="Voltar">
            <FiChevronLeft size={40} />
          </button>
          <button className={styles.button} aria-label="Avançar">
            <FiChevronRight size={40} />
          </button>
        </div>
      </main>
    </TemplatePage>
  )
}

export default Historical;