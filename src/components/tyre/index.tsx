import { useState } from 'react';
import type { Pneu } from '../../types';
import styles from './styles.module.scss';
import { checkSulcoAndNotify } from '../../utils/sulco';

const Tyre = ({ tyre, recapagens = 0 } : { tyre: Pneu; recapagens?: number }) => {
    const [novaPressao, setNovaPressao] = useState<string>('');
    const [novoSulco, setNovoSulco] = useState<string>('');

    const handleSulcoBlur = () => {
        const raw = novoSulco.replace(',', '.');
        const value = parseFloat(raw);
        if (Number.isNaN(value)) return;
        checkSulcoAndNotify(value, recapagens);
    };

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
                <input type="number" placeholder='190' value={novaPressao} onChange={(e) => setNovaPressao(e.target.value)} />
            </div>
            <div className={styles.infoContainer}>
                <p>Profundidade do Sulco</p>
                <input type="number" placeholder='8' value={novoSulco} onChange={(e) => setNovoSulco(e.target.value)} onBlur={handleSulcoBlur} />
            </div>
        </section>
    );
};

export default Tyre;
