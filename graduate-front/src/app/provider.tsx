import type { ReactNode } from 'react';
import { AuthProvider } from 'react-oidc-context';
import { env } from '../config/env';

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <AuthProvider
      authority={`${env.keycloakUrl}/realms/${env.realm}`}
      client_id={env.clientId}
      redirect_uri={window.location.origin}
      post_logout_redirect_uri={window.location.origin}
      response_type="code"
      scope="openid profile email"
      automaticSilentRenew
      onSigninCallback={() => { window.history.replaceState({}, document.title, '/'); }}
    >
      {children}
    </AuthProvider>
  );
}
