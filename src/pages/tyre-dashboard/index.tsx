import React from 'react';
import Caster from '../../components/caster';
import Tyre from '../../components/tyre';
import TemplatePage from '../template';
import styles from './styles.module.scss';
import type { ChangeEvent } from 'react';


const TyreDashboard = () => {
  const [ movement, setMovement ] = React.useState(false);

  const handleMovementChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'rodizio') {
      console.log('rodizio selecionado');
      setMovement(true);
    } else {
      setMovement(false);
    }
  };

  return (
    <TemplatePage>
      <main className={styles.tyreDashboardContainer}>

        {movement === true ? <Caster /> : <Tyre />}

        <div className={styles.infoContainer}>
          <p>Movimentação</p>
          <select name="movement" id="movement" defaultValue="recapagem" onChange={handleMovementChange}>
            <option value="recapagem">Recapagem</option>
            <option value="rodizio">Rodízio</option>
            <option value="sem-movimentacao">Sem movimentação</option>
          </select>
        </div>
        <button className={styles.button}> Salvar e avançar </button>
      </main>
    </TemplatePage>
  )
}

export default TyreDashboard;