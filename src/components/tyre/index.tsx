import { useState } from 'react';
import type { Pneu } from '../../types';
import styles from './styles.module.scss';
import { checkSulcoAndNotify } from '../../utils/sulco';

type TyreProps = {
  tyre: Pneu;
  recapagens?: number;
  novaPressao?: string;
  setNovaPressao?: (v: string) => void;
  novoSulco?: string;
  setNovoSulco?: (v: string) => void;
};

const Tyre = ({ tyre, recapagens = 0, novaPressao: propPressao, setNovaPressao: setPropPressao, novoSulco: propSulco, setNovoSulco: setPropSulco }: TyreProps) => {
    const [localPressao, setLocalPressao] = useState<string>('');
    const [localSulco, setLocalSulco] = useState<string>('');

    const novaPressao = propPressao ?? localPressao;
    const setNovaPressao = setPropPressao ?? setLocalPressao;

    const novoSulco = propSulco ?? localSulco;
    const setNovoSulco = setPropSulco ?? setLocalSulco;

    const handleSulcoBlur = () => {
        const raw = (novoSulco ?? '').toString().replace(',', '.');
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
                <input type="number" placeholder='80' value={novaPressao} onChange={(e) => setNovaPressao(e.target.value)} />
            </div>
            <div className={styles.infoContainer}>
                <p>Profundidade do Sulco</p>
                <input type="number" placeholder='8' value={novoSulco} onChange={(e) => setNovoSulco(e.target.value)} onBlur={handleSulcoBlur} />
            </div>
        </section>
    );
};

export default Tyre;
