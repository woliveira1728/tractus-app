import React from 'react';
import TemplatePage from '../template';
import styles from './styles.module.scss';
import eixoWithConnection from '../../assets/eixo-conexao.png';
import eixoWithoutConnection from '../../assets/eixo-final.png';
import { useUser } from '../../providers/userContextValues';
import Modal from '../../components/Modal';
import { TyreDashboardContent } from '../../components/tyre-dashboard';
import type { Pneu } from '../../types';

const VehicleDashboard = () => {
  const { vehicleSelected, pneusSelected } = useUser();
  const [openTyreModal, setOpenTyreModal] = React.useState(false);
  const [tyreSelected, setTyreSelected] = React.useState<Pneu | null>(null);


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
          <button className={styles.button}> Histórico do veículo </button>
        </div>

        <Modal
          isOpen={openTyreModal}
          onClose={() => setOpenTyreModal(false)}
          title={tyreSelected?.posicao || ''}
        >
          <TyreDashboardContent tyre={tyreSelected} onClose={() => setOpenTyreModal(false)} />
        </Modal>
      </main>
    </TemplatePage>
  )
}

export default VehicleDashboard;