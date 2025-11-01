import styles from './styles.module.scss';

const Caster = () => {
  return (
    <div className={styles.contentServices}>
        <h2 className={styles.serviceTitle}><span>L1</span> - Pneu 1E</h2>
        <div className={styles.serviceItem}>
            <p>Rodízio</p>
        </div>
        <div className={styles.descriptionContainer}>
            <p>Subistituição de pneu?</p>
            <div className={styles.radioContainer}>
                <input type="radio" id="yes" name="substitution" value="yes" />
                <label htmlFor="yes">Sim</label>
                
                <input type="radio" id="no" name="substitution" value="no" />
                <label htmlFor="no">Não</label>
            </div>
            
            <p>O pneu foi vendido?</p>
            <div className={styles.radioContainer}>
                <input type="radio" id="yes" name="sold" value="yes" />
                <label htmlFor="yes">Sim</label>
                
                <input type="radio" id="no" name="sold" value="no" />
                <label htmlFor="no">Não</label>
            </div>

            <p>O pneu foi sucateado?</p>
            <div className={styles.radioContainer}>
                <input type="radio" id="yes" name="scrapped" value="yes" />
                <label htmlFor="yes">Sim</label>
                
                <input type="radio" id="no" name="scrapped" value="no" />
                <label htmlFor="no">Não</label>
            </div>
        </div>
    </div>
  );
};

export default Caster;
