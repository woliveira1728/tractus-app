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
export type Pneu = {
    id: number;
    placa: string;
    fogo: number;
    pressao: number;
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