import { Link } from 'react-router-dom';
import { usePrefsStore } from '@/state/stores';

export function WelcomePage() {
  const complete = usePrefsStore((s) => s.setOnboardingComplete);
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <div style={{ maxWidth: 800, textAlign: 'center' }}>
        <img src="/brand/dannyboy-logo.png" alt="Danny Boy" className="logo" style={{ height: 144, margin: '0 auto' }} />
        <div className="kicker" style={{ fontSize: 31, marginTop: -18, letterSpacing: '0.4em' }}>Sports</div>
        <p className="display" style={{ fontSize: 42, margin: '18px 0 10px', color: 'var(--ivy-dark)' }}>
                  Log in? Nah.
        </p>
        <p style={{ fontSize: 18, color: 'var(--mute)', maxWidth: 480, margin: '0 auto' }}>
          Live scores, full clubs, and F1 trading cards. No account. Favorites stay on this device.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 28, flexWrap: 'wrap' }}>
          <Link to="/onboarding" className="btn-3d">Pin your Favs</Link>
          <Link
            to="/"
            onClick={() => complete(true)}
            className="chip"
            style={{ padding: '10px 16px', fontSize: 13 }}
          >
            Skip for now
          </Link>
        </div>
      </div>
    </div>
  );
}
