export type SituacaoTriagem = 'REGULAR' | 'ATENCAO' | 'POSSIVEL_EP';
export type SituacaoTentativa = 'APROVADO' | 'REPROVADO_NOTA' | 'REPROVADO_FALTA' | 'CURSANDO' | 'TRANCADO';
export interface Curso { id: string; codigo: string; nome: string; matriz: string; creditosTotais: number; semestresPrevistos: number; _count: { alunos: number; disciplinas: number }; }
export interface Disciplina { id: string; codigo: string; nome: string; cursoId: string; curso: { nome: string }; obrigatoria: boolean; creditos: number; totalTentativas: number; aprovadas: number; reprovadas: number; }
export interface Tentativa { id: string; periodo: string; nota: number | null; frequencia: number | null; situacao: SituacaoTentativa; disciplinaId: string; disciplina: Disciplina; }
export interface Atendimento {
  id: string;
  tipo: string;
  descricao: string;
  registradoPor: string;
  criadoEm: string;
}

export interface ReprovacaoPorDisciplina {
  codigo: string;
  nome: string;
  obrigatoria: boolean;
  quantidadeReprovacoes: number;
  tentativas: {
    periodo: string;
    situacao: SituacaoTentativa;
  }[];
}

export interface Triagem {
  situacao: SituacaoTriagem;
  totalReprovacoes: number;
  creditosPendentes: number;
  reprovacoesPorDisciplina: ReprovacaoPorDisciplina[];
  percentualConcluido: number;
  evidencias: {
    duasReprovacoesMesmaDisciplina: boolean;
    todasReprovadasUltimoSemestre: null;
    crBaixoDoisSemestres: null;
    prazoIntegralizacao: null;
  };
  aviso: string;
}
export interface Aluno {
  id: string; matricula: string; nome: string; email: string | null;
  periodoIngresso: string; modalidadeIngresso: string; cr: number;
  creditosConcluidos: number; cursoId: string; curso: Curso;
  triagem: Triagem; tentativas: Tentativa[];
  atendimentos?: Atendimento[];
}
export interface NovoAluno {
  matricula: string; nome: string; email?: string; periodoIngresso: string;
  modalidadeIngresso: string; cr: number; creditosConcluidos: number; cursoId: string;
}
