export interface Pneu {
  id: number;
  placa: string;
  fogo: string;
  pressao: number;
  sulco: number;
  posicao: string;
  status: 'OK' | 'ALERTA' | 'CRÍTICO';
}

export interface HistoricoManutencao {
  id: number;
  pneuId: number;
  posicao: string;
  pressaoAnterior: number;
  sulcoAnterior: number;
  pressaoNova: number;
  sulcoNovo: number;
  movimentacao: string;
  detalheRodizio?: string;
  data: string;
  usuario: string;
}
