import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSportsData } from '@/providers/SportsDataContext';
import { useFavoritesStore, usePrefsStore } from '@/state/stores';
import type { SportKey } from '@/domain/dbs';

const SPORTS: { id: SportKey; label: string }[] = [
  { id: 'f1', label: 'Formula 1' },
  { id: 'nfl', label: 'NFL' },
  { id: 'nba', label: 'NBA' },
  { id: 'mlb', label: 'MLB' },
  { id: 'soccer', label: 'FIFA / EPL' },
];

export function OnboardingPage() {
  const nav = useNavigate();
  const { teams, drivers, loading } = useSportsData();
  const [step, setStep] = useState<1 | 2>(1);
  const preferred = usePrefsStore((s) => s.preferredSports);
  const setPreferred = usePrefsStore((s) => s.setPreferredSports);
  const complete = usePrefsStore((s) => s.setOnboardingComplete);
  const toggle = useFavoritesStore((s) => s.toggleFavorite);
  const isFav = useFavoritesStore((s) => s.isFavorite);

  if (loading) return <p className="page kicker">Loading the board…</p>;

  const shownTeams = preferred.length ? teams.filter((t) => preferred.includes(t.sport)) : teams;

  return (
    <div className="page" style={{ maxWidth: 900 }}>
      <div className="kicker">STEP {step} / 2</div>
      <h1 className="display" style={{ fontSize: 42, color: 'var(--ivy-dark)' }}>
        {step === 1 ? 'Which sports do you follow?' : 'Pin the clubs you care about'}
      </h1>
      {step === 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
          {SPORTS.map((s) => {
            const on = preferred.includes(s.id);
            return (
              <button
                key={s.id}
                className="ticket"
                onClick={() => setPreferred(on ? preferred.filter((id) => id !== s.id) : [...preferred, s.id])}
                style={{ padding: 18, outline: on ? '3px solid var(--ivy)' : undefined }}
              >
                <div className="display" style={{ fontSize: 22 }}>{s.label}</div>
              </button>
            );
          })}
        </div>
      )}
      {step === 2 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {shownTeams.map((t) => (
            <button
              key={t.id}
              onClick={() => toggle({ id: t.id, type: 'team', refId: t.id, name: t.name })}
              style={{
                border: '2px solid var(--ivy-dark)',
                background: isFav('team', t.id) ? 'var(--ivy)' : 'var(--paper)',
                color: isFav('team', t.id) ? '#fff' : 'var(--ink)',
                borderRadius: 4,
                padding: '8px 12px',
                fontWeight: 700,
              }}
            >
              {t.name}
            </button>
          ))}
          {preferred.includes('f1') &&
            drivers.map((d) => (
              <button
                key={d.id}
                onClick={() => toggle({ id: d.id, type: 'driver', refId: d.id, name: d.name })}
                style={{
                  border: '2px solid var(--ivy-dark)',
                  background: isFav('driver', d.id) ? 'var(--ivy)' : 'var(--paper)',
                  color: isFav('driver', d.id) ? '#fff' : 'var(--ink)',
                  borderRadius: 4,
                  padding: '8px 12px',
                }}
              >
                {d.code}
              </button>
            ))}
        </div>
      )}
      <div style={{ display: 'flex', gap: 12 }}>
        {step === 2 && (
          <button onClick={() => setStep(1)} className="chip" style={{ padding: '10px 16px' }}>
            Back
          </button>
        )}
        <button
          className="btn-3d"
          onClick={() => {
            if (step === 1) {
              setStep(2);
              return;
            }
            complete(true);
            nav('/');
          }}
        >
          {step === 1 ? 'Continue' : 'Open the board'}
        </button>
      </div>
    </div>
  );
}
