import { toast } from 'react-toastify';

export const SULCO_RECAPAGEM_LIMITE = 4.0;
export const SULCO_RECAPAGEM_MIN = 1.7;
export const SULCO_LEGAL_LIMITE = 1.6;
export const RECAPAGENS_MAX = 5;

export type SulcoStatus = 'ok' | 'recapagem' | 'recapagem_limit_reached' | 'illegal';

export interface SulcoPrescription {
  status: SulcoStatus;
  level: 'safe' | 'warning' | 'critical';
  badgeLabel: string;
  title: string;
  description: string;
  recommendedMovement: string;
  blocksRelease: boolean;
}

/**
 * RN01 - Classificação e Prescrição por Profundidade de Sulco:
 * - Faixa Segura (> 4,0 mm): Pneu apto a rodar.
 * - Faixa Preventiva de Recapagem (1,7 mm a 4,0 mm): "RECOMENDAÇÃO: ENVIAR PARA RECAPAGEM"
 * - Faixa Crítica / Limite Regulamentar Contran (<= 1,6 mm): "PERIGO: LIMITE LEGAL ATINGIDO - SUCATA IMEDIATA"
 */
export function evaluateSulco(novoSulco: number, recapagensCount = 0): SulcoStatus {
  if (Number.isNaN(novoSulco) || novoSulco === null || novoSulco === undefined) return 'ok';

  const maxLifeReached = recapagensCount >= RECAPAGENS_MAX;

  if (novoSulco <= SULCO_LEGAL_LIMITE) {
    return 'illegal';
  }

  if (novoSulco <= SULCO_RECAPAGEM_LIMITE) {
    if (maxLifeReached) {
      return 'recapagem_limit_reached';
    }
    return 'recapagem';
  }

  return 'ok';
}

export function getSulcoPrescription(novoSulco: number, recapagensCount = 0): SulcoPrescription {
  const status = evaluateSulco(novoSulco, recapagensCount);

  switch (status) {
    case 'illegal':
      return {
        status,
        level: 'critical',
        badgeLabel: 'CRÍTICO (<= 1,6 mm)',
        title: 'PERIGO: LIMITE LEGAL ATINGIDO - SUCATA IMEDIATA',
        description:
          'Bloqueio mandatório de liberação para viagem (Limite Contran <= 1,6 mm). Emitir ordem imediata de descarte/sucateamento.',
        recommendedMovement: 'Sucateado',
        blocksRelease: true,
      };
    case 'recapagem_limit_reached':
      return {
        status,
        level: 'critical',
        badgeLabel: 'LIMITE DE VIDAS ATINGIDO',
        title: 'PERIGO: LIMITE DE RECAPAGENS ATINGIDO - SUCATA RECOMENDADA',
        description: `Sulco em ${novoSulco.toFixed(1)} mm e carcaça já atingiu ${recapagensCount} recapagens. Descarte recomendado.`,
        recommendedMovement: 'Sucateado',
        blocksRelease: true,
      };
    case 'recapagem':
      return {
        status,
        level: 'warning',
        badgeLabel: 'PREVENTIVO (1,7 a 4,0 mm)',
        title: 'RECOMENDAÇÃO: ENVIAR PARA RECAPAGEM',
        description:
          'Faixa preventiva atingida. Envie imediatamente para recapagem para evitar desgaste da cinta de aço e preservar a carcaça.',
        recommendedMovement: 'Recapagem',
        blocksRelease: false,
      };
    case 'ok':
    default:
      return {
        status: 'ok',
        level: 'safe',
        badgeLabel: 'FAIXA SEGURA (> 4,0 mm)',
        title: 'OPERAÇÃO NORMAL: PNEU APTO A RODAR',
        description: 'Profundidade de sulco dentro dos parâmetros de segurança operacional.',
        recommendedMovement: 'Sem Movimentação',
        blocksRelease: false,
      };
  }
}

export function checkSulcoAndNotify(novoSulco: number, recapagensCount = 0): SulcoStatus {
  const prescription = getSulcoPrescription(novoSulco, recapagensCount);

  switch (prescription.status) {
    case 'illegal':
      toast.error(prescription.title);
      break;
    case 'recapagem_limit_reached':
      toast.warning(prescription.title);
      break;
    case 'recapagem':
      toast.warning(prescription.title);
      break;
    case 'ok':
    default:
      toast.success(prescription.title);
      break;
  }

  return prescription.status;
}