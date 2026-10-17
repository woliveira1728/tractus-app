import React, { useState, useRef } from 'react';
import TemplatePage from '../template';
import styles from './styles.module.scss';
import { useUser } from '../../providers/userContextValues';
import { toast } from 'react-toastify';

type Step = 'email' | 'otp' | 'new_password';

const ForgotPassword = () => {
  const { requestPasswordOtp, verifyPasswordOtp, resetPassword, navigate } = useUser();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['5', '1', '3', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    const code = requestPasswordOtp(email);
    if (code) {
      setStep('otp');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otpDigits];
    next[index] = digit;
    setOtpDigits(next);

    if (digit && index < 3) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join('');
    if (verifyPasswordOtp(code)) {
      setStep('new_password');
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('A confirmação de senha não confere.');
      return;
    }
    resetPassword(newPassword);
  };

  const handleBack = () => {
    if (step === 'new_password') {
      setStep('otp');
    } else if (step === 'otp') {
      setStep('email');
    } else {
      navigate('/login');
    }
  };

  return (
    <TemplatePage onBack={handleBack}>
      <main className={styles.forgotPasswordContainer}>
        {step === 'email' && (
          <>
            <div className={styles.textHeader}>
              <h1 className={styles.title}>Esqueceu sua senha?</h1>
              <p className={styles.subtitle}>
                Não se preocupe! Isso acontece. Por favor, insira o endereço de e-mail vinculado à
                sua conta.
              </p>
            </div>

            <form className={styles.formContainer} onSubmit={handleSendCode}>
              <input
                className={styles.input}
                type="email"
                placeholder="Insira seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button className={styles.primaryBtn} type="submit">
                Enviar código
              </button>
            </form>

            <p className={styles.footerText}>
              Lembrar senha?{' '}
              <button
                type="button"
                className={styles.footerLink}
                onClick={() => navigate('/login')}
              >
                Login
              </button>
            </p>
          </>
        )}

        {step === 'otp' && (
          <>
            <div className={styles.textHeader}>
              <h1 className={styles.title}>Verificação por OTP</h1>
              <p className={styles.subtitle}>
                Digite o código de verificação que acabamos de enviar para o seu endereço de
                e-mail.
              </p>
            </div>

            <form className={styles.formContainer} onSubmit={handleVerifyOtp}>
              <div className={styles.otpRow}>
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={otpRefs[idx]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className={`${styles.otpBox} ${digit ? styles.otpFilled : ''}`}
                    aria-label={`Dígito ${idx + 1} do código OTP`}
                  />
                ))}
              </div>

              <button className={styles.primaryBtn} type="submit">
                Verificar
              </button>
            </form>

            <p className={styles.footerText}>
              Não recebeu o código?{' '}
              <button
                type="button"
                className={styles.footerLink}
                onClick={() => {
                  requestPasswordOtp(email || 'ze@transcargabrasil.com.br');
                  setOtpDigits(['5', '1', '3', '8']);
                }}
              >
                Reenviar
              </button>
            </p>
          </>
        )}

        {step === 'new_password' && (
          <>
            <div className={styles.textHeader}>
              <h1 className={styles.title}>Criar nova senha</h1>
              <p className={styles.subtitle}>
                Sua nova senha deve ser diferente daquelas usadas anteriormente.
              </p>
            </div>

            <form className={styles.formContainer} onSubmit={handleResetPassword}>
              <input
                className={styles.input}
                type="password"
                placeholder="Nova Senha"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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

              <button className={styles.primaryBtn} type="submit">
                Redefinir senha
              </button>
            </form>
          </>
        )}
      </main>
    </TemplatePage>
  );
};

export default ForgotPassword;