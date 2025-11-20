import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from './styles.module.scss';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={title ?? 'Modal'}>
      <div className={styles.container}>
        <div className={styles.header}>
          {title && <h3 className={title === 'Histórico' ? styles.titleHistorical  : styles.title}>{title}</h3>}
          <button aria-label="Fechar" className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
