import React from 'react';
import TemplatePage from '../template';
import styles from './styles.module.scss';
import eixoWithConnection from '../../assets/eixo-conexao.png';
import eixoWithoutConnection from '../../assets/eixo-final.png';
import { useUser } from '../../providers/userContextValues';
import { toast } from 'react-toastify';
import Modal from '../../components/Modal';
import { TyreDashboardContent } from '../../components/tyre-dashboard';
import { HistoricalContent } from '../../components/historical';
import type { Pneu } from '../../types';

const VehicleDashboard = () => {
  const { vehicleSelected, pneusSelected } = useUser();
  const [openTyreModal, setOpenTyreModal] = React.useState(false);
  const [tyreSelected, setTyreSelected] = React.useState<Pneu | null>(null);
  const [openHistoricalModal, setOpenHistoricalModal] = React.useState(false);


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

          <button
            className={styles.button}
            onClick={() => {
              const placa = vehicleSelected?.placa ?? 'N/D';
              toast.info(`Relatório do veículo ${placa} enviado com sucesso.`);
            }}
          >
            Enviar relatório
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
      </main>
    </TemplatePage>
  )
}

export default VehicleDashboard;