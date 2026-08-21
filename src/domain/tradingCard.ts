import type { DbsDriver } from '@/domain/dbs';
import { hqHeadshot } from '@/api/catalog';

export type Sport = 'f1' | 'nba' | 'nfl' | 'mlb' | 'soccer';
export type CardVersion = 'common' | 'holographic' | 'special';
export type SpecialCardType = 'custom-art' | 'highlight' | 'animated';

export interface CardStat {
  label: string;
  value: string | number;
}

export interface TradingCard {
  id: string;
  athleteId: string;
  sport: Sport;
  version: CardVersion;
  name: string;
  team?: string;
  teamColor: string;
  teamLogo?: string;
  number?: number | string;
  position?: string;
  imageUrl?: string;
  stats: CardStat[];
  specialType?: SpecialCardType;
  customArtUrl?: string;
  highlightVideoUrl?: string;
  animatedArtUrl?: string;
  animationCss?: string;
  backText?: string;
  createdAt: string;
  updatedAt: string;
}

export function createF1DriverCard(
  driver: DbsDriver,
  version: CardVersion = 'common',
): TradingCard {
  const now = new Date().toISOString();
  return {
    id: `${driver.id}-${version}`,
    athleteId: driver.id,
    sport: 'f1',
    version,
    name: driver.name,
    team: driver.teamName,
    teamColor: driver.teamColor || '#16382c',
    number: driver.number,
    imageUrl: hqHeadshot(driver.headshot) || driver.headshot,
    stats: [
      { label: 'Position', value: driver.season.position },
      { label: 'Points', value: driver.season.points },
      { label: 'Wins', value: driver.season.wins },
    ],
    createdAt: now,
    updatedAt: now,
  };
}
