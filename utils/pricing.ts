import { Remocao, Convenio } from '../types';

export function getTabelaPreco(solicitante: string, listaConvenios: Convenio[]) {
  const convenio = listaConvenios.find(c => 
    c.nome.toUpperCase() === solicitante.toUpperCase() || 
    solicitante.toUpperCase().includes(c.nome.toUpperCase())
  );
  
  if (convenio) return convenio.tabelaPrecos;

  // Fallback to first one or default
  return listaConvenios.length > 0 ? listaConvenios[0].tabelaPrecos : null;
}

export function calcularPreco(dados: Partial<Remocao>, listaConvenios: Convenio[]) {
  if (!dados.solicitante || !dados.categoriaServico || !dados.tipoViagem) {
    return { taxaSaida: 0, valorKm: 0, valorParada: 0, valorTotal: 0 };
  }

  const tabelaPrecos = getTabelaPreco(dados.solicitante, listaConvenios);
  
  if (!tabelaPrecos) {
    console.warn("Tabela de preços não encontrada para:", dados.solicitante);
    return { taxaSaida: 0, valorKm: 0, valorParada: 0, valorTotal: 0 };
  }

  const categoria = dados.categoriaServico;
  const tipoViagem = dados.tipoViagem;
  const kmRodado = Number(dados.kmRodado || 0);
  const tempoParada = Number(dados.tempoParadaDestino || 0);

  // Fallback Category Logic
  const categoriaBase = categoria.split(' - ')[0]; 
  const fallbackCategoria = "Básica";

  // 1. Valor KM
  const valorKmUnitario = tabelaPrecos.KM[categoria] 
    || tabelaPrecos.KM[categoriaBase] 
    || tabelaPrecos.KM[fallbackCategoria] 
    || 0;
  
  const valorKmFinal = valorKmUnitario * kmRodado;

  // 2. Valor Hora Parada
  const franquiaMinutos = tabelaPrecos.FRANQUIA_MINUTOS || 0;
  const valorHoraUnitario = tabelaPrecos.HORA_PARADA[categoria] 
    || tabelaPrecos.HORA_PARADA[categoriaBase] 
    || tabelaPrecos.HORA_PARADA[fallbackCategoria] 
    || 0;
  
  const tempoParadaCobravelMinutos = Math.max(0, tempoParada - franquiaMinutos);
  const tempoParadaCobravelHoras = tempoParadaCobravelMinutos / 60.0;
  const valorParadaFinal = valorHoraUnitario * tempoParadaCobravelHoras;

  // 3. Taxa de Saída
  const tabelaTaxaSaida = tabelaPrecos.TAXA_SAIDA[categoria] 
    || tabelaPrecos.TAXA_SAIDA[categoriaBase as any]
    || tabelaPrecos.TAXA_SAIDA[fallbackCategoria];
  
  let taxaSaidaFinal = 0;
  
  if (tabelaTaxaSaida) {
    const taxaData = tabelaTaxaSaida[tipoViagem];
    if (taxaData) {
       taxaSaidaFinal = (kmRodado > 0) ? taxaData.comKm : taxaData.semKm;
    } else {
       const fallbackData = tabelaTaxaSaida["Ida"];
       if (fallbackData) {
          taxaSaidaFinal = (kmRodado > 0) ? fallbackData.comKm : fallbackData.semKm;
       }
    }
  }

  const valorTotal = taxaSaidaFinal + valorKmFinal + valorParadaFinal;

  return {
    taxaSaida: taxaSaidaFinal,
    valorKm: valorKmFinal,
    valorParada: valorParadaFinal,
    valorTotal: valorTotal
  };
}

export const formatBRL = (val: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
};