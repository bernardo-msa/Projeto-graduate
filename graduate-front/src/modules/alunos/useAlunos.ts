import { useApi } from '../../services/api';
import { useAsync } from '../../hooks/useAsync';
import { alunosService } from './alunos.service';
import type { SituacaoTriagem } from './alunos.types';

export function useAlunos(busca: string, cursoId: string, situacao: SituacaoTriagem | '') {
  const api = useApi();
  return useAsync(() => alunosService.listar(api, busca, cursoId, situacao), [api, busca, cursoId, situacao]);
}
export function useAluno(id: string) {
  const api = useApi();
  return useAsync(() => alunosService.buscar(api, id), [api, id]);
}
