export function Feedback({ loading, error, onRetry }: {
  loading: boolean; error?: string | null; onRetry?: () => void;
}) {
  if (loading) return <p className="muted padded">Carregando dados…</p>;
  if (error) return <div className="error">{error} {onRetry && <button className="btn small" onClick={onRetry}>Tentar novamente</button>}</div>;
  return null;
}
