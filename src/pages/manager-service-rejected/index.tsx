
import { Navigate, useNavigate } from 'react-router-dom';
import TemplatePage from '../template';
import { useUser } from '../../providers/userContextValues';
import rejectedIcon from '../../assets/servico-reprovado.svg';
import styles from './styles.module.scss';

function ManagerServiceRejectedPage() {
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
            src={rejectedIcon}
            alt=""
            className={styles.rejectedIcon}
          />

          <h1 className={styles.title}>
            Serviço Não Aprovado
          </h1>

          <p className={styles.description}>
            Foi solicitada a realização
            <br />
            do serviço novamente
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

export default ManagerServiceRejectedPage;
