import React from 'react';
import TemplatePage from '../template';
import styles from './styles.module.scss';
import { useUser } from '../../providers/userContextValues';
import Modal from '../../components/Modal';
import TruckMap from '../../components/truck-map';
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

  const tyres = pneusSelected ?? vehicleSelected?.pneus ?? [];

  const handleTyreSelect = (tyrePosition: string) => {
    const tyre = tyres.find((p) => p.posicao === tyrePosition) || null;
    if (!tyre) {
      return;
    }
    setTyreSelected(tyre);
    setOpenTyreModal(true);
  };

  const handleCloseTyreModal = () => {
    setOpenTyreModal(false);
    setTyreSelected(null);
  };

  return (
    <TemplatePage>
      <main className={styles.vehicleDashboardContainer}>
        {mensagem && <div className={styles.msgSalvo}>{mensagem}</div>}
        <h1 className={styles.title}>Painel Visual do Veículo</h1>

        {!vehicleSelected ? (
          <p className={styles.emptyMessage}>Nenhum veículo selecionado.</p>
        ) : (
          <TruckMap
            eixos={vehicleSelected.eixos}
            positions={tyres.map((p) => p.posicao)}
            onSelect={handleTyreSelect}
          />
        )}

        <div className={styles.actionsBlock}>
          <button
            type="button"
            className={styles.buttonHistorical}
            onClick={() => setOpenHistoricalModal(true)}
            disabled={!vehicleSelected}
          >
            Histórico do Veículo
          </button>

          <button
            type="button"
            className={styles.buttonReport}
            onClick={() => setEtapa('confirmar')}
            disabled={!vehicleSelected}
          >
            Enviar Relatório
          </button>
        </div>

        <Modal
          isOpen={openTyreModal}
          onClose={handleCloseTyreModal}
          title={tyreSelected?.posicao || ''}
        >
          <TyreDashboardContent
            tyre={tyreSelected}
            editado={!!tyreSelected && editados.includes(tyreSelected.posicao)}
            onSaved={handleSaved}
            onClose={handleCloseTyreModal}
          />
        </Modal>

        <Modal isOpen={openHistoricalModal} onClose={() => setOpenHistoricalModal(false)}>
          <HistoricalContent tyres={tyres} />
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
  );
};

export default VehicleDashboard;