import React from 'react';
import Caster from '../caster';
import Tyre from '../tyre';
import { useUser } from '../../providers/userContextValues';
import TemplatePage from '../../pages/template';
import styles from './styles.module.scss';
import type { ChangeEvent } from 'react';
import type { Pneu } from '../../types';

type TyreDashboardContentProps = {
  tyre?: Pneu | null;
  onClose?: () => void;
  onAdvance?: (next: Pneu | null) => void;
};

export const TyreDashboardContent = ({ tyre, onAdvance, onClose }: TyreDashboardContentProps) => {
  const [ movement, setMovement ] = React.useState(false);
  const [novaPressao, setNovaPressao] = React.useState<string>('');
  const [novoSulco, setNovoSulco] = React.useState<string>('');

  const { updateTyreMeasurements, selectNextTyre } = useUser();

  const handleMovementChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'rodizio/recapagem') {
      setMovement(true);
    } else {
      setMovement(false);
    }
  };

  return (
    <main className={styles.tyreDashboardContainer}>
      {movement ? <Caster tyre={tyre!} /> : (tyre ? <Tyre tyre={tyre} novaPressao={novaPressao} setNovaPressao={setNovaPressao} novoSulco={novoSulco} setNovoSulco={setNovoSulco} recapagens={tyre?.recapagens ?? 0} /> : null)}

      <div className={styles.infoContainer}>
        <p>Movimentação</p>
        <select name="movement" id="movement" defaultValue="sem-movimentacao" onChange={handleMovementChange}>
          <option value="sem-movimentacao">Sem movimentação</option>
          <option value="rodizio/recapagem">Rodízio/Recapagem</option>
        </select>
      </div>

      <button
        className={styles.button}
        onClick={() => {
          if (!tyre) return;
          const rawSulco = (novoSulco ?? '').toString().replace(',', '.');
          const sulcoVal = rawSulco ? parseFloat(rawSulco) : undefined;
          const pressVal = novaPressao ? parseFloat(novaPressao) : undefined;

          const saved = updateTyreMeasurements ? updateTyreMeasurements(tyre.id, pressVal, sulcoVal, 'Sem Movimentação') : false;

          // advance selection only when saved
          if (saved) {
            const next = selectNextTyre ? selectNextTyre(tyre.posicao, 'next') : null;
            if (onAdvance) onAdvance(next);
            // reset inputs for next tyre
            setNovaPressao('');
            setNovoSulco('');
            // optionally close modal if there is no next
            if (!next && onClose) onClose();
          }
        }}
      > Salvar e avançar </button>
    </main>
  );
};

const TyreDashboardPage = () => (
  <TemplatePage>
    <TyreDashboardContent />
  </TemplatePage>
);

export default TyreDashboardPage;