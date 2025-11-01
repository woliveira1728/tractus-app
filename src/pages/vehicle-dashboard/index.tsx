import TemplatePage from '../template';
import styles from './styles.module.scss';
import eixoWithConnection from '../../assets/eixo-conexao.png';
import eixoWithoutConnection from '../../assets/eixo-final.png';

const VehicleDashboard = () => {

  return (
    <TemplatePage>
      <main className={styles.vehicleDashboardContainer}>
        <h1>Identificação do veículo</h1>
        <ul className={styles.eixosContainer}>
          <li>
            <p className={styles.pLeft}><span>L1</span></p>
            <img src={eixoWithConnection} alt="Imagem do eixo" />
            <p className={styles.pRight}><span>R1</span></p>
          </li>
          <li>
            <p className={styles.pLeft}><span>L2</span></p>
            <img src={eixoWithConnection} alt="Imagem do eixo" />
            <p className={styles.pRight}><span>R2</span></p>
          </li>
          <li>
            <p className={styles.pLeft}><span>L3</span></p>
            <img src={eixoWithoutConnection} alt="Imagem do eixo" />
            <p className={styles.pRight}><span>R3</span></p>
          </li>
        </ul>
        <button className={styles.button}> Histórico do veículo </button>
      </main>
    </TemplatePage>
  )
}

export default VehicleDashboard;