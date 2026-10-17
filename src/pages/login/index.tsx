import React, { useState } from 'react';
import TemplatePage from '../template';
import styles from './styles.module.scss';
import { FaFacebookF, FaApple, FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { useUser } from '../../providers/userContextValues';

const LoginPage = () => {
  const { login, navigate } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login({ email, password });
  };

  const handleQuickDemo = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    login({ email: demoEmail, password: demoPassword });
  };

  return (
    <TemplatePage onBack={() => navigate('/')}>
      <main className={styles.mainContainer}>
        <h1 className={styles.welcomeTitle}>Bem-vindo de volta!</h1>

        <form className={styles.formContainer} onSubmit={handleSubmit}>
          <div className={styles.inputWrapper}>
            <input
              type="email"
              placeholder="Insira seu e-mail"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputWrapper}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Insira sua senha"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label="Mostrar ou ocultar senha"
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>

          <div className={styles.forgotRow}>
            <button
              type="button"
              className={styles.forgotLink}
              onClick={() => navigate('/forgot-password')}
            >
              Esqueceu sua senha?
            </button>
          </div>

          <button type="submit" className={styles.loginSubmitBtn}>
            Login
          </button>
        </form>

        <div className={styles.dividerRow}>
          <span className={styles.line} />
          <span className={styles.dividerText}>Ou login com</span>
          <span className={styles.line} />
        </div>

        <div className={styles.socialRow}>
          <button
            type="button"
            className={styles.socialBtn}
            onClick={() => handleQuickDemo('ze@transcargabrasil.com.br', '123')}
            title="Entrar como Borracheiro (Zé)"
          >
            <FaFacebookF size={22} color="#4092FF" />
          </button>
          <button
            type="button"
            className={styles.socialBtn}
            onClick={() => handleQuickDemo('carlos@transcargabrasil.com.br', '123')}
            title="Entrar como Gerente (Seu Carlos)"
          >
            <FcGoogle size={24} />
          </button>
          <button
            type="button"
            className={styles.socialBtn}
            onClick={() => handleQuickDemo('ze@transcargabrasil.com.br', '123')}
            title="Acesso rápido Apple"
          >
            <FaApple size={24} color="#000000" />
          </button>
        </div>

        {/* Atalhos de demonstração rápida para avaliação das duas personas */}
        <div className={styles.demoBox}>
          <span className={styles.demoLabel}>Acesso rápido (Personas AP2):</span>
          <div className={styles.demoButtons}>
            <button
              type="button"
              onClick={() => handleQuickDemo('ze@transcargabrasil.com.br', '123')}
              className={styles.demoBtnBorracheiro}
            >
              Borracheiro (Zé)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('carlos@transcargabrasil.com.br', '123')}
              className={styles.demoBtnGerente}
            >
              Gerente (Seu Carlos)
            </button>
          </div>
        </div>

        <p className={styles.bottomRegisterText}>
          Não tem uma conta?{' '}
          <button
            type="button"
            onClick={() => navigate('/register')}
            className={styles.highlightLink}
          >
            Cadastre-se agora
          </button>
        </p>
      </main>
    </TemplatePage>
  );
};

export default LoginPage;