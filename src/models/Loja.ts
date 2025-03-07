export interface Loja {
  id: number;
  nome: string;
  telefone: number;
  rua: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  latlon: string;
  distancia?: string;
  distanciaValue?: number;
}
