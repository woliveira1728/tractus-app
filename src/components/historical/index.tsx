import React, { useState, type FC } from 'react';
import styles from './styles.module.scss';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import type { Pneu } from '../../types';
import TemplatePage from '../../pages/template';

type Props = {
  tyres?: Pneu[];
  positionLabel?: string; // fallback when tyres not provided
  initialIndex?: number;
};

export const HistoricalContent: FC<Props> = ({ tyres, positionLabel = 'L1', initialIndex }) => {
  const list = tyres && tyres.length ? tyres : undefined;
  const total = list ? list.length : 1;
  const [index, setIndex] = useState(() => {
    const idx = typeof initialIndex === 'number' ? initialIndex : 0;
    return list ? Math.max(0, Math.min(idx, list.length - 1)) : 0;
  });

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  React.useEffect(() => {
    // If the list changes or initialIndex changes, clamp the index
    if (!list) {
      setIndex(0);
      return;
    }
    if (typeof initialIndex === 'number') {
      setIndex(Math.max(0, Math.min(initialIndex, list.length - 1)));
    } else {
      setIndex((i) => Math.max(0, Math.min(i, list.length - 1)));
    }
  }, [list, initialIndex]);

  const current = list ? list[index] : undefined;
  const label = current?.posicao ?? positionLabel;

  return (
    <main className={styles.historicalContainer}>
      <div className={styles.contentServices}>
        <h2 className={styles.serviceTitle}><span>{label}</span> - Pneu {label}</h2>
        <div className={styles.serviceItem}>
          <p>Histórico de serviços</p>
        </div>
        <div className={styles.descriptionContainer}>
          <p className={styles.descriptionDate}>{current ? new Date().toLocaleDateString() : '10/10/2025'}</p>
          <p>Placa: <span>{current?.placa ?? '—'}</span></p>
          <p>Fogo: <span>{current?.fogo ?? '—'}</span></p>
          <p>Sulco: <span>{current?.sulco ?? '—'} mm</span></p>
          <p>Pressão: <span>{current?.pressao ?? '—'}</span></p>
          <p>Movimentações realizadas:</p>
          <ul>
            <li>Recapagem</li>
            <li>Rodízio</li>
          </ul>
        </div>
      </div>
      <div className={styles.buttonsContainer}>
        <button className={styles.button} aria-label="Voltar" onClick={prev}>
          <FiChevronLeft size={40} />
        </button>
        <div style={{ alignSelf: 'center' }}>{list ? `${index + 1} / ${total}` : '—'}</div>
        <button className={styles.button} aria-label="Avançar" onClick={next}>
          <FiChevronRight size={40} />
        </button>
      </div>
    </main>
  );
};

const HistoricalPage = () => (
  <TemplatePage>
    <HistoricalContent />
  </TemplatePage>
);

export default HistoricalPage;