/**
 * Seed Trading Cards Data
 * 
 * Example data for development/demo of the multi-sport trading card system.
 * 
 * This is NOT production data. Replace with real API when available.
 * Contains cards for:
 * - F1 drivers (common + holographic variants)
 * - NBA players (common only initially)
 * - NFL players (common only initially)
 * - MLB players (common only initially)
 * - Soccer players (common only initially)
 * 
 * TODO: Remove this when real data API is implemented
 */

import type { TradingCard } from '@/domain/tradingCard'

/**
 * F1 Driver Cards
 */
const F1_CARDS: TradingCard[] = [
  // Max Verstappen - Common
  {
    id: 'max-verstappen-common',
    athleteId: 'max-verstappen',
    sport: 'f1',
    version: 'common',
    name: 'Max Verstappen',
    team: 'Red Bull Racing',
    teamColor: '#0600EF',
    teamLogo: undefined,
    number: 1,
    imageUrl: 'https://www.formula1.com/content/dam/fom-website/drivers/2024/max-verstappen.jpg.transform/9column/image.jpg',
    stats: [
      { label: 'Position', value: '1' },
      { label: 'Points', value: '403' },
      { label: 'Wins', value: '15' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Max Verstappen - Holographic
  {
    id: 'max-verstappen-holographic',
    athleteId: 'max-verstappen',
    sport: 'f1',
    version: 'holographic',
    name: 'Max Verstappen',
    team: 'Red Bull Racing',
    teamColor: '#0600EF',
    teamLogo: undefined,
    number: 1,
    imageUrl: 'https://www.formula1.com/content/dam/fom-website/drivers/2024/max-verstappen.jpg.transform/9column/image.jpg',
    stats: [
      { label: 'Position', value: '1' },
      { label: 'Points', value: '403' },
      { label: 'Wins', value: '15' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Lando Norris - Common
  {
    id: 'lando-norris-common',
    athleteId: 'lando-norris',
    sport: 'f1',
    version: 'common',
    name: 'Lando Norris',
    team: 'McLaren',
    teamColor: '#FF8700',
    teamLogo: undefined,
    number: 4,
    imageUrl: 'https://www.formula1.com/content/dam/fom-website/drivers/2024/lando-norris.jpg.transform/9column/image.jpg',
    stats: [
      { label: 'Position', value: '2' },
      { label: 'Points', value: '375' },
      { label: 'Wins', value: '3' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Charles Leclerc - Special (Custom Art)
  {
    id: 'charles-leclerc-special',
    athleteId: 'charles-leclerc',
    sport: 'f1',
    version: 'special',
    specialType: 'custom-art',
    name: 'Charles Leclerc',
    team: 'Ferrari',
    teamColor: '#DC0000',
    teamLogo: undefined,
    number: 16,
    imageUrl: 'https://www.formula1.com/content/dam/fom-website/drivers/2024/charles-leclerc.jpg.transform/9column/image.jpg',
    customArtUrl: 'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=400',
    stats: [
      { label: 'Position', value: '3' },
      { label: 'Points', value: '340' },
      { label: 'Wins', value: '5' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

/**
 * NBA Player Cards
 */
const NBA_CARDS: TradingCard[] = [
  // LeBron James - Common
  {
    id: 'lebron-james-common',
    athleteId: 'lebron-james',
    sport: 'nba',
    version: 'common',
    name: 'LeBron James',
    team: 'Los Angeles Lakers',
    teamColor: '#552582',
    number: 23,
    position: 'SF',
    imageUrl: 'https://a.espncdn.com/media/motion/2022/0614/dm_220614_nba_lebron_profile.jpg',
    stats: [
      { label: 'PPG', value: '25.7' },
      { label: 'RPG', value: '7.4' },
      { label: 'APG', value: '8.3' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // LeBron James - Holographic
  {
    id: 'lebron-james-holographic',
    athleteId: 'lebron-james',
    sport: 'nba',
    version: 'holographic',
    name: 'LeBron James',
    team: 'Los Angeles Lakers',
    teamColor: '#552582',
    number: 23,
    position: 'SF',
    imageUrl: 'https://a.espncdn.com/media/motion/2022/0614/dm_220614_nba_lebron_profile.jpg',
    stats: [
      { label: 'PPG', value: '25.7' },
      { label: 'RPG', value: '7.4' },
      { label: 'APG', value: '8.3' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Giannis Antetokounmpo - Common
  {
    id: 'giannis-antetokounmpo-common',
    athleteId: 'giannis-antetokounmpo',
    sport: 'nba',
    version: 'common',
    name: 'Giannis Antetokounmpo',
    team: 'Milwaukee Bucks',
    teamColor: '#12193B',
    number: 34,
    position: 'PF',
    imageUrl: 'https://a.espncdn.com/media/motion/2023/0609/dm_230609_nba_giannis_profile.jpg',
    stats: [
      { label: 'PPG', value: '30.1' },
      { label: 'RPG', value: '11.8' },
      { label: 'APG', value: '5.8' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

/**
 * NFL Player Cards
 */
const NFL_CARDS: TradingCard[] = [
  // Patrick Mahomes - Common
  {
    id: 'patrick-mahomes-common',
    athleteId: 'patrick-mahomes',
    sport: 'nfl',
    version: 'common',
    name: 'Patrick Mahomes',
    team: 'Kansas City Chiefs',
    teamColor: '#E31828',
    number: 15,
    position: 'QB',
    imageUrl: 'https://a.espncdn.com/media/motion/2022/1214/dm_221214_nfl_mahomes_profile.jpg',
    stats: [
      { label: 'Pass Yards', value: '5,250' },
      { label: 'Touchdowns', value: '41' },
      { label: 'Interceptions', value: '12' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Jalen Hurts - Holographic
  {
    id: 'jalen-hurts-holographic',
    athleteId: 'jalen-hurts',
    sport: 'nfl',
    version: 'holographic',
    name: 'Jalen Hurts',
    team: 'Philadelphia Eagles',
    teamColor: '#004687',
    number: 1,
    position: 'QB',
    imageUrl: 'https://a.espncdn.com/media/motion/2023/0113/dm_230113_nfl_hurts_profile.jpg',
    stats: [
      { label: 'Pass Yards', value: '3,803' },
      { label: 'Touchdowns', value: '22' },
      { label: 'Rushing TD', value: '13' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

/**
 * MLB Player Cards
 */
const MLB_CARDS: TradingCard[] = [
  // Aaron Judge - Common
  {
    id: 'aaron-judge-common',
    athleteId: 'aaron-judge',
    sport: 'mlb',
    version: 'common',
    name: 'Aaron Judge',
    team: 'New York Yankees',
    teamColor: '#0C2C56',
    number: 99,
    position: 'RF',
    imageUrl: 'https://a.espncdn.com/media/motion/2023/0313/dm_230313_mlb_judge_profile.jpg',
    stats: [
      { label: 'Home Runs', value: '62' },
      { label: 'RBIs', value: '131' },
      { label: 'Batting Avg', value: '.311' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Mookie Betts - Holographic
  {
    id: 'mookie-betts-holographic',
    athleteId: 'mookie-betts',
    sport: 'mlb',
    version: 'holographic',
    name: 'Mookie Betts',
    team: 'Los Angeles Dodgers',
    teamColor: '#005A9C',
    number: 50,
    position: 'RF',
    imageUrl: 'https://a.espncdn.com/media/motion/2023/0410/dm_230410_mlb_betts_profile.jpg',
    stats: [
      { label: 'Home Runs', value: '35' },
      { label: 'RBIs', value: '105' },
      { label: 'Stolen Bases', value: '16' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

/**
 * Soccer Player Cards
 */
const SOCCER_CARDS: TradingCard[] = [
  // Cristiano Ronaldo - Common
  {
    id: 'cristiano-ronaldo-common',
    athleteId: 'cristiano-ronaldo',
    sport: 'soccer',
    version: 'common',
    name: 'Cristiano Ronaldo',
    team: 'Al Nassr',
    teamColor: '#FFC72C',
    number: 7,
    position: 'FW',
    imageUrl: 'https://img.resfu.com/img/content/2023/01/10/cr7_2023_w640.jpg',
    stats: [
      { label: 'Goals', value: '890' },
      { label: 'Assists', value: '265' },
      { label: 'Appearances', value: '1147' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Lionel Messi - Holographic
  {
    id: 'lionel-messi-holographic',
    athleteId: 'lionel-messi',
    sport: 'soccer',
    version: 'holographic',
    name: 'Lionel Messi',
    team: 'Inter Miami',
    teamColor: '#000000',
    number: 10,
    position: 'FW',
    imageUrl: 'https://img.resfu.com/img/content/2023/06/08/messi_inter_miami_w640.jpg',
    stats: [
      { label: 'Goals', value: '807' },
      { label: 'Assists', value: '324' },
      { label: 'Appearances', value: '1003' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Kylian Mbappé - Holographic
  {
    id: 'kylian-mbappe-holographic',
    athleteId: 'kylian-mbappe',
    sport: 'soccer',
    version: 'holographic',
    name: 'Kylian Mbappé',
    team: 'Paris Saint-Germain',
    teamColor: '#004494',
    number: 7,
    position: 'FW',
    imageUrl: 'https://img.resfu.com/img/content/2023/08/10/mbappe_psg_w640.jpg',
    stats: [
      { label: 'Goals', value: '379' },
      { label: 'Assists', value: '132' },
      { label: 'Appearances', value: '547' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

/**
 * Combined seed data - all cards for development
 */
export const SEED_TRADING_CARDS: TradingCard[] = [
  ...F1_CARDS,
  ...NBA_CARDS,
  ...NFL_CARDS,
  ...MLB_CARDS,
  ...SOCCER_CARDS,
]

/**
 * Seed data by sport (for reference)
 */
export const SEED_CARDS_BY_SPORT = {
  f1: F1_CARDS,
  nba: NBA_CARDS,
  nfl: NFL_CARDS,
  mlb: MLB_CARDS,
  soccer: SOCCER_CARDS,
}
