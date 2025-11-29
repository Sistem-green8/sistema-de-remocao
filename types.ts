
export type StatusRemocao = 'Aberta' | 'Em Andamento' | 'Concluida' | 'Faturada' | 'Cancelada';
export type Prioridade = 'Rotina' | 'Urgência';
export type TipoVeiculo = 'Básica' | 'UTI';
export type TipoViagem = 'Ida' | 'Ida e Volta';
export type CategoriaServico = 'Básica' | 'UTI - Adulto' | 'UTI - Pediátrica' | 'SIV';
export type StatusPgto = 'A Receber' | 'Recebido' | 'Pendente' | 'Pago';
export type TipoLancamento = 'Despesa' | 'Receita';

export type UserProfile = 'Administrador' | 'Financeiro' | 'Cadastrador' | 'Prestador';

export type StatusOrcamento = 'Aberto' | 'Aprovado' | 'Faturado';

export interface User {
  id: number;
  username: string;
  password?: string;
  name: string;
  profile: UserProfile;
}

export interface Remocao {
  id: number;
  dataCriacao: string;
  dataRemocao: string;
  horaOrigem: string;
  horaDestino: string;
  status: StatusRemocao;
  logStatus: string;
  paciente: string;
  origem: string;
  destino: string;
  equipe: string;
  prioridade: Prioridade;
  tipoVeiculo: TipoVeiculo;
  tipoViagem: TipoViagem;
  categoriaServico: CategoriaServico;
  solicitante: string;
  telefone: string;
  prontuario: string;
  justificativa: string;
  observacao: string;
  // Faturamento
  tempoParadaDestino: number;
  kmRodado: number;
  taxaSaida: number;
  valorKm: number;
  valorParada: number;
  valorTotal: number;
  statusPgto: StatusPgto;
}

export interface Orcamento {
  id: number;
  dataCriacao: string;
  paciente: string;
  origem: string;
  destino: string;
  solicitante: string;
  tipoVeiculo: TipoVeiculo;
  tipoViagem: TipoViagem;
  categoriaServico: CategoriaServico;
  kmEstimado: number;
  valorTotal: number;
  status: StatusOrcamento;
  observacao?: string;
}

export interface Lancamento {
  id: string;
  data: string;
  dataPgto?: string;
  tipo: TipoLancamento;
  categoria: string;
  descricao: string;
  valor: number;
  statusPgto: StatusPgto;
}

export interface PricingRule {
  FRANQUIA_MINUTOS: number;
  KM: Record<string, number>;
  HORA_PARADA: Record<string, number>;
  TAXA_SAIDA: Record<string, {
    "Ida": { comKm: number; semKm: number };
    "Ida e Volta": { comKm: number; semKm: number };
  }>;
}

export interface Convenio {
  id: number;
  nome: string;
  ativo: boolean;
  tabelaPrecos: PricingRule;
}

export interface Prestador {
  id: number;
  nome: string;
  tipo: string; // ex: Motorista, Enfermeiro, Médico
  telefone: string;
  tabelaCustos: PricingRule; // Uses same structure for cost calculation
}

export interface Evento {
  id: number;
  nome: string;
  local: string;
  data: string;
  horaInicio: string;
  horaFim: string;
  prestadoresIds: number[]; // IDs of the Prestadores assigned
  status: 'Agendado' | 'Concluído';
  valor: number;
}

export interface DashboardStats {
  hoje: number;
  pendentesSemana: number;
  faturadasMes: number;
  totalMes: number;
}
