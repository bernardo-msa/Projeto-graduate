import { useState, type FormEvent } from 'react';
import { alunosService } from './alunos.service';
import { useApi } from '../../services/api';
import type { Curso, NovoAluno } from './alunos.types';

interface Props { cursos: Curso[]; onClose: () => void; onSaved: () => void; }
export function AlunoForm({ cursos, onClose, onSaved }: Props) {
  const api = useApi();
  const [form, setForm] = useState<NovoAluno>({
    matricula:'', nome:'', email:'', cursoId: cursos[0]?.id ?? '', periodoIngresso:'2026.2',
    modalidadeIngresso:'Não informada', cr:0, creditosConcluidos:0,
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  function set<K extends keyof NovoAluno>(field: K, value: NovoAluno[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }
  async function submit(event: FormEvent) {
    event.preventDefault(); setError(''); setSaving(true);
    try { await alunosService.criar(api, form); onSaved(); }
    catch (e) { setError(e instanceof Error ? e.message : 'Erro ao cadastrar'); }
    finally { setSaving(false); }
  }
  return <div className="overlay" role="presentation" onMouseDown={onClose}>
    <div className="dialog" role="dialog" aria-modal="true" aria-label="Cadastrar aluno" onMouseDown={(e) => e.stopPropagation()}>
      <div className="dialog-head"><h2>Cadastrar aluno</h2><button className="btn small" onClick={onClose}>Fechar</button></div>
      <form onSubmit={(e) => void submit(e)} className="form-grid">
        <label>Nome completo *<input required minLength={3} value={form.nome} onChange={(e) => set('nome',e.target.value)} /></label>
        <label>Matrícula *<input required value={form.matricula} onChange={(e) => set('matricula',e.target.value)} /></label>
        <label>E-mail institucional<input type="email" value={form.email} onChange={(e) => set('email',e.target.value)} /></label>
        <label>Curso *<select required value={form.cursoId} onChange={(e) => set('cursoId',e.target.value)}>
          {cursos.map((c) => <option key={c.id} value={c.id}>{c.nome}</option> )}</select></label>
        <label>Ingresso (AAAA.1 ou AAAA.2) *<input required pattern="[0-9]{4}\.[12]" value={form.periodoIngresso} onChange={(e) => set('periodoIngresso',e.target.value)} /></label>
        <label>Forma de ingresso<input value={form.modalidadeIngresso} onChange={(e) => set('modalidadeIngresso',e.target.value)} /></label>
        <label>CR atual<input type="number" min="0" max="10" step="0.1" value={form.cr} onChange={(e) => set('cr',Number(e.target.value))} /></label>
        <label>Créditos concluídos<input type="number" min="0" step="1" value={form.creditosConcluidos} onChange={(e) => set('creditosConcluidos',Number(e.target.value))} /></label>
        <div className="form-full muted">Registro manual: os dados ainda não são consultados no SIGAA.</div>
        {error && <div className="error form-full">{error}</div>}
        <div className="button-row form-full end"><button type="button" className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn primary" disabled={saving || !cursos.length}>{saving ? 'Salvando…' : 'Cadastrar'}</button></div>
      </form>
    </div>
  </div>;
}
