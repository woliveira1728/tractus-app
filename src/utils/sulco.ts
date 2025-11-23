import { toast } from 'react-toastify';

export const SULCO_RECAPAGEM_LIMITE = 4.0;
export const SULCO_LEGAL_LIMITE = 1.6;
export const RECAPAGENS_MAX = 5;

export type SulcoStatus = 'ok' | 'recapagem' | 'recapagem_limit_reached' | 'illegal';

export function evaluateSulco(novoSulco: number, recapagensCount = 0): SulcoStatus {
  if (Number.isNaN(novoSulco) || novoSulco === null) return 'ok';
  
  const maxLifeReached = recapagensCount >= RECAPAGENS_MAX;

  if (novoSulco < SULCO_LEGAL_LIMITE) {
    return 'illegal'; 
  }

  if (novoSulco < SULCO_RECAPAGEM_LIMITE) {
    if (maxLifeReached) {
      return 'recapagem_limit_reached'; 
    }
    return 'recapagem'; 
  }

  return 'ok';
}

export function checkSulcoAndNotify(novoSulco: number, recapagensCount = 0): SulcoStatus {
  const status = evaluateSulco(novoSulco, recapagensCount);

  switch (status) {
    case 'illegal':
      toast.error('PERIGO! Sulco abaixo do limite legal (1.6 mm). O pneu deve ser **SUCATEADO** imediatamente.');
      break;
    case 'recapagem_limit_reached':
      toast.warning(`Sulco abaixo do limite de ${SULCO_RECAPAGEM_LIMITE} mm e atingiu o limite máximo de recapagens (5). **SUCATA RECOMENDADA.**`);
      break;
    case 'recapagem':
      toast.info(`Sulco abaixo do limite de ${SULCO_RECAPAGEM_LIMITE} mm. Recomenda-se o **ENVIO PARA RECAPAGEM**.`);
      break;
    case 'ok':
    default:
      toast.success('Sulco dentro dos parâmetros. Pneu OK.');
      break;
  }

  return status;
}