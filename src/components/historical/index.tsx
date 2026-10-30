import { useState, type FC } from 'react';
import styles from './styles.module.scss';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import type { Pneu } from '../../types';
import TemplatePage from '../../pages/template';
import { useUser } from '../../providers/userContextValues';
import { getSulcoPrescription, RECAPAGENS_MAX } from '../../utils/sulco';

type Props = {
  tyres?: Pneu[];
  initialIndex?: number;
};

const STATUS_LABEL = {
  safe: { badge: 'Seguro', message: 'Pneu apto a rodar' },
  warning: { badge: 'Atenção', message: 'Recomendado enviar para recapagem' },
  critical: { badge: 'Crítico', message: 'Retirar de uso: limite atingido' },
};

const sortByPosition = (tyres: Pneu[]) =>
  [...tyres].sort((a, b) => {
    if (a.posicao[0] !== b.posicao[0]) return a.posicao[0] === 'R' ? -1 : 1;
    return Number(a.posicao.slice(1)) - Number(b.posicao.slice(1));
  });

const getPositionName = (posicao: string) => {
  const eixo = Number(posicao.slice(1));
  const lado = posicao[0] === 'L' ? 'esquerdo' : 'direito';
  const tipo = eixo === 1 ? 'Dianteiro' : 'Traseiro';
  return `Eixo ${eixo} · ${tipo} ${lado}`;
};

const formatNumber = (value: number) => value.toLocaleString('pt-BR');

export const HistoricalContent: FC<Props> = ({ tyres = [], initialIndex = 0 }) => {
  const { getHistoryByPneuId } = useUser();
  const list = sortByPosition(tyres);
  const total = list.length;
  const [index, setIndex] = useState(() => Math.max(0, Math.min(initialIndex, total - 1)));

  if (!total) {
    return (
      <main className={styles.historicalContainer}>
        <p className={styles.emptyMessage}>Nenhum pneu encontrado para este veículo.</p>
      </main>
    );
  }

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  const current = list[index];
  const history = getHistoryByPneuId ? getHistoryByPneuId(current.id).slice(0, 3) : [];
  const { level } = getSulcoPrescription(current.sulco, current.recapagens);
  const status = STATUS_LABEL[level];
  const lastPressure = current.ultimaPressao ?? current.pressao;

  return (
    <main className={styles.historicalContainer}>
      <div className={styles.cardHeader}>
        <span className={styles.positionBadge}>{current.posicao}</span>
        <div className={styles.headerText}>
          <h2>Pneu {current.posicao}</h2>
          <p>{getPositionName(current.posicao)}</p>
        </div>
        <span className={`${styles.statusBadge} ${styles[level]}`}>{status.badge}</span>
      </div>

      <p className={`${styles.statusMessage} ${styles[level]}`}>{status.message}</p>

      <div className={styles.metricsGrid}>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Sulco</span>
          <strong>{formatNumber(current.sulco)} mm</strong>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Pressão atual</span>
          <strong>{current.pressao} psi</strong>
          <small>antes: {lastPressure} psi</small>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Número de fogo</span>
          <strong>{current.fogo}</strong>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Recapagens</span>
          <strong>{current.recapagens}</strong>
          <small>de {RECAPAGENS_MAX} permitidas</small>
        </div>
      </div>

      <div className={styles.servicesSection}>
        <h3>Serviços realizados</h3>
        {history.length === 0 ? (
          <p className={styles.noServices}>Nenhum serviço registrado para este pneu.</p>
        ) : (
          <ul className={styles.servicesList}>
            {history.map((item) => (
              <li key={item.id}>
                <div className={styles.serviceTop}>
                  <strong>{item.movimentacao}</strong>
                  <span>{new Date(item.data).toLocaleDateString('pt-BR')}</span>
                </div>
                <p>
                  Sulco {formatNumber(item.sulcoAnterior)} → {formatNumber(item.sulcoNovo)} mm · Pressão{' '}
                  {item.pressaoAnterior} → {item.pressaoNova} psi
                </p>
                <small>por {item.usuario}</small>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.pagination}>
        <button type="button" className={styles.pageButton} aria-label="Pneu anterior" onClick={prev}>
          <FiChevronLeft size={22} />
        </button>
        <span className={styles.pageCounter}>
          {index + 1} de {total}
        </span>
        <button type="button" className={styles.pageButton} aria-label="Próximo pneu" onClick={next}>
          <FiChevronRight size={22} />
        </button>
      </div>
    </main>
  );
};

const HistoricalPage = () => {
  const { pneusSelected } = useUser();

  return (
    <TemplatePage>
      <HistoricalContent tyres={pneusSelected ?? []} />
    </TemplatePage>
  );
};

export default HistoricalPage;
