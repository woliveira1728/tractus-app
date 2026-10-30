import React from 'react';
import TemplatePage from '../template';
import styles from './styles.module.scss';
import eixoWithConnection from '../../assets/eixo-conexao.png';
import eixoWithoutConnection from '../../assets/eixo-final.png';
import { useUser } from '../../providers/userContextValues';
import Modal from '../../components/Modal';
import { TyreDashboardContent } from '../../components/tyre-dashboard';
import { HistoricalContent } from '../../components/historical';
import type { Pneu } from '../../types';

const VehicleDashboard = () => {
  const { vehicleSelected, pneusSelected, navigate, isOnline } = useUser();
  const [openTyreModal, setOpenTyreModal] = React.useState(false);
  const [tyreSelected, setTyreSelected] = React.useState<Pneu | null>(null);
  const [openHistoricalModal, setOpenHistoricalModal] = React.useState(false);
  const [etapa, setEtapa] = React.useState<'nada' | 'confirmar' | 'enviado' | 'offline'>('nada');
  const [antes, setAntes] = React.useState<Record<string, { pressao: number; sulco: number }>>({});

  const [editados, setEditados] = React.useState<string[]>([]);
  const [mensagem, setMensagem] = React.useState('');

  const handleSaved = (posicao: string) => {
    setEditados(prev => (prev.includes(posicao) ? prev : [...prev, posicao]));
    if (tyreSelected) {
      setAntes(prev => (prev[posicao] ? prev : { ...prev, [posicao]: { pressao: tyreSelected.pressao, sulco: tyreSelected.sulco } }));
    }
    setMensagem(`Alterações do pneu ${posicao} salvas!`);
    setTimeout(() => setMensagem(''), 3000);
  };

  const alterados = (pneusSelected ?? []).filter(p => editados.includes(p.posicao));
  const temCritico = alterados.some(p => p.status === 'CRÍTICO');
  const temAlerta = alterados.some(p => p.status === 'ALERTA');
  const fmt = (n?: number) => (n !== undefined ? n.toLocaleString('pt-BR') : '-');

  const finalizar = () => {
    setEtapa('nada');
    navigate('/identification');
  };


  const handleTyreSelect = (tyrePosition: string) => {
    const tyre = pneusSelected?.find(p => p.posicao === tyrePosition) || null;
    if (!tyre) {
      return;
    }
    setTyreSelected(tyre);
    setOpenTyreModal(true);
  }

  return (
    <TemplatePage>
      <main className={styles.vehicleDashboardContainer}>
        {mensagem && <div className={styles.msgSalvo}>{mensagem}</div>}
        <h1>Identificação do veículo</h1>
        {
          !vehicleSelected ?
            <p>Nenhum veículo selecionado.</p>
          :    
            <ul className={styles.eixosContainer}>
              {
                Array.from({ length: vehicleSelected.eixos }).map((_, idx) => {
                  const number = idx + 1;
                  const isLast = number === vehicleSelected.eixos;
                  const img = isLast ? eixoWithoutConnection : eixoWithConnection;

                  return (
                    <li key={`eixo-${number}`}>
                      <p className={styles.pLeft} >
                        <span onClick={() => handleTyreSelect(`L${number}`)}>{`L${number}`}</span>
                      </p>
                      <img src={img} alt={`Eixo ${number}`} />
                      <p className={styles.pRight}>
                        <span onClick={() => handleTyreSelect(`R${number}`)}>{`R${number}`}</span>
                      </p>
                    </li>
                  );
                })
              }
            </ul>
        }

        <div style={{ display: 'flex', gap: 8 }}>
          <button className={styles.button} onClick={() => setOpenHistoricalModal(true)}>
            Histórico
          </button>

          <button className={styles.button} onClick={() => setEtapa('confirmar')}>
            Enviar Relatório
          </button>
        </div>

        <Modal
          isOpen={openTyreModal}
          onClose={() => {
            setOpenTyreModal(false);
            setTyreSelected(null);
          }}
          title={tyreSelected?.posicao || ''}
        >
          <TyreDashboardContent
            tyre={tyreSelected}
            editado={!!tyreSelected && editados.includes(tyreSelected.posicao)}
            onSaved={handleSaved}
            onClose={() => {
              setOpenTyreModal(false);
              setTyreSelected(null);
            }}
          />
        </Modal>

        <Modal
          isOpen={openHistoricalModal}
          onClose={() => setOpenHistoricalModal(false)}
          title="Histórico"
        >
          {/* Pass list of tyres and initial index based on selected tyre (if any) */}
          <HistoricalContent
            tyres={pneusSelected ?? vehicleSelected?.pneus ?? []}
            initialIndex={
              tyreSelected && (pneusSelected ?? vehicleSelected?.pneus)
                ? (pneusSelected ?? vehicleSelected?.pneus)!.findIndex((p) => p.posicao === tyreSelected.posicao)
                : 0
            }
          />
        </Modal>

        <Modal isOpen={etapa !== 'nada'} onClose={() => setEtapa('nada')} hideHeader>
          <div className={styles.caixa}>
            {etapa === 'confirmar' && (
              <>
                <h3>Confirma essas informações?</h3>
                <p>Relatório do veículo {vehicleSelected?.placa ?? 'N/D'}</p>
                {temCritico && (
                  <div className={styles.alertaCritico}>⚠️ Atenção! Há pneu com sulco crítico (até 1,6 mm). Ele deve ir para sucata.</div>
                )}
                {temAlerta && (
                  <div className={styles.alertaRecapagem}>⚠️ Atenção! Há pneu com sulco entre 1,7 e 4,0 mm. Ele deve ir para recapagem.</div>
                )}
                {alterados.length === 0 ? (
                  <p>Nenhum pneu foi alterado.</p>
                ) : (
                  <ul className={styles.resumo}>
                    {alterados.map(p => (
                      <li key={p.posicao} className={p.status === 'CRÍTICO' ? styles.itemCritico : p.status === 'ALERTA' ? styles.itemAlerta : ''}>
                        <strong>Pneu {p.posicao}</strong>
                        <span>Pressão: {fmt(antes[p.posicao]?.pressao)} → {fmt(p.pressao)} psi</span>
                        <span>Sulco: {fmt(antes[p.posicao]?.sulco)} → {fmt(p.sulco)} mm</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className={styles.botoes}>
                  <button type="button" className={styles.btnSecundario} onClick={() => setEtapa('nada')}>Não</button>
                  <button type="button" className={styles.btnPrimario} onClick={() => setEtapa(isOnline ? 'enviado' : 'offline')}>Sim</button>
                </div>
              </>
            )}
            {etapa === 'enviado' && (
              <>
                <h3>Enviado para a recapagem</h3>
                <button type="button" className={styles.btnPrimario} onClick={finalizar}>Concluir</button>
              </>
            )}
            {etapa === 'offline' && (
              <>
                <h3>Você está offline</h3>
                <p>O relatório foi salvo no aparelho e será enviado quando a conexão voltar.</p>
                <button type="button" className={styles.btnPrimario} onClick={finalizar}>Entendi</button>
              </>
            )}
          </div>
        </Modal>
      </main>
    </TemplatePage>
  )
}

export default VehicleDashboard;