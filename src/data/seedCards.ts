import type { TradingCard } from '@/domain/tradingCard'

const now = () => new Date().toISOString()

/** ESPN headshot helper */
const nba = (id: number) => `https://a.espncdn.com/i/headshots/nba/players/full/${id}.png`
const nfl = (id: number) => `https://a.espncdn.com/i/headshots/nfl/players/full/${id}.png`
const mlb = (id: number) => `https://a.espncdn.com/i/headshots/mlb/players/full/${id}.png`
const soccer = (id: number) => `https://a.espncdn.com/i/headshots/soccer/players/full/${id}.png`

const NBA_CARDS: TradingCard[] = [
  {
    id: 'lebron-james-common', athleteId: 'lebron-james', sport: 'nba', version: 'common',
    name: 'LeBron James', team: 'Los Angeles Lakers', teamColor: '#552582', number: 23, position: 'SF',
    imageUrl: nba(1966),
    stats: [{ label: 'PPG', value: '25.7' }, { label: 'RPG', value: '7.4' }, { label: 'APG', value: '8.3' }],
    createdAt: now(), updatedAt: now(),
  },
  {
    id: 'giannis-antetokounmpo-common', athleteId: 'giannis-antetokounmpo', sport: 'nba', version: 'common',
    name: 'Giannis Antetokounmpo', team: 'Milwaukee Bucks', teamColor: '#00471B', number: 34, position: 'PF',
    imageUrl: nba(3032977),
    stats: [{ label: 'PPG', value: '30.1' }, { label: 'RPG', value: '11.8' }, { label: 'APG', value: '5.8' }],
    createdAt: now(), updatedAt: now(),
  },
]

const NFL_CARDS: TradingCard[] = [
  {
    id: 'patrick-mahomes-common', athleteId: 'patrick-mahomes', sport: 'nfl', version: 'common',
    name: 'Patrick Mahomes', team: 'Kansas City Chiefs', teamColor: '#E31837', number: 15, position: 'QB',
    imageUrl: nfl(3139477),
    stats: [{ label: 'Pass Yds', value: '5250' }, { label: 'TD', value: '41' }, { label: 'INT', value: '12' }],
    createdAt: now(), updatedAt: now(),
  },
  {
    id: 'jalen-hurts-common', athleteId: 'jalen-hurts', sport: 'nfl', version: 'common',
    name: 'Jalen Hurts', team: 'Philadelphia Eagles', teamColor: '#004C54', number: 1, position: 'QB',
    imageUrl: nfl(4040715),
    stats: [{ label: 'Pass Yds', value: '3803' }, { label: 'Pass TD', value: '22' }, { label: 'Rush TD', value: '13' }],
    createdAt: now(), updatedAt: now(),
  },
]

const MLB_CARDS: TradingCard[] = [
  {
    id: 'aaron-judge-common', athleteId: 'aaron-judge', sport: 'mlb', version: 'common',
    name: 'Aaron Judge', team: 'New York Yankees', teamColor: '#0C2340', number: 99, position: 'RF',
    imageUrl: mlb(33192),
    stats: [{ label: 'HR', value: '62' }, { label: 'RBI', value: '131' }, { label: 'AVG', value: '.311' }],
    createdAt: now(), updatedAt: now(),
  },
  {
    id: 'mookie-betts-common', athleteId: 'mookie-betts', sport: 'mlb', version: 'common',
    name: 'Mookie Betts', team: 'Los Angeles Dodgers', teamColor: '#005A9C', number: 50, position: 'RF',
    imageUrl: mlb(33039),
    stats: [{ label: 'HR', value: '35' }, { label: 'RBI', value: '105' }, { label: 'SB', value: '16' }],
    createdAt: now(), updatedAt: now(),
  },
  {
    id: 'bryce-harper-common', athleteId: 'bryce-harper', sport: 'mlb', version: 'common',
    name: 'Bryce Harper', team: 'Philadelphia Phillies', teamColor: '#E81828', number: 3, position: '1B',
    imageUrl: mlb(30951),
    stats: [{ label: 'HR', value: '30' }, { label: 'RBI', value: '88' }, { label: 'AVG', value: '.285' }],
    createdAt: now(), updatedAt: now(),
  },
  {
    id: 'shohei-ohtani-common', athleteId: 'shohei-ohtani', sport: 'mlb', version: 'common',
    name: 'Shohei Ohtani', team: 'Los Angeles Dodgers', teamColor: '#005A9C', number: 17, position: 'DH/P',
    imageUrl: mlb(39832),
    stats: [{ label: 'HR', value: '54' }, { label: 'RBI', value: '130' }, { label: 'AVG', value: '.310' }],
    createdAt: now(), updatedAt: now(),
  },
]

const SOCCER_CARDS: TradingCard[] = [
  {
    id: 'cristiano-ronaldo-common', athleteId: 'cristiano-ronaldo', sport: 'soccer', version: 'common',
    name: 'Cristiano Ronaldo', team: 'Al Nassr', teamColor: '#FFC72C', number: 7, position: 'FW',
    imageUrl: soccer(22774),
    stats: [{ label: 'Goals', value: '890' }, { label: 'Assists', value: '265' }, { label: 'Apps', value: '1147' }],
    createdAt: now(), updatedAt: now(),
  },
  {
    id: 'lionel-messi-common', athleteId: 'lionel-messi', sport: 'soccer', version: 'common',
    name: 'Lionel Messi', team: 'Inter Miami', teamColor: '#F7B5CD', number: 10, position: 'FW',
    imageUrl: soccer(45843),
    stats: [{ label: 'Goals', value: '850' }, { label: 'Assists', value: '380' }, { label: 'Apps', value: '1100' }],
    createdAt: now(), updatedAt: now(),
  },
]

export const SEED_TRADING_CARDS: TradingCard[] = [
  ...NBA_CARDS,
  ...NFL_CARDS,
  ...MLB_CARDS,
  ...SOCCER_CARDS,
]
