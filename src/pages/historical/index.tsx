import TemplatePage from '../template';
import styles from './styles.module.scss';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Historical = () => {

  return (
    <TemplatePage>
      <main className={styles.historicalContainer}>
        <div className={styles.contentServices}>
          <h2 className={styles.serviceTitle}><span>L1</span> - Pneu 1E</h2>
          <div className={styles.serviceItem}>
            <p>Histórico de serviços</p>
          </div>
          <div className={styles.descriptionContainer}>
            <p className={styles.descriptionDate}>10/10/2025</p>
            <p>Recapagens: <span>2</span></p>
            <p>Rodízio: <span>Alterado da posição 2E para 1E</span></p>
            <p>Sulco: <span>4 mm</span></p>
            <p>Pressão: <span>120</span></p>
            <p>Movimentações realizadas:</p>
            <ul>
              <li>Recapagem</li>
              <li>Rodízio</li>
            </ul>
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