import { Link } from 'react-router-dom';
import { Feedback } from '../../components/Feedback';
import { Status } from '../../components/Status';
import { useAlunos } from '../alunos/useAlunos';

export function EpPage() {
  const { data, loading, error, reload } = useAlunos('', '', 'POSSIVEL_EP');
  return <><div className="page-heading"><p className="eyebrow">ESTUDOS PLANEJADOS</p>
    <h1>Triagem para EP</h1><p>Identificação preliminar de casos para avaliação do NEAP.</p></div>
    <div className="notice"><strong>Importante:</strong> o MVP apenas identifica registros com duas ou mais reprovações no mesmo componente obrigatório.
      Os demais critérios do regulamento exigem histórico integral e validação institucional e ainda não são calculados.
      Nenhum plano de EP é concedido automaticamente.</div>
    <Feedback loading={loading} error={error} onRetry={() => void reload()} />
    <div className="card table-wrap"><table><thead><tr><th>Aluno</th><th>Matrícula</th><th>Curso</th><th>Triagem</th><th></th></tr></thead>
      <tbody>{data?.map((aluno) => <tr key={aluno.id}><td>{aluno.nome}</td><td>{aluno.matricula}</td>
      <td>{aluno.curso.nome}</td><td><Status value={aluno.triagem.situacao}/></td>
      <td><Link to="/alunos" className="link">Ver em alunos</Link></td></tr>)}</tbody></table>
      {data?.length === 0 && <p className="padded muted">Nenhum caso identificado na base cadastrada.</p>}</div>
    <p className="muted">Fonte dos critérios: documentos enviados pelo grupo. A interpretação normativa requer conferência com o NEAP.</p>
  </>;
}
