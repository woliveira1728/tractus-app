import TemplatePage from '../template';
import styles from './styles.module.scss';
import { FaUser, FaLock } from 'react-icons/fa';
import { useUser } from '../../providers/userContextValues';

const LoginPage = () => {
  const { login } = useUser();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    login({
      email,
      password
    });
    
  }

  return (
    <TemplatePage>
      <main className={styles.mainContainer}>
        <h1>Login</h1>
        <form className={styles.formContainer} onSubmit={handleSubmit}>
          <div className={styles.inputWrapper}>
            <FaUser className={styles.inputIcon} />
            <input type="email" placeholder="Email" name="email" />
          </div>
          <div className={styles.inputWrapper}>
            <FaLock className={styles.inputIcon} />
            <input type="password" placeholder="Senha" name="password" />
          </div>
          <button type="submit">Entrar</button>
        </form>
        <a href="/forgot-password" rel="noopener noreferrer">
          Esqueceu a senha? Clique aqui.
        </a>
      </main>
    </TemplatePage>
  )
}

export default LoginPage;