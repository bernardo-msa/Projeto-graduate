import type { ApiRequest } from '../../services/api';
export interface Resumo { totalAlunos: number; emAtencao: number; possivelEp: number; crMedio: number; aviso: string; }
export const painelService = { obter(api: ApiRequest) { return api<Resumo>('/painel'); } };
