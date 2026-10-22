import { useCallback, useEffect, useRef, useState } from 'react';

// Um hook reutilizável para chamadas assíncronas (sem biblioteca de estado extra).
export function useAsync<T>(fetcher: () => Promise<T>, dependencies: unknown[]) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const generation = useRef(0);
  // O chamador decide quando o fetcher muda, através das dependencies.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const reload = useCallback(async () => {
    const current = ++generation.current;
    setLoading(true); setError(null);
    try {
      const value = await fetcher();
      if (generation.current === current) setData(value);
    } catch (e) {
      if (generation.current === current) setError(e instanceof Error ? e.message : 'Falha inesperada');
    } finally {
      if (generation.current === current) setLoading(false);
    }
  }, dependencies);
  useEffect(() => { void reload(); return () => { generation.current++; }; }, [reload]);
  return { data, loading, error, reload };
}
