
import { Remocao, Lancamento, Convenio, Prestador, PricingRule, Evento, User, Orcamento } from './types';

// Default Pricing Template
export const DEFAULT_PRICING: PricingRule = {
  FRANQUIA_MINUTOS: 0,
  KM: { "Básica": 3.50, "UTI - Adulto": 7.00, "UTI - Pediátrica": 7.00, "SIV": 3.50 },
  HORA_PARADA: { "Básica": 80.00, "UTI - Adulto": 150.00, "UTI - Pediátrica": 150.00 },
  TAXA_SAIDA: {
    "Básica": { "Ida": { comKm: 150.00, semKm: 150.00 }, "Ida e Volta": { comKm: 250.00, semKm: 250.00 } },
    "UTI - Adulto": { "Ida": { comKm: 350.00, semKm: 350.00 }, "Ida e Volta": { comKm: 550.00, semKm: 550.00 } },
    "UTI - Pediátrica": { "Ida": { comKm: 350.00, semKm: 350.00 }, "Ida e Volta": { comKm: 550.00, semKm: 550.00 } },
    "SIV": { "Ida": { comKm: 150.00, semKm: 150.00 }, "Ida e Volta": { comKm: 250.00, semKm: 250.00 } }
  }
};

export const MOCK_USERS: User[] = [
  {
    id: 1,
    username: 'admin',
    password: 'admin',
    name: 'Administrador',
    profile: 'Administrador'
  }
];

export const MOCK_CONVENIOS: Convenio[] = [
  {
    id: 1,
    nome: "ANERY",
    ativo: true,
    tabelaPrecos: {
      FRANQUIA_MINUTOS: 0,
      KM: { "Básica": 3.50, "UTI - Adulto": 7.38, "UTI - Pediátrica": 8.29, "SIV": 3.50 },
      HORA_PARADA: { "Básica": 85.00, "UTI - Adulto": 143.00, "UTI - Pediátrica": 165.90 },
      TAXA_SAIDA: {
        "Básica": { "Ida": { comKm: 250.00, semKm: 250.00 }, "Ida e Volta": { comKm: 250.00, semKm: 430.00 } },
        "UTI - Adulto": { "Ida": { comKm: 376.70, semKm: 750.00 }, "Ida e Volta": { comKm: 376.70, semKm: 750.00 } },
        "UTI - Pediátrica": { "Ida": { comKm: 376.70, semKm: 750.00 }, "Ida e Volta": { comKm: 376.70, semKm: 750.00 } },
        "SIV": { "Ida": { comKm: 250.00, semKm: 250.00 }, "Ida e Volta": { comKm: 430.00, semKm: 430.00 } }
      }
    }
  },
  {
    id: 2,
    nome: "HELP LAR",
    ativo: true,
    tabelaPrecos: {
      FRANQUIA_MINUTOS: 0,
      KM: { "Básica": 3.50, "UTI - Adulto": 8.38, "UTI - Pediátrica": 9.29, "SIV": 3.50 },
      HORA_PARADA: { "Básica": 95.00, "UTI - Adulto": 183.00, "UTI - Pediátrica": 195.90 },
      TAXA_SAIDA: {
        "Básica": { "Ida": { comKm: 250.00, semKm: 260.00 }, "Ida e Volta": { comKm: 250.00, semKm: 480.00 } },
        "UTI - Adulto": { "Ida": { comKm: 476.70, semKm: 900.00 }, "Ida e Volta": { comKm: 476.70, semKm: 900.00 } },
        "UTI - Pediátrica": { "Ida": { comKm: 476.70, semKm: 900.00 }, "Ida e Volta": { comKm: 476.70, semKm: 900.00 } },
        "SIV": { "Ida": { comKm: 250.00, semKm: 260.00 }, "Ida e Volta": { comKm: 480.00, semKm: 480.00 } }
      }
    }
  }
];

