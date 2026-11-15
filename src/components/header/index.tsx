import styles from './styles.module.scss';
import { FiChevronLeft, FiWifi, FiWifiOff } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import { useUser } from '../../providers/userContextValues';

type HeaderProps = {
  showBack?: boolean;
  onBack?: () => void;
  hideNavRow?: boolean;
};

const Header = ({ showBack = true, onBack, hideNavRow = false }: HeaderProps) => {
  const { navigate, isOnline, toggleOfflineSimulation, pendingSyncCount, user, logout } = useUser();
  const location = useLocation();

  const handleBackClick = () => {
    if (onBack) {
      onBack();
      return;
    }
    if (location.pathname === '/identification' || location.pathname === '/manager/services') {
      logout();
      return;
    }
    window.history.back();
  };

  return (
    <header className={styles.headerWrapper}>
      <div className={styles.navRow}>
        <div className={styles.leftSlot}>
          {!hideNavRow && showBack ? (
            <button
              type="button"
              className={styles.backButton}
              onClick={handleBackClick}
              aria-label="Voltar"
            >
              <FiChevronLeft size={22} />
            </button>
          ) : null}
        </div>

        {!hideNavRow ? (
          <h1
            className={styles.brandTitle}
            onClick={() => {
              if (user?.role === 'gerente') navigate('/manager/services');
              else if (user) navigate('/identification');
              else navigate('/');
            }}
          >
            TRACTUS<span>APP</span>
          </h1>
        ) : (
          <div />
        )}

        <div className={styles.rightSlot}>
          <button
            type="button"
            onClick={toggleOfflineSimulation}
            className={`${styles.networkPill} ${isOnline ? styles.online : styles.offline}`}
            title="Clique para alternar entre Modo Online e Modo Offline (RN04)"
          >
            {isOnline ? <FiWifi size={14} /> : <FiWifiOff size={14} />}
            <span>{isOnline ? 'Online' : 'Offline'}</span>
            {pendingSyncCount > 0 && (
              <span className={styles.syncBadge} title="Registros aguardando sincronização">
                {pendingSyncCount}
              </span>
            )}
          </button>
        </div>
      </div>
      {!isOnline && (
        <div className={styles.offlineBanner}>
          <FiWifiOff size={18} />
          <span>
            Você está offline.
            {pendingSyncCount > 0 ? ` ${pendingSyncCount} registro(s) aguardando envio.` : ' Os registros serão enviados quando a conexão voltar.'}
          </span>
        </div>
      )}
    </header>
  );
};

export default Header;
