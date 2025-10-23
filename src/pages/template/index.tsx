import Header from '../../components/header';
import styles from './styles.module.scss';
import type { ReactNode } from 'react';

type TemplatePageProps = {
  children?: ReactNode;
};

function TemplatePage({ children }: TemplatePageProps) {

  return (
    <main className={styles.templateContainer}>
        <Header />
        {children}
    </main>
  )
}

export default TemplatePage;