import React from 'react';
import { NavLink, Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Wrench,
  PlusCircle,
  Search,
  Layers,
  LogOut,
  ExternalLink,
} from 'lucide-react';

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/') return 'Dashboard';
    if (path === '/repairs') return 'All Repairs';
    if (path === '/repairs/new') return 'New Repair';
    if (path.startsWith('/repairs/') && path.includes('/edit')) return 'Edit Repair';
    if (path.startsWith('/repairs/')) return 'Repair Details';
    if (path === '/track' || path === '/tracking') return 'Customer Tracking';
    return 'RepairFlow';
  };

  const handleSignOut = () => {
    navigate('/');
  };

  return (
    <div className="app-container">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        {/* Logo */}
        <div className="sidebar-header">
          <Link to="/dashboard" className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <Wrench size={14} />
            </div>
            <span>RepairFlow</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={17} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/repairs"
            end
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Layers size={17} />
            <span>All Repairs</span>
          </NavLink>

          <NavLink
            to="/repairs/new"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <PlusCircle size={17} />
            <span>New Repair</span>
          </NavLink>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <button
            onClick={handleSignOut}
            className="nav-item"
            style={{
              width: '100%',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              marginBottom: 12,
            }}
          >
            <LogOut size={16} />
            <span>Sign out</span>
          </button>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-light)', lineHeight: 1.4 }}>
            RepairFlow v1.0<br />Java + Spring Boot
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="main-content">
        <header className="top-bar">
          <h1 className="top-bar-title">{getPageTitle()}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {location.pathname !== '/repairs/new' && (
              <Link to="/repairs/new" className="btn btn-primary btn-sm">
                <PlusCircle size={14} />
                <span>New Repair</span>
              </Link>
            )}
            <Link
              to="/track"
              className="btn btn-secondary btn-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Public Portal</span>
              <ExternalLink size={12} />
            </Link>
            <button
              onClick={handleSignOut}
              className="btn btn-secondary btn-sm"
              style={{ color: 'var(--text-muted)' }}
              title="Sign out of staff portal"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        <main className="page-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
