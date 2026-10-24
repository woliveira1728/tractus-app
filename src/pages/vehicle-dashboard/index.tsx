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
  const { vehicleSelected, pneusSelected, navigate } = useUser();
  const [openTyreModal, setOpenTyreModal] = React.useState(false);
  const [tyreSelected, setTyreSelected] = React.useState<Pneu | null>(null);
  const [openHistoricalModal, setOpenHistoricalModal] = React.useState(false);

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
            onClick={() => navigate('/report-sent')}
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
          <TyreDashboardContent tyre={tyreSelected} onClose={handleCloseTyreModal} />
        </Modal>

        <Modal isOpen={openHistoricalModal} onClose={() => setOpenHistoricalModal(false)}>
          <HistoricalContent tyres={tyres} />
        </Modal>
      </main>
    </TemplatePage>
  );
};

export default VehicleDashboard;
