import React from 'react';
import styles from './styles.module.scss';
import Dropdown from '../dropdown';
import { useUser } from '../../providers/userContextValues';
import type { Pneu } from '../../types';

type Resposta = 'sim' | 'nao' | null;

type SimNaoProps = {
  pergunta: string;
  valor: Resposta;
  onChange: (v: Resposta) => void;
};

// Pergunta com botões grandes de Sim e Não
const SimNao = ({ pergunta, valor, onChange }: SimNaoProps) => (
  <div className={styles.pergunta}>
    <p>{pergunta}</p>
    <div className={styles.botoes}>
      <button type="button" className={`${styles.botao} ${valor === 'sim' ? styles.ativo : ''}`} onClick={() => onChange('sim')}>Sim</button>
      <button type="button" className={`${styles.botao} ${valor === 'nao' ? styles.ativo : ''}`} onClick={() => onChange('nao')}>Não</button>
    </div>
  </div>
);

const Caster = ({ tyre, onSubstitutionChange }: { tyre: Pneu; onSubstitutionChange?: (v: boolean) => void }) => {
  const { vehicleSelected } = useUser();
  const tyresPositions = vehicleSelected ? vehicleSelected.pneus.map(p => p.posicao) : [];
  const opcoes = tyresPositions.map(p => ({ value: p, label: p }));

  const [alteracao, setAlteracao] = React.useState<Resposta>(null);
  const [recapagem, setRecapagem] = React.useState<Resposta>(null);
  const [substituicao, setSubstituicao] = React.useState<Resposta>('nao');
  const [vendido, setVendido] = React.useState<Resposta>(null);
  const [sucateado, setSucateado] = React.useState<Resposta>(null);
  const [de, setDe] = React.useState(tyre.posicao);
  const [para, setPara] = React.useState(tyre.posicao);

  const handleSubstituicao = (v: Resposta) => {
    setSubstituicao(v);
    onSubstitutionChange?.(v === 'sim');
  };

  return (
    <div className={styles.contentServices}>
      <h2 className={styles.tituloRodizio}>Rodízio - {tyre.posicao}</h2>

      <div className={styles.descriptionContainer}>
        <SimNao pergunta="Alteração da posição?" valor={alteracao} onChange={setAlteracao} />

        {/* Seletores De / Para */}
        {alteracao === 'sim' && (
          <div className={styles.dePara}>
            <label>
              De
              <Dropdown size="small" ariaLabel="Posição de origem" value={de} onChange={setDe} options={opcoes} />
            </label>
            <label>
              Para
              <Dropdown size="small" ariaLabel="Nova posição" value={para} onChange={setPara} options={opcoes} />
            </label>
          </div>
        )}

        <SimNao pergunta="Enviado para recapagem?" valor={recapagem} onChange={setRecapagem} />
        <SimNao pergunta="Substituição de pneu?" valor={substituicao} onChange={handleSubstituicao} />
        <SimNao pergunta="Pneu foi vendido?" valor={vendido} onChange={setVendido} />
        <SimNao pergunta="Pneu foi sucateado?" valor={sucateado} onChange={setSucateado} />
      </div>
    </div>
  );
};

export default Caster;