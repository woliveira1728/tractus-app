import { useState } from 'react';
import type { Pneu } from '../../types';
import styles from './styles.module.scss';
import {getSulcoPrescription} from '../../utils/sulco';

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
    };

    const valorSulco = parseFloat((novoSulco ?? '').replace(',', '.'));
    const prescricao = Number.isNaN(valorSulco) ? null : getSulcoPrescription(valorSulco, recapagens);
    const alerta = prescricao && prescricao.level !== 'safe' ? prescricao : null;

    return (
        <section className={styles.tyreInfoSection}>
            <div className={styles.infoContainer}>
            <p>Número de Fogo</p>
            <div className={styles.card}>
                <div className={styles.cardValor}>{tyre.fogo}</div>
            </div>
            </div>
            <div className={styles.infoContainer}>
            <p>Última Pressão Medida (ps)</p>
            <div className={styles.card}>
                <div className={styles.cardValor}>{tyre.pressao}<small> ps</small></div>
            </div>
            </div>
            <div className={styles.infoContainer}>
                <p>Nova Pressão (ps)</p>
                <input type="number" placeholder='80' value={novaPressao} onChange={(e) => setNovaPressao(e.target.value)} />
            </div>
            <div className={styles.infoContainer}>
                <p>Profundidade do Sulco (mm)</p>
                <div className={styles.inputWrapper}>
                    <input type="number" placeholder='8' value={novoSulco} onChange={(e) => setNovoSulco(e.target.value)} onBlur={handleSulcoBlur} className={alerta ? (alerta.level === 'critical' ? styles.inputCritical : styles.inputWarning) : ''} />
                    {alerta && <div className={`${styles.icone} ${styles[alerta.level]}`}>⚠</div>}
                </div>
                {alerta && (
                <div role="alert" className={`${styles.alertaTexto} ${styles[alerta.level]}`}>
                <div className={styles.titulo}>{alerta.title}</div>
                <div className={styles.descricao}>{alerta.description}</div>
                </div>
            )}
            </div>            
        </section>
    );
};

export default Tyre;
