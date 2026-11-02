import React, { useState } from 'react';
import TemplatePage from '../template';
import styles from './styles.module.scss';
import { FaFacebookF, FaApple } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { useUser } from '../../providers/userContextValues';
import { toast } from 'react-toastify';
import type { UserRole } from '../../types';

const RegisterPage = () => {
  const { registerUser, navigate } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('borracheiro');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('As senhas informadas não coincidem.');
      return;
    }
    registerUser({ name, email, password, role });
  };

  return (
    <TemplatePage onBack={() => navigate('/')}>
      <main className={styles.registerContainer}>
        <h1 className={styles.title}>Olá! Cadastre-se para começar.</h1>

        <form className={styles.formContainer} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label htmlFor="register-name" className={styles.inputLabel}>
              Nome de usuário
            </label>
            <input
              id="register-name"
              className={styles.input}
              type="text"
              placeholder="Insira seu nome de usuário"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="register-email" className={styles.inputLabel}>
              E-mail
            </label>
            <input
              id="register-email"
              className={styles.input}
              type="email"
              placeholder="Insira seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="register-password" className={styles.inputLabel}>
              Senha
            </label>
            <input
              id="register-password"
              className={styles.input}
              type="password"
              placeholder="Insira sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="register-confirm-password" className={styles.inputLabel}>
              Confirme sua senha
            </label>
            <input
              id="register-confirm-password"
              className={styles.input}
              type="password"
              placeholder="Repita sua senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <span className={styles.inputLabel}>Perfil de acesso</span>
            <div className={styles.roleSelector}>
              <button
                type="button"
                className={`${styles.rolePill} ${role === 'borracheiro' ? styles.activeRole : ''}`}
                onClick={() => setRole('borracheiro')}
              >
                Perfil: Borracheiro
              </button>
              <button
                type="button"
                className={`${styles.rolePill} ${role === 'gerente' ? styles.activeRole : ''}`}
                onClick={() => setRole('gerente')}
              >
                Perfil: Gerente
              </button>
            </div>
          </div>

          <button type="submit" className={styles.registerBtn}>
            Registrar
          </button>
        </form>

        <div className={styles.dividerRow}>
          <span className={styles.line} />
          <span className={styles.dividerText}>Ou registre com</span>
          <span className={styles.line} />
        </div>

        <div className={styles.socialRow}>
          <button type="button" className={styles.socialBtn} onClick={() => navigate('/login')}>
            <FaFacebookF size={22} color="#4092FF" />
          </button>
          <button type="button" className={styles.socialBtn} onClick={() => navigate('/login')}>
            <FcGoogle size={24} />
          </button>
          <button type="button" className={styles.socialBtn} onClick={() => navigate('/login')}>
            <FaApple size={24} color="#000000" />
          </button>
        </div>

        <p className={styles.bottomLoginText}>
          Já tem uma conta?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className={styles.highlightLink}
          >
            Faça login agora
          </button>
        </p>
      </main>
    </TemplatePage>
  );
};

export default RegisterPage;
