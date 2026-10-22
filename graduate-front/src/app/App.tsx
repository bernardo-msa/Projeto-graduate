import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { Layout } from '../components/Layout';
import { PainelPage } from '../modules/painel/PainelPage';
import { AlunosPage } from '../modules/alunos/AlunosPage';
import { CursosPage } from '../modules/cursos/CursosPage';
import { DisciplinasPage } from '../modules/disciplinas/DisciplinasPage';
import { EpPage } from '../modules/estudos-planejados/EpPage';

function rolesFromAccessToken(token?: string): string[] {
  // Leitura apenas para UX. O backend valida criptograficamente as permissões.
  if (!token) return [];
  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const data = JSON.parse(atob(base64)) as { realm_access?: { roles?: string[] } };
    return data.realm_access?.roles ?? [];
  } catch { return []; }
}

function AuthenticatedApp() {
  const auth = useAuth();
  if (auth.isLoading || auth.activeNavigator) return <div className="login-screen">Carregando autenticação…</div>;
  if (auth.error) return <div className="login-screen">Erro de autenticação: {auth.error.message}<button onClick={() => void auth.signinRedirect()}>Tentar novamente</button></div>;
  if (!auth.isAuthenticated) {
    return <div className="login-screen"><div className="login-card">
      <span className="brand-icon">G</span><h1>Graduate</h1>
      <p>Acompanhamento acadêmico do NEAP</p>
      <p className="muted">Ambiente acadêmico de demonstração. Acesso autorizado.</p>
      <button className="btn primary" onClick={() => void auth.signinRedirect()}>Entrar com Keycloak</button>
    </div></div>;
  }
  const roles = rolesFromAccessToken(auth.user?.access_token);
  if (!roles.includes('NEAP') && !roles.includes('ADMIN')) {
    return <div className="login-screen">Seu perfil não tem acesso ao NEAP. <button onClick={() => void auth.signoutRedirect()}>Sair</button></div>;
  }
  return <BrowserRouter><Routes><Route element={<Layout />}>
    <Route path="/" element={<PainelPage />} />
    <Route path="/alunos" element={<AlunosPage />} />
    <Route path="/disciplinas" element={<DisciplinasPage />} />
    <Route path="/cursos" element={<CursosPage />} />
    <Route path="/ep" element={<EpPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Route></Routes></BrowserRouter>;
}
export default function App() { return <AuthenticatedApp />; }
