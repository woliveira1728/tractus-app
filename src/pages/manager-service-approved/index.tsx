
import { Navigate, useNavigate } from 'react-router-dom';
import TemplatePage from '../template';
import { useUser } from '../../providers/userContextValues';
import approvedIcon from '../../assets/servico-aprovado.svg';
import styles from './styles.module.scss';

function ManagerServiceApprovedPage() {
  const navigate = useNavigate();
  const { user } = useUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'gerente') {
    return <Navigate to="/identification" replace />;
  }

  const handleBackToHistory = () => {
    navigate('/manager/services', { replace: true });
  };

  return (
    <TemplatePage
      showBack
      onBack={handleBackToHistory}
    >
      <main className={styles.container}>
        <div className={styles.confirmationContent}>
          <img
            src={approvedIcon}
            alt=""
            className={styles.approvedIcon}
          />

          <h1 className={styles.title}>
            Serviço Aprovado
          </h1>

          <p className={styles.description}>
            O serviço foi finalizado e
            <br />
            salvo no histórico.
          </p>

          <button
            type="button"
            className={styles.backButton}
            onClick={handleBackToHistory}
          >
            Voltar para o Histórico de Serviços
          </button>
        </div>
      </main>
    </TemplatePage>
  );
}

export default ManagerServiceApprovedPage;
