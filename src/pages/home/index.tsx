import TemplatePage from '../template';
import styles from './styles.module.scss';
import { useUser } from '../../providers/userContextValues';

const HomePage = () => {
  const { navigate } = useUser();

  return (
    <TemplatePage hideNavRow>
      <main className={styles.homeContainer}>
        <div className={styles.brandBlock}>
          <h1 className={styles.brandTitle}>
            TRACTUS<span>APP</span>
          </h1>
        </div>

        <div className={styles.actionsBlock}>
          <button
            type="button"
            className={styles.loginBtn}
            onClick={() => navigate('/login')}
          >
            Login
          </button>

          <button
            type="button"
            className={styles.registerBtn}
            onClick={() => navigate('/register')}
          >
            Registrar
          </button>
        </div>
      </main>
    </TemplatePage>
  );
};

export default HomePage;
