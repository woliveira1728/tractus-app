import styles from './styles.module.scss';

const Tyre = () => {
  return (
    <section className={styles.tyreInfoSection}>
        <div className={styles.infoContainer}>
            <p>Número de fogo</p>
            <span>234</span>
        </div>
        <div className={styles.infoContainer}>
            <p>Última pressão medida</p>
            <span>220</span>
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
