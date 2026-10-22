import { useCallback } from 'react';
import { useAuth } from 'react-oidc-context';
import { env } from '../config/env';

export type ApiRequest = <T>(path: string, options?: RequestInit) => Promise<T>;

async function serverError(response: Response): Promise<string> {
  try {
    const data: unknown = await response.json();
    if (typeof data === 'object' && data !== null && 'message' in data) {
      const message = (data as { message: unknown }).message;
      if (typeof message === 'string') return message;
      if (Array.isArray(message)) return message.join('; ');
    }
  } catch { /* resposta não JSON */ }
  return `A API respondeu HTTP ${response.status}`;
}

export function useApi(): ApiRequest {
  const { user, signinSilent } = useAuth();
  const token = user?.access_token;
  const expired = user?.expired;
  return useCallback(async <T,>(path: string, options: RequestInit = {}): Promise<T> => {
    // Mantém as credenciais fora dos componentes e tenta renovar antes de enviar.
    let accessToken = token;
    if (expired) accessToken = (await signinSilent())?.access_token;
    if (!accessToken) throw new Error('Sessão expirada. Faça login novamente.');
    const response = await fetch(`${env.apiUrl}${path}`, {
      ...options,
      headers: { 'Authorization': `Bearer ${accessToken}`, ...options.headers },
    });
    if (!response.ok) throw new Error(await serverError(response));
    return response.json() as Promise<T>;
  }, [token, expired, signinSilent]);
}

export function postJson<T>(api: ApiRequest, path: string, body: unknown): Promise<T> {
  return api<T>(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
}
