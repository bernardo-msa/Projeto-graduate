import type { SituacaoTriagem } from '../modules/alunos/alunos.types';
const labels: Record<SituacaoTriagem,string> = {
  REGULAR:'Regular', ATENCAO:'Em atenção', POSSIVEL_EP:'Possível EP',
};
export function Status({ value }: { value: SituacaoTriagem }) {
  return <span className={`badge ${value.toLowerCase()}`}>{labels[value]}</span>;
}
