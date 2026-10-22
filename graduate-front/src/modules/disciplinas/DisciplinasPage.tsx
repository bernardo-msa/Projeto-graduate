import { useState } from 'react';
import { Feedback } from '../../components/Feedback';
import { useAsync } from '../../hooks/useAsync';
import { useApi } from '../../services/api';
import { cursosService } from '../cursos/cursos.service';
import { disciplinasService } from './disciplinas.service';

export function DisciplinasPage() {
  const api = useApi();
  const [cursoId, setCursoId] = useState('');
  const cursos = useAsync(() => cursosService.listar(api), [api]);
  const { data, loading, error, reload } = useAsync(() => disciplinasService.listar(api, cursoId), [api, cursoId]);
  return <><div className="page-heading"><p className="eyebrow">AGREGAÇÃO POR COMPONENTE</p><h1>Disciplinas</h1>
    <p>Indicadores calculados sobre tentativas registradas, não sobre uma importação completa do SIGAA.</p></div>
    <div className="toolbar"><label>Curso <select value={cursoId} onChange={(e) => setCursoId(e.target.value)}>
      <option value="">Todos os cursos</option>{cursos.data?.map((curso) => <option value={curso.id} key={curso.id}>{curso.nome}</option>)}</select></label></div>
    <Feedback loading={loading} error={error} onRetry={() => void reload()} />
    <div className="card table-wrap"><table><thead><tr><th>Código</th><th>Disciplina</th><th>Curso</th>
      <th>Créditos</th><th>Tentativas</th><th>Aprovações</th><th>Reprovações</th></tr></thead>
      <tbody>{data?.map((d) => <tr key={d.id}><td>{d.codigo}</td><td>{d.nome}</td>
      <td>{d.curso.nome}</td><td>{d.creditos}</td><td>{d.totalTentativas}</td>
      <td>{d.aprovadas}</td><td>{d.reprovadas}</td></tr>)}</tbody></table>
      {data?.length === 0 && <p className="padded muted">Não há disciplinas cadastradas.</p>}</div>
  </>;
}
