import React from 'react';
import Caster from '../caster';
import Tyre from '../tyre';
import TemplatePage from '../../pages/template';
import styles from './styles.module.scss';
import type { ChangeEvent } from 'react';
import type { Pneu } from '../../types';

type TyreDashboardContentProps = {
  tyre?: Pneu | null;
  onClose?: () => void;
};

export const TyreDashboardContent = ({ tyre }: TyreDashboardContentProps) => {
  const [ movement, setMovement ] = React.useState(false);

  const handleMovementChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'rodizio') {
      setMovement(true);
    } else {
      setMovement(false);
    }
  };

  return (
    <main className={styles.tyreDashboardContainer}>
      {movement ? <Caster tyre={tyre!} /> : (tyre ? <Tyre tyre={tyre} /> : null)}

      <div className={styles.infoContainer}>
        <p>Movimentação</p>
        <select name="movement" id="movement" defaultValue="sem-movimentacao" onChange={handleMovementChange}>
          <option value="recapagem">Recapagem</option>
          <option value="rodizio">Rodízio</option>
          <option value="sem-movimentacao">Sem movimentação</option>
        </select>
      </div>

      <button className={styles.button}> Salvar e avançar </button>
    </main>
  );
};

const TyreDashboardPage = () => (
  <TemplatePage>
    <TyreDashboardContent />
  </TemplatePage>
);

export default TyreDashboardPage;