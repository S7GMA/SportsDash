import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { SearchModal } from '@/components/SearchModal';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/live', label: 'Live' },
  { to: '/garage', label: 'Garage' },
  { to: '/collectables', label: 'Cards' },
  { to: '/schedule', label: 'Scores' },
  { to: '/explore', label: 'Clubs' },
  { to: '/favorites', label: 'Pinned' },
  { to: '/settings', label: 'Profile' },
];

export function AppShell() {
  const [searchOpen, setSearchOpen] = useState(false);
  return (
    <div style={{ minHeight: '100vh' }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 20, background: 'var(--bg)', borderBottom: '3px solid var(--ivy-dark)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
          <NavLink to="/" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <img src="/brand/dannyboy-logo.png" alt="Danny Boy" className="logo" />
            <span className="kicker" style={{ textAlign: 'center', letterSpacing: '0.35em', fontSize: 16 }}>Sports</span>
          </NavLink>
          <nav className="hide-sm" style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                style={({ isActive }) => ({
                  padding: '10px 12px',
                  fontFamily: '"Pixelify Sans", sans-serif',
                  fontWeight: 700,
                  fontSize: 18,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: isActive ? 'var(--ivy)' : 'var(--ink)',
                  borderBottom: isActive ? '3px solid var(--ivy)' : '3px solid transparent',
                })}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <button className="btn-3d" onClick={() => setSearchOpen(true)} style={{ marginLeft: 'auto', fontSize: 16, padding: '12px 18px' }}>
            Search
          </button>
        </div>
      </header>
      <main className="page">
        <Outlet />
      </main>
      <nav
        className="mobile-nav"
        style={{
          display: 'none',
          position: 'sticky',
          bottom: 0,
          background: 'var(--bg)',
          borderTop: '3px solid var(--ivy-dark)',
          padding: '8px 6px calc(8px + env(safe-area-inset-bottom))',
        }}
      >
        {LINKS.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/'}
            style={({ isActive }) => ({
              flex: 1,
              textAlign: 'center',
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: isActive ? 'var(--ivy)' : 'var(--mute)',
              padding: '8px 0',
            })}
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
