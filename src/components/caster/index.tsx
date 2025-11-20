import styles from './styles.module.scss';
import { useUser } from '../../providers/userContextValues';
import type { Pneu } from '../../types';

const Caster = ({ tyre }: { tyre: Pneu }) => {
    const { vehicleSelected } = useUser();
    const tyresPositions = vehicleSelected ? vehicleSelected.pneus.map(p => p.posicao) : [];


    return (
        <div className={styles.contentServices}>
            <div className={styles.serviceItem}>
                <p>Rodízio</p>
            </div>
            <div className={styles.descriptionContainer}>
                <div className={styles.descriptionItem}>
                    <p>Alteração de posição:</p>
                    <div className={styles.selectContainer}>
                        <p>De <span>{tyre.posicao}</span> para</p>
                        <select className={styles.select} defaultValue={tyre.posicao} >
                            {tyresPositions.map(position => (
                                <option key={position} value={position}>{position}</option>
                            ))}
                        </select>
                    </div>
                </div>
                
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