export const MOCK_PRESTADORES: Prestador[] = [
  {
    id: 1,
    nome: "João Motorista",
    tipo: "Motorista",
    telefone: "(11) 91234-5678",
    tabelaCustos: { ...DEFAULT_PRICING, KM: { ...DEFAULT_PRICING.KM, "Básica": 1.50 } }
  },
  {
    id: 2,
    nome: "Maria Enfermeira",
    tipo: "Enfermeiro",
    telefone: "(11) 98765-4321",
    tabelaCustos: DEFAULT_PRICING
  }
];

export const MOCK_REMOCOES: Remocao[] = [
  {
    id: 1001,
    dataCriacao: '2023-10-25',
    dataRemocao: new Date().toISOString().split('T')[0],
    horaOrigem: '08:00',
    horaDestino: '10:00',
    status: 'Aberta',
    logStatus: '',
    paciente: 'João da Silva',
    origem: 'Hospital Central',
    destino: 'Clínica Vida',
    equipe: 'Alpha 1',
    prioridade: 'Rotina',
    tipoVeiculo: 'Básica',
    tipoViagem: 'Ida',
    categoriaServico: 'Básica',
    solicitante: 'ANERY',
    telefone: '(11) 99999-9999',
    prontuario: '12345',
    justificativa: '',
    observacao: '',
    tempoParadaDestino: 0,
    kmRodado: 0,
    taxaSaida: 0,
    valorKm: 0,
    valorParada: 0,
    valorTotal: 0,
    statusPgto: 'A Receber'
  },
  {
    id: 1002,
    dataCriacao: '2023-10-24',
    dataRemocao: '2023-10-24',
    horaOrigem: '14:00',
    horaDestino: '16:00',
    status: 'Faturada',
    logStatus: '',
    paciente: 'Maria Oliveira',
    origem: 'Residência',
    destino: 'Santa Casa',
    equipe: 'Beta 2',
    prioridade: 'Urgência',
    tipoVeiculo: 'UTI',
    tipoViagem: 'Ida e Volta',
    categoriaServico: 'UTI - Adulto',
    solicitante: 'HELP LAR',
    telefone: '(11) 88888-8888',
    prontuario: '67890',
    justificativa: '',
    observacao: '',
    tempoParadaDestino: 30,
    kmRodado: 120,
    taxaSaida: 900.00,
    valorKm: 1005.60,
    valorParada: 91.50,
    valorTotal: 1997.10,
    statusPgto: 'Recebido'
  }
];

export const MOCK_LANCAMENTOS: Lancamento[] = [
  {
    id: "L-1",
    data: '2023-10-20',
    tipo: 'Despesa',
    categoria: 'Combustível',
    descricao: 'Abastecimento VTR-01',
    valor: -250.00,
    statusPgto: 'Pago'
  },
  {
    id: "L-2",
    data: '2023-10-21',
    tipo: 'Receita',
    categoria: 'Serviço Extra',
    descricao: 'Locação Evento',
    valor: 1500.00,
    statusPgto: 'Pendente'
  }
];

export const MOCK_EVENTOS: Evento[] = [
  {
    id: 1,
    nome: "Cobertura Show de Rock",
    local: "Estádio Municipal",
    data: new Date().toISOString().split('T')[0],
    horaInicio: "18:00",
    horaFim: "23:00",
    prestadoresIds: [1, 2],
    status: 'Agendado',
    valor: 0
  }
];

export const MOCK_ORCAMENTOS: Orcamento[] = [
  {
    id: 5001,
    dataCriacao: new Date().toISOString().split('T')[0],
    paciente: 'Roberto Carlos',
    origem: 'São Paulo',
    destino: 'Campinas',
    solicitante: 'HELP LAR',
    tipoVeiculo: 'UTI',
    tipoViagem: 'Ida',
    categoriaServico: 'UTI - Adulto',
    kmEstimado: 100,
    valorTotal: 1500.00,
    status: 'Aberto'
  }
];
