import type { ApiRequest } from '../../services/api';
import type { Curso } from '../alunos/alunos.types';
export const cursosService = { listar(api: ApiRequest) { return api<Curso[]>('/cursos'); } };
