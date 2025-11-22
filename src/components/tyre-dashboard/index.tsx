import React from 'react';
import Caster from '../caster';
import Tyre from '../tyre';
import { useUser } from '../../providers/userContextValues';
import ReplacementTyreModal from '../replacement-tyre';
import TemplatePage from '../../pages/template';
import styles from './styles.module.scss';
import type { ChangeEvent } from 'react';
import type { Pneu } from '../../types';

type TyreDashboardContentProps = {
  tyre?: Pneu | null;
  onClose?: () => void;
};

export const TyreDashboardContent = ({ tyre, onClose }: TyreDashboardContentProps) => {
  const [ movement, setMovement ] = React.useState(false);
  const [novaPressao, setNovaPressao] = React.useState<string>('');
  const [novoSulco, setNovoSulco] = React.useState<string>('');

  const { updateTyreMeasurements, findTyreById } = useUser();

  const handleMovementChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'substituicao') {
      setMovement(true);
    } else {
      setMovement(false);
    }
  };

  const [substitutionRequested, setSubstitutionRequested] = React.useState(false);
  const [replacementOpen, setReplacementOpen] = React.useState(false);

  return (
    <main className={styles.tyreDashboardContainer}>
      {movement ? <Caster tyre={tyre!} onSubstitutionChange={(v) => setSubstitutionRequested(v)} /> : (tyre ? <Tyre tyre={tyre} novaPressao={novaPressao} setNovaPressao={setNovaPressao} novoSulco={novoSulco} setNovoSulco={setNovoSulco} recapagens={tyre?.recapagens ?? 0} /> : null)}

      <div className={styles.infoContainer}>
        <p>Movimentação</p>
        <select name="movement" id="movement" defaultValue="sem-movimentacao" onChange={handleMovementChange}>
          <option value="sem-movimentacao">Sem movimentação</option>
          <option value="substituicao">Substituição</option>
        </select>
      </div>

      <button
        className={styles.button}
        onClick={() => {
          if (!tyre) return;
          const rawSulco = (novoSulco ?? '').toString().replace(',', '.');
          const sulcoVal = rawSulco ? parseFloat(rawSulco) : undefined;
          const pressVal = novaPressao ? parseFloat(novaPressao) : undefined;

          // if substitutionRequested we suppress the immediate toast; the replacement modal will trigger confirmation
          const saved = updateTyreMeasurements ? updateTyreMeasurements(tyre.id, pressVal, sulcoVal, 'Sem Movimentação', substitutionRequested) : false;

          // when saved:
          if (saved) {
            if (substitutionRequested) {
              // open replacement modal so user can provide new tyre data
              setReplacementOpen(true);
              return;
            }

            // For 'Sem movimentação' we close all modals and return to tyre dashboard
            setNovaPressao('');
            setNovoSulco('');
            if (onClose) onClose();
          }
        }}
      > Salvar e avançar </button>

      <ReplacementTyreModal
        isOpen={replacementOpen}
        onClose={() => setReplacementOpen(false)}
        onSave={(newTyre) => {
          if (!tyre) {
            setReplacementOpen(false);
            return;
          }

          const found = findTyreById ? findTyreById(tyre.id) : null;
          if (found) {
            const t = found.tyre;
            if (newTyre.fogo) t.fogo = newTyre.fogo as string;
            if (newTyre.pressao !== undefined) t.pressao = newTyre.pressao as number;
            if (newTyre.sulco !== undefined) t.sulco = newTyre.sulco as number;
            t.recapagens = 0;

            if (updateTyreMeasurements) {
              updateTyreMeasurements(t.id, t.pressao, t.sulco, 'Substituição - novo pneu');
            }
          }

          setReplacementOpen(false);
          setSubstitutionRequested(false);

          // After replacement is saved, close all modals and return to tyre dashboard
          if (onClose) onClose();
        }}
      />
    </main>
  );
};

const TyreDashboardPage = () => (
  <TemplatePage>
    <TyreDashboardContent />
  </TemplatePage>
);

export default TyreDashboardPage;