import TemplatePage from '../template';
import styles from './styles.module.scss';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';

const ForgotPassword = () => {

  return (
    <TemplatePage>
      <main className={styles.forgotPasswordContainer}>
        <h1>Redefinição de senha</h1>
        <form className={styles.formContainer}>
          <div className={styles.inputWrapper}>
            <FaUser className={styles.inputIcon} />
            <input className={styles.input} type="text" placeholder="Digite seu nome" />
          </div>

          <div className={styles.inputWrapper}>
            <FaEnvelope className={styles.inputIcon} />
            <input className={styles.input} type="email" placeholder="Digite seu e-mail" />
          </div>

          <div className={styles.inputWrapper}>
            <FaLock className={styles.inputIcon} />
            <input className={styles.input} type="password" placeholder="Digite sua senha" />
          </div>

          <div className={styles.inputWrapper}>
            <FaLock className={styles.inputIcon} />
            <input className={styles.input} type="password" placeholder="Confirme sua senha" />
          </div>

          <button className={styles.button} type="submit">Redefinir senha</button>
        </form>
      </main>
    </TemplatePage>
  )
}

export default ForgotPassword;