import type { SocialLink, SportKey } from '@/domain/dbs';

export const LEAGUE_SOCIALS: Record<SportKey, SocialLink[]> = {
  nba: [
    { label: 'NBA', handle: '@NBA', href: 'https://x.com/NBA' },
    { label: 'NBA on TNT', handle: '@NBAonTNT', href: 'https://x.com/NBAonTNT' },
  ],
  nfl: [
    { label: 'NFL', handle: '@NFL', href: 'https://x.com/NFL' },
    { label: 'NFL Network', handle: '@nflnetwork', href: 'https://x.com/nflnetwork' },
  ],
  soccer: [
    { label: 'FIFA', handle: '@FIFAcom', href: 'https://x.com/FIFAcom' },
    { label: 'Premier League', handle: '@premierleague', href: 'https://x.com/premierleague' },
  ],
  f1: [
    { label: 'Formula 1', handle: '@F1', href: 'https://x.com/F1' },
    { label: 'FIA', handle: '@FIA', href: 'https://x.com/FIA' },
  ],
  mlb: [{ label: 'MLB', handle: '@MLB', href: 'https://x.com/MLB' }],
};

export const F1_TEAM_X: Record<string, string> = {
  mercedes: 'https://x.com/MercedesAMGF1',
  ferrari: 'https://x.com/ScuderiaFerrari',
  mclaren: 'https://x.com/McLarenF1',
  red_bull: 'https://x.com/redbullracing',
  williams: 'https://x.com/WilliamsRacing',
  aston_martin: 'https://x.com/AstonMartinF1',
  alpine: 'https://x.com/AlpineF1Team',
  haas: 'https://x.com/HaasF1Team',
  rb: 'https://x.com/RacingBulls',
  audi: 'https://x.com/Audi',
  cadillac: 'https://x.com/Cadillac',
};

export const F1_TEAM_LOGOS: Record<string, string> = {
  mercedes:
    'https://media.formula1.com/image/upload/c_lfill,w_320/q_auto/content/dam/fom-website/2018-redesign-assets/team%20logos/mercedes',
  ferrari:
    'https://media.formula1.com/image/upload/c_lfill,w_320/q_auto/content/dam/fom-website/2018-redesign-assets/team%20logos/ferrari',
  mclaren:
    'https://media.formula1.com/image/upload/c_lfill,w_320/q_auto/content/dam/fom-website/2018-redesign-assets/team%20logos/mclaren',
  red_bull:
    'https://media.formula1.com/image/upload/c_lfill,w_320/q_auto/content/dam/fom-website/2018-redesign-assets/team%20logos/red%20bull',
  williams:
    'https://media.formula1.com/image/upload/c_lfill,w_320/q_auto/content/dam/fom-website/2018-redesign-assets/team%20logos/williams',
  aston_martin:
    'https://media.formula1.com/image/upload/c_lfill,w_320/q_auto/content/dam/fom-website/2018-redesign-assets/team%20logos/aston%20martin',
  alpine:
    'https://media.formula1.com/image/upload/c_lfill,w_320/q_auto/content/dam/fom-website/2018-redesign-assets/team%20logos/alpine',
  haas:
    'https://media.formula1.com/image/upload/c_lfill,w_320/q_auto/content/dam/fom-website/2018-redesign-assets/team%20logos/haas',
  rb: 'https://media.formula1.com/image/upload/c_lfill,w_320/q_auto/content/dam/fom-website/2018-redesign-assets/team%20logos/racing%20bulls',
  audi: 'https://cdn.worldvectorlogo.com/logos/audi-2.svg',
  cadillac: 'https://cdn.worldvectorlogo.com/logos/cadillac-1.svg',
};

/** Confirmed world titles through the end of 2025. 2026 titles come from live standings if the season is complete. */
export const CAREER_CHAMPIONSHIPS: Record<string, number> = {
  hamilton: 7,
  max_verstappen: 4,
  alonso: 2,
  norris: 1,
};
