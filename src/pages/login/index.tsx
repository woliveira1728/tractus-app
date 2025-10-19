import TemplatePage from '../template';
import styles from './styles.module.scss';
import { FaUser, FaLock } from 'react-icons/fa';

function LoginPage() {

  return (
    <TemplatePage>
      <main className={styles.mainContainer}>
        <h1>Login</h1>
        <form className={styles.formContainer}>
          <div className={styles.inputWrapper}>
            <FaUser className={styles.inputIcon} />
            <input type="text" placeholder="Usuário" />
          </div>
          <div className={styles.inputWrapper}>
            <FaLock className={styles.inputIcon} />
            <input type="password" placeholder="Senha" />
          </div>
          <button type="submit">Entrar</button>
        </form>
        <a href="#" rel="noopener noreferrer">
          Esqueceu a senha? Clique aqui.
        </a>
      </main>
    </TemplatePage>
  )
}

export default LoginPage;