import { toast } from 'react-toastify';

export const SULCO_RECAPAGEM_LIMITE = 4.0; // alerta econômico: sugerir recapagem
export const SULCO_LEGAL_LIMITE = 1.6; // limite legal (sucata)
export const RECAPAGENS_MAX = 5;

export type SulcoStatus = 'ok' | 'recapagem' | 'recapagem_limit_reached' | 'illegal';

export function evaluateSulco(novoSulco: number, recapagensCount = 0): SulcoStatus {
  if (Number.isNaN(novoSulco)) return 'ok';
  if (novoSulco < SULCO_LEGAL_LIMITE) return 'illegal';
  if (novoSulco < SULCO_RECAPAGEM_LIMITE) {
    if (recapagensCount >= RECAPAGENS_MAX) return 'recapagem_limit_reached';
    return 'recapagem';
  }
  return 'ok';
}

export function checkSulcoAndNotify(novoSulco: number, recapagensCount = 0): SulcoStatus {
  const status = evaluateSulco(novoSulco, recapagensCount);

  switch (status) {
    case 'illegal':
      toast.error('Sulco abaixo do limite legal (sucata). Não utilize este pneu.');
      break;
    case 'recapagem_limit_reached':
      toast.warning('Sulco abaixo do limite de recapagem e já atingiu o limite de recapagens (5). Considere sucata.');
      break;
    case 'recapagem':
      toast.info('Sulco abaixo do limite econômico para recapagem. Recomenda-se enviar para recapagem.');
      break;
    case 'ok':
    default:
      toast.success('Sulco dentro dos parâmetros.');
      break;
  }

  return status;
}
