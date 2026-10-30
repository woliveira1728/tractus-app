import TemplatePage from '../template';
import styles from './styles.module.scss';
import { MdVerified } from 'react-icons/md';

const ReportSent = () => {
  return (
    <TemplatePage>
      <main className={styles.reportSentContainer}>
        <MdVerified className={styles.icon} size={128} />

        <h1 className={styles.title}>Enviado para a recapagem</h1>
        <p className={styles.subtitle}>
          Seu relatório foi enviado
          <br />
          para a recapagem
        </p>

        <button
          type="button"
          className={styles.buttonBack}
          onClick={() => window.history.back()}
        >
          Voltar para o mapeamento
        </button>
      </main>
    </TemplatePage>
  );
};

export default ReportSent;
