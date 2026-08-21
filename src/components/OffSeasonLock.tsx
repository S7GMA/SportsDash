import { useEffect, useState, type ReactNode } from 'react';
import type { SeasonGate } from '@/domain/dbs';
import { countdownParts, formatLocal } from '@/lib/countdown';

export function OffSeasonLock({ gate, children }: { gate?: SeasonGate; children: ReactNode }) {
  const locked = Boolean(gate && !gate.inSeason);
  return (
    <div className="lock-wrap">
      <div className={locked ? 'greyed' : undefined}>{children}</div>
      {locked && gate && <Sticker gate={gate} />}
    </div>
  );
}

function Sticker({ gate }: { gate: SeasonGate }) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setTick((n) => n + 1), 1000);
    return () => window.clearInterval(t);
  }, []);
  const c = countdownParts(gate.resumesAt);
  return (
    <div className="lock-sticker">
      <div className="seal">
        <div className="kicker" style={{ color: 'var(--mint)' }}>{gate.resumesLabel}</div>
        <div className="wordmark" style={{ fontSize: 32, margin: '8px 0', color: '#fff' }}>
          {c.past ? 'SOON' : `${c.d}d ${String(c.h).padStart(2, '0')}h`}
        </div>
        <div className="mono" style={{ fontSize: 12 }}>
          {c.past ? 'Hang tight' : `${String(c.m).padStart(2, '0')}m ${String(c.s).padStart(2, '0')}s`}
        </div>
        <div className="mono" style={{ fontSize: 11, marginTop: 8, opacity: 0.8 }}>{formatLocal(gate.resumesAt)}</div>
      </div>
    </div>
  );
}
