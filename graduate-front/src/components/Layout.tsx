import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';

const links = [
  { path: '/', label: 'Painel geral', icon: '▦' },
  { path: '/alunos', label: 'Alunos', icon: '♙' },
  { path: '/disciplinas', label: 'Disciplinas', icon: '▤' },
  { path: '/cursos', label: 'Cursos e currículos', icon: '▥' },
  { path: '/ep', label: 'Estudos Planejados', icon: '◇' },
];

export function Layout() {
  const auth = useAuth();
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-icon">G</span><div><strong>Graduate</strong><small>NEAP • Apoio</small></div></div>
      <p className="nav-subtitle">ACOMPANHAMENTO</p>
      <nav>{links.map(({ path, label, icon }) =>
        <NavLink key={path} to={path} end={path === '/'} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">{icon}</span>{label}
        </NavLink>,
      )}</nav>
      <p className="sidebar-disclaimer">MVP acadêmico • Base demonstrativa<br/>Sem sincronização com SIGAA</p>
    </aside>
    <div className="app-content">
      <header className="topbar">
        <div><strong>Graduate</strong><small>NEAP · Núcleo de Estudos e Apoio Pedagógico</small></div>
        <div className="header-right"><span className="demo-pill">DADOS FICTÍCIOS</span>
          <span className="user-name">{auth.user?.profile.preferred_username ?? 'NEAP'}</span>
          <button className="btn ghost small" onClick={() => void auth.signoutRedirect()}>Sair</button>
        </div>
      </header>
      <main className="main-content"><Outlet /></main>
    </div>
  </div>;
}
