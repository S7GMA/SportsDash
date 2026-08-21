export type SportKey = 'f1' | 'nfl' | 'nba' | 'mlb' | 'soccer';

export interface SocialLink {
  label: string;
  handle: string;
  href: string;
}

export interface DbsTeam {
  id: string;
  sport: SportKey;
  name: string;
  abbr: string;
  city?: string;
  logo: string;
  color: string;
  altColor: string;
  x?: string;
}

export interface CareerRecord {
  races: number;
  wins: number;
  podiums: number;
  poles: number;
  points: number;
  dnfs: number;
  championships: number;
  seasons: number;
}

export interface DbsDriver {
  id: string;
  name: string;
  code: string;
  number: number;
  teamId: string;
  teamName: string;
  nationality?: string;
  headshot: string;
  teamColor: string;
  dob?: string;
  wiki?: string;
  season: {
    position: number;
    points: number;
    wins: number;
  };
}

export interface DbsEvent {
  id: string;
  sport: SportKey;
  name: string;
  status: string;
  state: 'pre' | 'in' | 'post';
  start: string;
  venue?: string;
  detail?: string;
  home?: { id: string; name: string; abbr: string; logo?: string; score?: string };
  away?: { id: string; name: string; abbr: string; logo?: string; score?: string };
}

export interface DbsNews {
  id: string;
  sport: SportKey;
  headline: string;
  description?: string;
  image?: string;
  published?: string;
  href?: string;
}

export interface StandingRow {
  position: number;
  id: string;
  name: string;
  logo?: string;
  played?: number;
  wins?: number;
  losses?: number;
  draws?: number;
  points?: number;
}

export interface SeasonGate {
  sport: SportKey;
  inSeason: boolean;
  phase: string;
  resumesAt?: string;
  resumesLabel: string;
}

export interface DbsCatalog {
  loading: boolean;
  error?: string;
  gates: Record<SportKey, SeasonGate>;
  teams: DbsTeam[];
  drivers: DbsDriver[];
  events: DbsEvent[];
  news: DbsNews[];
  standings: Record<string, StandingRow[]>;
  constructors: StandingRow[];
}
