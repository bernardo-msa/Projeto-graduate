import { Link } from 'react-router-dom';
import { Feedback } from '../../components/Feedback';
import { useAsync } from '../../hooks/useAsync';
import { useApi } from '../../services/api';
import { painelService } from './painel.service';

export function PainelPage() {
  const api = useApi();
  const { data, loading, error, reload } = useAsync(() => painelService.obter(api), [api]);
  return <>
    <div className="page-heading"><p className="eyebrow">VISÃO INTEGRADA • NEAP</p><h1>Painel geral</h1>
      <p>Resumo dos registros acadêmicos disponíveis para a equipe de acompanhamento.</p></div>
    <Feedback loading={loading} error={error} onRetry={() => void reload()} />
    {data && <><div className="stats-grid">
      <div className="stat"><small>Alunos cadastrados</small><strong>{data.totalAlunos}</strong></div>
      <div className="stat"><small>Em atenção</small><strong>{data.emAtencao}</strong></div>
      <div className="stat"><small>Possível EP (triagem)</small><strong>{data.possivelEp}</strong></div>
      <div className="stat"><small>CR médio na base</small><strong>{data.crMedio.toFixed(2).replace('.', ',')}</strong></div>
    </div><div className="card spaced"><h2>Por onde começar?</h2>
      <p>Acompanhe o progresso individual e os registros do histórico. Os casos de EP são indícios que exigem avaliação humana.</p>
      <div className="button-row"><Link className="btn primary" to="/alunos">Ver alunos</Link>
      <Link className="btn" to="/ep">Consultar triagem EP</Link></div>
    </div><div className="notice">{data.aviso}</div></>}
  </>;
}
