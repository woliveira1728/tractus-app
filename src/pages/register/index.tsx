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
          <input
            className={styles.input}
            type="text"
            placeholder="Nome de usuário"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            className={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className={styles.input}
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            className={styles.input}
            type="password"
            placeholder="Confirme sua senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

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
