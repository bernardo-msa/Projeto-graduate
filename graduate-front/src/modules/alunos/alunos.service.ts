import type { ApiRequest } from '../../services/api';
import { postJson } from '../../services/api';
import type { Aluno, NovoAluno, SituacaoTriagem, SituacaoTentativa, Atendimento } from './alunos.types';

export const alunosService = {
  listar(api: ApiRequest, busca = '', cursoId = '', situacao: SituacaoTriagem | '' = '') {
    const query = new URLSearchParams();
    if (busca) query.set('busca', busca);
    if (cursoId) query.set('cursoId', cursoId);
    if (situacao) query.set('situacao', situacao);
    return api<Aluno[]>(`/alunos?${query}`);
  },
  buscar(api: ApiRequest, id: string) { return api<Aluno>(`/alunos/${id}`); },
  criar(api: ApiRequest, novo: NovoAluno) { return postJson<Aluno>(api, '/alunos', novo); },
  importar(api: ApiRequest, alunos: NovoAluno[]) {
    return postJson<{ importados: number }>(api, '/alunos/importacao', { alunos });
  },
  tentativa(api: ApiRequest, alunoId: string, item: {
    disciplinaId: string; periodo: string; nota: number | null;
    frequencia: number | null; situacao: SituacaoTentativa;
  }) { return postJson(api, `/alunos/${alunoId}/tentativas`, item); },
  atendimento(api: ApiRequest, alunoId: string, tipo: string, descricao: string) {
    return postJson<Atendimento>(api, `/alunos/${alunoId}/atendimentos`, { tipo, descricao });
  },
};
