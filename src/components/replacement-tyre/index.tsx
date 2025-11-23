import React from 'react';
import Modal from '../Modal';
import styles from './styles.module.scss';
import type { Pneu } from '../../types';

type ReplacementTyreProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newTyre: Partial<Pneu>) => void;
};

const ReplacementTyreModal = ({ isOpen, onClose, onSave }: ReplacementTyreProps) => {
    const [id, setId] = React.useState('');
    const [fogo, setFogo] = React.useState('');
    const [pressao, setPressao] = React.useState('');
    const [sulco, setSulco] = React.useState('');
    const [recapagens, setRecapagens] = React.useState('');


    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Dados do novo pneu">
        <div className={styles.container}>
            <div className={styles.field}>
                <label>ID do pneu</label>
                <input value={id} onChange={(e) => setId(e.target.value)} />
            </div>

            <div className={styles.field}>
                <label>Número de fogo</label>
                <input value={fogo} onChange={(e) => setFogo(e.target.value)} />
            </div>
            
            <div className={styles.field}>
                <label>Pressão inicial</label>
                <input type="number" value={pressao} onChange={(e) => setPressao(e.target.value)} />
            </div>
            
            <div className={styles.field}>
                <label>Profundidade do sulco</label>
                <input type="number" value={sulco} onChange={(e) => setSulco(e.target.value)} />
            </div>
            
            <div className={styles.field}>
                <label>Quantidade de recapagens</label>
                <input type="number" value={recapagens} onChange={(e) => setRecapagens(e.target.value)} />
            </div>

            <div className={styles.actions}>
                <button onClick={onClose}>Cancelar</button>
                <button onClick={() => {
                    const newTyre: Partial<Pneu> = {
                    fogo: fogo || undefined,
                    pressao: pressao ? parseFloat(pressao) : undefined,
                    sulco: sulco ? parseFloat(sulco) : undefined,
                    recapagens: recapagens ? parseInt(recapagens, 10) : undefined,
                    };
                    onSave(newTyre);
                }}>Salvar pneu</button>
            </div>
        </div>
        </Modal>
    );
};

export default ReplacementTyreModal;
