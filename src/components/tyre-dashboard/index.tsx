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
  editado?: boolean;
  onSaved?: (posicao: string) => void;
};

export const TyreDashboardContent = ({ tyre, onClose, editado, onSaved }: TyreDashboardContentProps) => {
  const [movement, setMovement] = React.useState(false);
  const [novaPressao, setNovaPressao] = React.useState<string>(editado && tyre ? String(tyre.pressao) : '');
  const [novoSulco, setNovoSulco] = React.useState<string>(editado && tyre ? String(tyre.sulco) : '');
  const [substitutionRequested, setSubstitutionRequested] = React.useState(false);
  const [replacementOpen, setReplacementOpen] = React.useState(false);

  const { updateTyreMeasurements, replaceTyre } = useUser();

  const handleMovementChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setMovement(e.target.value === 'substituicao');
  };

  const voltar = () => {
    if (tyre) onSaved?.(tyre.posicao);
    if (onClose) onClose();
  };

  // salva o pneu e volta para a tela do caminhão
  const salvar = () => {
    if (!tyre) return;
    const rawSulco = (novoSulco ?? '').toString().replace(',', '.');
    const sulcoVal = rawSulco ? parseFloat(rawSulco) : undefined;
    const pressVal = novaPressao ? parseFloat(novaPressao) : undefined;
    const saved = updateTyreMeasurements ? updateTyreMeasurements(tyre.id, pressVal, sulcoVal, 'Sem Movimentação', true) : false;
    if (!saved) return;
    if (substitutionRequested) {
      setReplacementOpen(true);
      return;
    }
    voltar();
  };

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

      <button className={styles.button} onClick={salvar}>Salvar e avançar</button>

      <ReplacementTyreModal
        isOpen={replacementOpen}
        onClose={() => setReplacementOpen(false)}
        onSave={(newTyre) => {
          if (!tyre) {
            setReplacementOpen(false);
            return;
          }
          if (replaceTyre) replaceTyre(tyre.id, newTyre, 'Substituição - novo pneu');
          setReplacementOpen(false);
          setSubstitutionRequested(false);
          voltar();
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