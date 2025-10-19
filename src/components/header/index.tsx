import styles from './styles.module.scss';
import tractusLogo from '../../assets/tractus-logo.png';

const Header = () => {
  return (
    <header className={styles.header}>
      <h1>TractusApp</h1>
      <img src={tractusLogo} alt="Tractus Logo"/>
    </header>
  );
};

export default Header;
