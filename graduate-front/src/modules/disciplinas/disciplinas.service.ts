import type { ApiRequest } from '../../services/api';
import type { Disciplina } from '../alunos/alunos.types';
export const disciplinasService = {
  listar(api: ApiRequest, cursoId = '') {
    return api<Disciplina[]>(`/disciplinas${cursoId ? `?cursoId=${encodeURIComponent(cursoId)}` : ''}`);
  },
};
