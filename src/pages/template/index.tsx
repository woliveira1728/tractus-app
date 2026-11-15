import Header from '../../components/header';
import styles from './styles.module.scss';
import type { ReactNode } from 'react';

type TemplatePageProps = {
  children?: ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  hideNavRow?: boolean;
  grayBackground?: boolean;
};

function TemplatePage({
  children,
  showBack = true,
  onBack,
  hideNavRow = false,
  grayBackground = false,
}: TemplatePageProps) {
  return (
    <div
      className={`${styles.templateContainer} ${
        grayBackground ? styles.grayBg : ''
      }`}
    >
      <Header showBack={showBack} onBack={onBack} hideNavRow={hideNavRow} />
      <div className={styles.contentArea}>{children}</div>
    </div>
  );
}

export default TemplatePage;