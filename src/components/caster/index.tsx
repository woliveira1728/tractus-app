import { useState } from 'react';
import styles from './styles.module.scss';
import Dropdown from '../dropdown';
import { useUser } from '../../providers/userContextValues';
import type { Pneu } from '../../types';

const Caster = ({ tyre, onSubstitutionChange }: { tyre: Pneu; onSubstitutionChange?: (v: boolean) => void }) => {
    const { vehicleSelected } = useUser();
    const tyresPositions = vehicleSelected ? vehicleSelected.pneus.map(p => p.posicao) : [];
    const [newPosition, setNewPosition] = useState(tyre.posicao);


    return (
        <div className={styles.contentServices}>
            <div className={styles.serviceItem}>
                <p>Substituição</p>
            </div>
            <div className={styles.descriptionContainer}>
                <div className={styles.descriptionItem}>
                    <p>Alteração de posição (Rodízio):</p>
                    <div className={styles.selectContainer}>
                        <p>De <span>{tyre.posicao}</span> para</p>
                        <Dropdown
                            size="small"
                            ariaLabel="Nova posição"
                            value={newPosition}
                            onChange={setNewPosition}
                            options={tyresPositions.map(position => ({ value: position, label: position }))}
                        />
                    </div>
                </div>
                
                <p>Enviado para recapagem?</p>
                <div className={styles.radioContainer}>
                    <input type="radio" id="recapagem-yes" name="recapagem" value="yes" />
                    <label htmlFor="recapagem-yes">Sim</label>
                    
                    <input type="radio" id="recapagem-no" name="recapagem" value="no" />
                    <label htmlFor="recapagem-no">Não</label>
                </div>

                <p>Substituição de pneu?</p>
                <div className={styles.radioContainer}>
                    <input type="radio" id="substitution-yes" name="substitution" value="yes" onChange={() => onSubstitutionChange?.(true)} />
                    <label htmlFor="substitution-yes">Sim</label>
                    
                    <input type="radio" id="substitution-no" name="substitution" value="no" defaultChecked onChange={() => onSubstitutionChange?.(false)} />
                    <label htmlFor="substitution-no">Não</label>
                </div>
                
                <p>O pneu foi vendido?</p>
                <div className={styles.radioContainer}>
                    <input type="radio" id="sold-yes" name="sold" value="yes" />
                    <label htmlFor="sold-yes">Sim</label>
                    
                    <input type="radio" id="sold-no" name="sold" value="no" />
                    <label htmlFor="sold-no">Não</label>
                </div>

                <p>O pneu foi sucateado?</p>
                <div className={styles.radioContainer}>
                    <input type="radio" id="scrapped-yes" name="scrapped" value="yes" />
                    <label htmlFor="scrapped-yes">Sim</label>
                    
                    <input type="radio" id="scrapped-no" name="scrapped" value="no" />
                    <label htmlFor="scrapped-no">Não</label>
                </div>
            </div>
        </div>
    );
};

export default Caster;
