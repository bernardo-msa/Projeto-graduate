import { useState, type FormEvent } from 'react';
import { Feedback } from '../../components/Feedback';
import { Status } from '../../components/Status';
import { useApi } from '../../services/api';
import { useAsync } from '../../hooks/useAsync';
import { disciplinasService } from '../disciplinas/disciplinas.service';
import { alunosService } from './alunos.service';
import { useAluno } from './useAlunos';
import type { SituacaoTentativa } from './alunos.types';

const statusOptions: SituacaoTentativa[] = ['APROVADO','REPROVADO_NOTA','REPROVADO_FALTA','CURSANDO','TRANCADO'];
export function AlunoDetalhe({ id, onClose, onChanged }: { id: string; onClose: () => void; onChanged: () => void }) {
  const api = useApi();
  const { data: aluno, loading, error, reload } = useAluno(id);
  const disciplinas = useAsync(() => disciplinasService.listar(api, aluno?.cursoId ?? ''), [api, aluno?.cursoId]);
  const [aba, setAba] = useState<'visao'|'historico'|'ep'|'atendimentos'>('visao');
  const [feedback, setFeedback] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [disciplinaId, setDisciplinaId] = useState('');
  const [periodo, setPeriodo] = useState('2026.2');
  const [nota, setNota] = useState('');
  const [frequencia, setFrequencia] = useState('');
  const [situacao, setSituacao] = useState<SituacaoTentativa>('APROVADO');
  const [tipo, setTipo] = useState('CONTATO');
  const [descricao, setDescricao] = useState('');

  async function salvarTentativa(event: FormEvent) {
    event.preventDefault(); setFeedback(''); setSalvando(true);
    try {
      const disciplinasCurso = disciplinas.data ?? [];
      const idEscolhido = disciplinaId || disciplinasCurso[0]?.id;
      if (!idEscolhido) throw new Error('Nenhuma disciplina disponível para este curso');
      await alunosService.tentativa(api, id, {
        disciplinaId: idEscolhido, periodo,
        nota: nota === '' ? null : Number(nota),
        frequencia: frequencia === '' ? null : Number(frequencia), situacao,
      });
      setFeedback('Tentativa registrada.'); setNota(''); setFrequencia('');
      await reload(); onChanged();
    } catch (e) { setFeedback(e instanceof Error ? e.message : 'Erro ao salvar'); }
    finally { setSalvando(false); }
  }
  async function salvarAtendimento(event: FormEvent) {
    event.preventDefault(); setFeedback(''); setSalvando(true);
    try {
      await alunosService.atendimento(api, id, tipo, descricao);
      setDescricao(''); setFeedback('Atendimento registrado.'); await reload();
    } catch (e) { setFeedback(e instanceof Error ? e.message : 'Erro ao salvar'); }
    finally { setSalvando(false); }
  }
  return <div className="overlay drawer-overlay" onMouseDown={onClose}>
    <section className="drawer" role="dialog" aria-modal="true" aria-label="Prontuário acadêmico" onMouseDown={(e) => e.stopPropagation()}>
      <div className="drawer-top"><div><p className="eyebrow">PRONTUÁRIO ACADÊMICO</p>
        <h2>{aluno?.nome ?? 'Carregando…'}</h2><span className="muted">Matrícula {aluno?.matricula}</span></div>
        <button className="btn small" onClick={onClose}>Fechar</button></div>
      <Feedback loading={loading} error={error} onRetry={() => void reload()} />
      {aluno && <><div className="tabs">
        {([['visao','Visão geral'],['historico','Histórico'],['ep','Análise EP'],['atendimentos','Atendimentos']] as const)
          .map(([value,label]) => <button key={value} className={`tab ${aba === value ? 'selected' : ''}`} onClick={() => { setAba(value); setFeedback(''); }}>{label}</button>)}
      </div><div className="drawer-body">
        {aba === 'visao' && <><div className="mini-stats">
          <div><small>CR registrado</small><strong>{aluno.cr.toFixed(1).replace('.',',')}</strong></div>
          <div><small>Créditos</small><strong>{aluno.creditosConcluidos}/{aluno.curso.creditosTotais}</strong></div>
          <div><small>Triagem</small><Status value={aluno.triagem.situacao}/></div>
        </div><div className="card spaced"><h3>Integralização curricular</h3>
          <div className="progress-track"><div style={{ width: `${Math.min(100,aluno.triagem.percentualConcluido)}%` }} /></div>
          <p>{aluno.triagem.percentualConcluido}% dos créditos concluídos</p>
          <div className="details-list"><div>Curso <strong>{aluno.curso.nome}</strong></div>
          <div>Matriz <strong>{aluno.curso.matriz}</strong></div>
          <div>Ingresso <strong>{aluno.periodoIngresso}</strong></div>
          <div>Modalidade <strong>{aluno.modalidadeIngresso}</strong></div></div>
        </div><div className="notice">O CR e os créditos atuais são valores cadastrados manualmente ou importados.
          A inclusão de uma tentativa não recalcula esses campos automaticamente.</div></>}
        {aba === 'historico' && <><h3>Tentativas por disciplina</h3>
          <div className="table-wrap"><table><thead><tr><th>Disciplina</th><th>Período</th><th>Nota</th><th>Frequência</th><th>Situação</th></tr></thead>
          <tbody>{aluno.tentativas.map((t) => <tr key={t.id}><td>{t.disciplina.nome}</td>
            <td>{t.periodo}</td><td>{t.nota ?? '—'}</td><td>{t.frequencia == null ? '—' : `${t.frequencia}%`}</td>
            <td>{t.situacao.replaceAll('_',' ')}</td></tr>)}</tbody></table>
          {aluno.tentativas.length === 0 && <p className="muted padded">Ainda não há histórico cadastrado.</p>}</div>
          <form className="card spaced form-stack" onSubmit={(e) => void salvarTentativa(e)}>
            <h3>Adicionar tentativa</h3>
            <label>Disciplina *<select value={disciplinaId} onChange={(e) => setDisciplinaId(e.target.value)} required>
              <option value="">{disciplinas.data?.length ? 'Selecione a disciplina' : 'Nenhuma disciplina cadastrada'}</option>
              {disciplinas.data?.map((d) => <option value={d.id} key={d.id}>{d.codigo} — {d.nome}</option>)}</select></label>
            <label>Período *<input value={periodo} pattern="[0-9]{4}\.[12]" onChange={(e) => setPeriodo(e.target.value)} required /></label>
            <label>Situação *<select value={situacao} onChange={(e) => setSituacao(e.target.value as SituacaoTentativa)}>
              {statusOptions.map((s) => <option key={s} value={s}>{s.replaceAll('_',' ')}</option>)}</select></label>
            <div className="form-grid"><label>Nota (0 a 10)<input type="number" min="0" max="10" step="0.1" value={nota} onChange={(e) => setNota(e.target.value)} /></label>
              <label>Frequência (0 a 100%)<input type="number" min="0" max="100" step="0.1" value={frequencia} onChange={(e) => setFrequencia(e.target.value)} /></label></div>
            <button disabled={salvando || !disciplinas.data?.length} className="btn primary">Registrar tentativa</button>
          </form></>}
        {aba === 'ep' && <>
        <div className="notice">{aluno.triagem.aviso}</div>

        <h3>Critérios para análise</h3>

        <div className="details-list criteria">
          <div>
            2+ reprovações no mesmo componente obrigatório
            <strong>
              {aluno.triagem.evidencias.duasReprovacoesMesmaDisciplina
                ? 'Indício identificado'
                : 'Não identificado na base'}
            </strong>
          </div>

          <div>
            Reprovação em todos os componentes do último semestre
            <strong>Não avaliado</strong>
          </div>

          <div>
            CR inferior ao limite em dois semestres
            <strong>Não avaliado</strong>
          </div>

          <div>
            Esgotamento do prazo de integralização
            <strong>Não avaliado</strong>
          </div>
        </div>

        <h3>Reprovações registradas</h3>

        {aluno.triagem.reprovacoesPorDisciplina.length > 0 ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Disciplina</th>
                  <th>Obrigatória</th>
                  <th>Reprovações</th>
                  <th>Tentativas reprovadas</th>
                </tr>
              </thead>

              <tbody>
                {aluno.triagem.reprovacoesPorDisciplina.map((disciplina) => (
                  <tr key={disciplina.codigo}>
                    <td>
                      <strong>{disciplina.nome}</strong>
                      <br />
                      <span className="muted">{disciplina.codigo}</span>
                    </td>

                    <td>{disciplina.obrigatoria ? 'Sim' : 'Não'}</td>

                    <td>{disciplina.quantidadeReprovacoes}</td>

                    <td>
                      {disciplina.tentativas.map((tentativa, index) => (
                        <div key={`${tentativa.periodo}-${index}`}>
                          {tentativa.periodo} — {
                            tentativa.situacao === 'REPROVADO_NOTA'
                              ? 'Por nota'
                              : 'Por falta'
                          }
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="muted">
            Nenhuma reprovação registrada no histórico disponível.
          </p>
        )}

        <p className="muted">
          Não haver indício cadastrado não comprova ausência de elegibilidade.
          A decisão cabe ao NEAP.
        </p>
      </>}
        {aba === 'atendimentos' && <><h3>Registros de acompanhamento</h3>
          {aluno.atendimentos?.length ? aluno.atendimentos.map((r) => <div className="card record" key={r.id}>
            <strong>{r.tipo}</strong><span className="muted"> • {new Date(r.criadoEm).toLocaleString('pt-BR')} • {r.registradoPor}</span>
            <p>{r.descricao}</p></div>) : <p className="muted">Nenhum atendimento registrado.</p>}
          <form className="card spaced form-stack" onSubmit={(e) => void salvarAtendimento(e)}>
            <h3>Novo atendimento</h3><label>Tipo<select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="CONTATO">Contato</option><option value="ORIENTACAO">Orientação</option>
              <option value="ENCAMINHAMENTO">Encaminhamento</option><option value="OUTRO">Outro</option></select></label>
            <label>Descrição<textarea minLength={5} maxLength={2000} rows={4} value={descricao} onChange={(e) => setDescricao(e.target.value)} required /></label>
            <button className="btn primary" disabled={salvando}>Salvar atendimento</button>
          </form></>}
        {feedback && <div className="notice" role="status">{feedback}</div>}
      </div></>}
    </section>
  </div>;
}
