import { Feedback } from '../../components/Feedback';
import { useAsync } from '../../hooks/useAsync';
import { useApi } from '../../services/api';
import { cursosService } from './cursos.service';

export function CursosPage() {
  const api = useApi();
  const { data, loading, error, reload } = useAsync(() => cursosService.listar(api), [api]);
  return <><div className="page-heading"><p className="eyebrow">ESTRUTURA CURRICULAR</p>
    <h1>Cursos e currículos</h1><p>Visão de matrizes curriculares e dos alunos cadastrados por curso.</p></div>
    <Feedback loading={loading} error={error} onRetry={() => void reload()} />
    <div className="course-grid">{data?.map((curso) => <div key={curso.id} className="card spaced">
      <p className="eyebrow">{curso.codigo} • Matriz {curso.matriz}</p><h2>{curso.nome}</h2>
      <div className="details-list"><div>Créditos exigidos <strong>{curso.creditosTotais}</strong></div>
      <div>Duração prevista <strong>{curso.semestresPrevistos} semestres</strong></div>
      <div>Alunos na base <strong>{curso._count.alunos}</strong></div>
      <div>Disciplinas cadastradas <strong>{curso._count.disciplinas}</strong></div></div>
    </div>)}</div>
  </>;
}
