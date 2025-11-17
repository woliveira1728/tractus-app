import type { Pneu } from '../../types';
import styles from './styles.module.scss';

const Tyre = ({ tyre } : { tyre: Pneu }) => {
  return (
    <section className={styles.tyreInfoSection}>
        <div className={styles.infoContainer}>
            <p>Número de fogo</p>
            <span>{tyre.fogo}</span>
        </div>
        <div className={styles.infoContainer}>
            <p>Última pressão medida</p>
            <span>{tyre.pressao}</span>
        </div>
        <div className={styles.infoContainer}>
            <p>Nova Pressão</p>
            <input type="number" placeholder='190' />
        </div>
        <div className={styles.infoContainer}>
            <p>Profundidade do Sulco</p>
            <input type="number" placeholder='5mm' />
        </div>
    </section>
  );
};

export default Tyre;
