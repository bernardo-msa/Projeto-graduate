import { useState } from 'react';
import { Feedback } from '../../components/Feedback';
import { Status } from '../../components/Status';
import { useAsync } from '../../hooks/useAsync';
import { useApi } from '../../services/api';
import { cursosService } from '../cursos/cursos.service';
import { AlunoDetalhe } from './AlunoDetalhe';
import { AlunoForm } from './AlunoForm';
import { ImportarCsv } from './ImportarCsv';
import { useAlunos } from './useAlunos';
import type { SituacaoTriagem } from './alunos.types';

export function AlunosPage() {
  const api = useApi();
  const [busca, setBusca] = useState('');
  const [cursoId, setCursoId] = useState('');
  const [situacao, setSituacao] = useState<SituacaoTriagem | ''>('');
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const [modal, setModal] = useState<'novo'|'csv'|null>(null);
  const cursos = useAsync(() => cursosService.listar(api), [api]);
  const { data, loading, error, reload } = useAlunos(busca, cursoId, situacao);
  const total = data?.length ?? 0;
  return <><div className="page-heading heading-with-actions"><div><p className="eyebrow">ACOMPANHAMENTO PEDAGÓGICO</p>
    <h1>Gestão e acompanhamento de alunos</h1>
    <p>Busca por discente, matrícula e indicadores acadêmicos.</p></div>
    <div className="button-row"><button className="btn" onClick={() => setModal('csv')}>Importar CSV</button>
    <button className="btn primary" onClick={() => setModal('novo')}>+ Cadastrar aluno</button></div></div>
    <div className="toolbar filters">
      <label className="search-label">Buscar<input placeholder="Nome, matrícula ou e-mail…" value={busca} onChange={(e) => setBusca(e.target.value)} /></label>
      <label>Curso<select value={cursoId} onChange={(e) => setCursoId(e.target.value)}><option value="">Todos os cursos</option>
        {cursos.data?.map((c) => <option value={c.id} key={c.id}>{c.nome}</option>)}</select></label>
      <label>Situação<select value={situacao} onChange={(e) => setSituacao(e.target.value as SituacaoTriagem | '')}>
        <option value="">Todas</option><option value="REGULAR">Regular</option>
        <option value="ATENCAO">Em atenção</option><option value="POSSIVEL_EP">Possível EP</option></select></label>
    </div>
    <Feedback loading={loading} error={error} onRetry={() => void reload()} />
    <div className="card table-wrap"><table><thead><tr><th>Aluno e matrícula</th><th>Curso</th><th>Ingresso</th>
      <th>CR</th><th>Créditos</th><th>Progresso</th><th>Triagem</th><th></th></tr></thead>
      <tbody>{data?.map((aluno) => <tr key={aluno.id}><td><strong>{aluno.nome}</strong><small>{aluno.matricula}</small></td>
      <td>{aluno.curso.nome}</td><td>{aluno.periodoIngresso}</td><td>{aluno.cr.toFixed(1).replace('.',',')}</td>
      <td>{aluno.creditosConcluidos}/{aluno.curso.creditosTotais}</td>
      <td><div className="progress-track"><div style={{ width: `${Math.min(100,aluno.triagem.percentualConcluido)}%` }}/></div>
      <small>{aluno.triagem.percentualConcluido}%</small></td>
      <td><Status value={aluno.triagem.situacao}/></td><td><button className="btn small" onClick={() => setSelecionado(aluno.id)}>Prontuário</button></td></tr>)}</tbody></table>
      {data && total === 0 && <p className="muted padded">Nenhum aluno encontrado para os filtros atuais.</p>}</div>
    <p className="muted">{total} aluno(s) exibidos. Situações calculadas apenas com dados já cadastrados.</p>
    {modal === 'novo' && <AlunoForm cursos={cursos.data ?? []} onClose={() => setModal(null)} onSaved={() => { setModal(null); void reload(); }} />}
    {modal === 'csv' && <ImportarCsv cursos={cursos.data ?? []} onClose={() => setModal(null)} onSaved={() => { setModal(null); void reload(); }} />}
    {selecionado && <AlunoDetalhe id={selecionado} onClose={() => setSelecionado(null)} onChanged={() => void reload()} />}
  </>;
}
