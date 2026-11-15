import type { Triagem } from './alunos.types';

export function AlunoAnaliseEP({ triagem }: { triagem: Triagem }) {
  return (
    <>

        <div className="notice">{triagem.aviso}</div>

        <h3>Critérios para análise</h3>

        <div className="details-list criteria">
          <div>
            2+ reprovações no mesmo componente obrigatório
            <strong>
              {triagem.evidencias.duasReprovacoesMesmaDisciplina
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

        {triagem.reprovacoesPorDisciplina.length > 0 ? (
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
                {triagem.reprovacoesPorDisciplina.map((disciplina) => (
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
    </>
  );
}
