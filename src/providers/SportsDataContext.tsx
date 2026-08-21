import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { loadCatalog } from '@/api/catalog';
import type { DbsCatalog, DbsDriver, DbsTeam, SeasonGate, SportKey } from '@/domain/dbs';

const empty: DbsCatalog = {
  loading: true,
  gates: {} as DbsCatalog['gates'],
  teams: [],
  drivers: [],
  events: [],
  news: [],
  standings: {},
  constructors: [],
};

const Ctx = createContext<DbsCatalog>(empty);

export function SportsDataProvider({ children }: { children: ReactNode }) {
  const [catalog, setCatalog] = useState<DbsCatalog>(empty);

  useEffect(() => {
    let cancelled = false;
    loadCatalog()
      .then((data) => {
        if (!cancelled) setCatalog(data);
      })
      .catch((err: Error) => {
        if (!cancelled) setCatalog({ ...empty, loading: false, error: err.message });
      });
    const t = window.setInterval(() => {
      loadCatalog()
        .then((data) => {
          if (!cancelled) setCatalog(data);
        })
        .catch(() => undefined);
    }, 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(t);
    };
  }, []);

  const value = useMemo(() => catalog, [catalog]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSportsData() {
  return useContext(Ctx);
}

export function useGate(sport: SportKey): SeasonGate | undefined {
  return useSportsData().gates[sport];
}

export function useTeams(sport?: SportKey): DbsTeam[] {
  const { teams } = useSportsData();
  return sport ? teams.filter((t) => t.sport === sport) : teams;
}

export function useDrivers(): DbsDriver[] {
  return useSportsData().drivers;
}
