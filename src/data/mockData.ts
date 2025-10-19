import type { Pneu, HistoricoManutencao } from '../types';

export const DADOS_PNEUS: Pneu[] = [
  { id: 101, placa: 'AXZ-5032', fogo: 'FOGO101A', pressao: 85, sulco: 7.2, posicao: '1E', status: 'OK' },
  { id: 102, placa: 'AXZ-5032', fogo: 'FOGO102B', pressao: 70, sulco: 3.5, posicao: '1D', status: 'CRÍTICO' },
  { id: 103, placa: 'AXZ-5032', fogo: 'FOGO103C', pressao: 75, sulco: 6.1, posicao: '2EL', status: 'OK' },
  { id: 104, placa: 'AXZ-5032', fogo: 'FOGO104D', pressao: 72, sulco: 5.8, posicao: '2ER', status: 'OK' },
  { id: 105, placa: 'AXZ-5032', fogo: 'FOGO105E', pressao: 80, sulco: 6.0, posicao: '3EL', status: 'OK' },
  { id: 106, placa: 'AXZ-5032', fogo: 'FOGO106F', pressao: 80, sulco: 5.9, posicao: '3EIL', status: 'OK' },
  { id: 107, placa: 'AXZ-5032', fogo: 'FOGO107G', pressao: 82, sulco: 6.5, posicao: '3DIR', status: 'OK' },
  { id: 108, placa: 'AXZ-5032', fogo: 'FOGO108H', pressao: 82, sulco: 6.4, posicao: '3DR', status: 'OK' },
];

export const MOVIMENTACOES = [
  'Sem Movimentação', 'Rodízio', 'Conserto', 'Recapagem', 'Estoque', 'Vendido', 'Sucateado'
];

export const DETALHES_RODIZIO = [
  'Troca de Posição', 'Substituído', 'Descartado'
];

export const MOCK_HISTORICO: HistoricoManutencao[] = [
    { id: 1, pneuId: 101, posicao: '1E', pressaoAnterior: 85, sulcoAnterior: 8.0, pressaoNova: 85, sulcoNovo: 7.2, movimentacao: 'Sem Movimentação', data: '2024-10-01', usuario: 'Zé001' },
    { id: 2, pneuId: 105, posicao: '3EL', pressaoAnterior: 82, sulcoAnterior: 7.5, pressaoNova: 80, sulcoNovo: 6.0, movimentacao: 'Rodízio', detalheRodizio: 'Troca de Posição', data: '2024-09-15', usuario: 'Zé001' },
];
