import type { Veiculo } from '../types';

// Mock para usuários do sistema
export const MOCK_USERS = [
    {
        id: '1',
        name: 'José da Silva',
        email: 'jose.silva@nex.com',
        password: '123',
    },
    {
        id: '2',
        name: 'Maria Oliveira',
        email: 'maria.oliveira@nex.com',
        password: '456',
    },
];

export const MOCK_VEHICLES: Veiculo[] = [
    {
        placa: 'ABC-1234',
        modelo: 'Volvo VM (2 Eixos)',
        eixos: 2,
        pneus: [
            { id: 101, placa: 'ABC-1234', fogo: 'FOGO101', pressao: 90, sulco: 8.0, posicao: 'L1', status: 'OK', recapagens: 0 },
            { id: 102, placa: 'ABC-1234', fogo: 'FOGO102', pressao: 90, sulco: 8.0, posicao: 'R1', status: 'OK', recapagens: 0 },
            { id: 103, placa: 'ABC-1234', fogo: 'FOGO103', pressao: 88, sulco: 7.5, posicao: 'L2', status: 'OK', recapagens: 0 },
            { id: 104, placa: 'ABC-1234', fogo: 'FOGO104', pressao: 88, sulco: 7.5, posicao: 'R2', status: 'OK', recapagens: 0 },
        ]
    },
    {
        placa: 'DEF-5678',
        modelo: 'MB Atego (3 Eixos)',
        eixos: 3,
        pneus: [
            { id: 201, placa: 'DEF-5678', fogo: 'FOGO201', pressao: 85, sulco: 7.2, posicao: 'L1', status: 'OK', recapagens: 1 },
            { id: 202, placa: 'DEF-5678', fogo: 'FOGO202', pressao: 70, sulco: 3.5, posicao: 'R1', status: 'CRÍTICO', recapagens: 5 },
            { id: 203, placa: 'DEF-5678', fogo: 'FOGO203', pressao: 75, sulco: 6.1, posicao: 'L2', status: 'OK', recapagens: 2 },
            { id: 204, placa: 'DEF-5678', fogo: 'FOGO204', pressao: 80, sulco: 4.8, posicao: 'R2', status: 'ALERTA', recapagens: 4 },
            { id: 205, placa: 'DEF-5678', fogo: 'FOGO205', pressao: 82, sulco: 6.5, posicao: 'L3', status: 'OK', recapagens: 0 },
            { id: 206, placa: 'DEF-5678', fogo: 'FOGO206', pressao: 82, sulco: 6.4, posicao: 'R3', status: 'OK', recapagens: 0 },
        ]
    }
];

export const MOVIMENTACOES = [
  'Sem Movimentação', 'Rodízio', 'Conserto', 'Recapagem', 'Estoque', 'Vendido', 'Sucateado'
];

export const DETALHES_RODIZIO = [
  'Troca de Posição', 'Substituído', 'Descartado'
];

export const MOCK_HISTORICO: import('../types').HistoricoManutencao[] = [];