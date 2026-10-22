import { useState, type FormEvent } from 'react';
import { useApi } from '../../services/api';
import { alunosService } from './alunos.service';
import type { Curso, NovoAluno } from './alunos.types';

const colunas = ['matricula','nome','email','cursoCodigo','periodoIngresso','modalidadeIngresso','cr','creditosConcluidos'];

// CSV intencionalmente simples (separador ; sem campos entre aspas).
// Para arquivos institucionais complexos, posteriormente usar um parser robusto no backend.
function interpretar(texto: string, cursos: Curso[]): NovoAluno[] {
  const linhas = texto.replace(/^\uFEFF/, '').trim().split(/\r?\n/).map((linha) => linha.trim()).filter(Boolean);
  if (linhas.length < 2) throw new Error('Arquivo sem registros');
  const cabecalho = linhas[0].split(';').map((c) => c.trim());
  if (cabecalho.join(';') !== colunas.join(';')) throw new Error(`Cabeçalho esperado: ${colunas.join(';')}`);
  if (linhas.length > 101) throw new Error('Limite de 100 alunos por arquivo');
  return linhas.slice(1).map((linha, index) => {
    const valores = linha.split(';').map((v) => v.trim());
    if (valores.length !== colunas.length) throw new Error(`Quantidade de colunas inválida na linha ${index + 2}`);
    const curso = cursos.find((c) => c.codigo === valores[3]);
    if (!curso) throw new Error(`Curso '${valores[3]}' não cadastrado na linha ${index + 2}`);
    const cr = Number(valores[6].replace(',', '.'));
    const creditosConcluidos = Number(valores[7]);
    if (!Number.isFinite(cr) || !Number.isInteger(creditosConcluidos)) throw new Error(`Números inválidos na linha ${index + 2}`);
    return { matricula:valores[0], nome:valores[1], email:valores[2], cursoId:curso.id,
      periodoIngresso:valores[4], modalidadeIngresso:valores[5] || 'Não informada',
      cr, creditosConcluidos };
  });
}

export function ImportarCsv({ cursos, onClose, onSaved }: {
  cursos: Curso[]; onClose: () => void; onSaved: () => void;
}) {
  const api = useApi();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault(); setError(''); setSaving(true);
    try {
      if (!file) throw new Error('Escolha um arquivo .csv');
      const alunos = interpretar(await file.text(), cursos);
      const { importados } = await alunosService.importar(api, alunos);
      alert(`${importados} alunos importados com sucesso.`); onSaved();
    } catch(e) { setError(e instanceof Error ? e.message : 'Falha de importação'); }
    finally { setSaving(false); }
  }
  return <div className="overlay" onMouseDown={onClose}><div className="dialog" role="dialog" aria-modal="true" aria-label="Importação CSV" onMouseDown={(e) => e.stopPropagation()}>
    <div className="dialog-head"><h2>Importar CSV local</h2><button className="btn small" onClick={onClose}>Fechar</button></div>
    <p className="muted">Importação apenas de dados cadastrais, sem histórico. Não existe integração com SIGAA nesta versão.</p>
    <p>Colunas obrigatórias, nessa ordem, separadas por ponto e vírgula:</p>
    <code className="csv-header">{colunas.join(';')}</code>
    <p className="muted">Códigos de curso disponíveis: {cursos.map((c) => c.codigo).join(', ') || 'nenhum'}.
      Campos entre aspas contendo ; não são suportados neste MVP.</p>
    <form onSubmit={(e) => void submit(e)}><label>Arquivo CSV
      <input type="file" accept=".csv,text/csv" onChange={(e) => setFile(e.target.files?.[0] ?? null)} required /></label>
      {error && <div className="error">{error}</div>}
      <div className="button-row end"><button className="btn primary" disabled={saving}>{saving ? 'Importando…' : 'Importar registros'}</button></div>
    </form>
  </div></div>;
}
