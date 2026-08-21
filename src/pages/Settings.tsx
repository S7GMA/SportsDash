import { useNavigate } from 'react-router-dom';
import { useFavoritesStore, useNotificationStore, usePrefsStore } from '@/state/stores';

export function SettingsPage() {
  const nav = useNavigate();
  const prefs = usePrefsStore();
  const clearFav = useFavoritesStore((s) => s.clear);
  const clearN = useNotificationStore((s) => s.clear);
  return (
    <>
      <h1 className="display" style={{ fontSize: 48, color: 'var(--ivy-dark)' }}>Profile</h1>
      <section className="ticket" style={{ padding: 18 }}>
        <h2 className="kicker">Timezone</h2>
        <p className="mono" style={{ marginTop: 8 }}>{prefs.timezone}</p>
        <label style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <input type="checkbox" checked={prefs.showEventTimezone} onChange={(e) => prefs.setShowEventTimezone(e.target.checked)} />
          Also show event-local time
        </label>
      </section>
      <section className="ticket" style={{ padding: 18, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button onClick={() => nav('/onboarding')} className="btn-3d">Re-pin clubs</button>
        <button
          onClick={() => {
            clearFav();
            prefs.reset();
            clearN();
            nav('/welcome');
          }}
          className="chip"
          style={{ color: 'var(--live)' }}
        >
          Wipe this device
        </button>
      </section>
    </>
  );
}
