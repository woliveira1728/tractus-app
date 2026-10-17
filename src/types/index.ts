export type UserRole = 'borracheiro' | 'gerente';

export type ServiceStatus = 'pendente' | 'aprovado' | 'reprovado';

export type SyncStatus = 'synced' | 'pending_sync';

export interface HistoricoManutencao {
  id: number;
  pneuId: number;
  placa?: string;
  fogo?: string;
  posicao: string;
  pressaoAnterior: number;
  sulcoAnterior: number;
  pressaoNova: number;
  sulcoNovo: number;
  recapagens?: number;
  movimentacao: string;
  detalheRodizio?: string;
  rodizioDe?: string;
  rodizioPara?: string;
  sucateado?: boolean;
  vendido?: boolean;
  substituicao?: boolean;
  observacoes?: string;
  data: string;
  usuario: string;
  syncStatus?: SyncStatus;
}

export type Pneu = {
  id: number;
  placa: string;
  fogo: string;
  pressao: number;
  ultimaPressao?: number;
  sulco: number;
  posicao: string;
  status: string;
  recapagens: number;
};

export type Veiculo = {
  placa: string;
  modelo: string;
  eixos: number;
  pneus: Pneu[];
};

export interface OrdemServico {
  id: number; // Ex: 10245 -> Serviço #10245
  placa: string;
  veiculo: string;
  dataHora: string; // Ex: "12/10/2025 - 08:00"
  timestampIso: string; // Carimbo temporal original (RN04 / RNF07)
  tipoServico: string; // Ex: "Recapagem", "Sucata Imediata", "Rodízio", "Inspeção"
  pneusEnvolvidos: string; // Ex: "L1, L2"
  profundidadeSulco: number; // mm
  novaPressao: number; // psi
  ultimaPressaoMedida: number; // psi
  numeroFogo: string; // Ex: "221" ou "190"
  movimentacoesRealizadas: {
    rodizio: string; // Ex: "Alterado de L2 para L1"
    substituicao: string; // Ex: "Pneu R2 substituído por novo"
    sucateado?: boolean;
    vendido?: boolean;
  };
  observacoesTecnico: string;
  status: ServiceStatus;
  operador: string;
  homologadoPor?: string;
  dataHomologacao?: string;
  justificativaGerente?: string;
  syncStatus: SyncStatus;
}

export interface SyncQueueItem {
  id: string;
  type: 'AFERICAO' | 'ORDEM_SERVICO' | 'SUBSTITUICAO';
  timestampIso: string;
  payload: unknown;
}