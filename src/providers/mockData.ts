import { SportEvent, Sport, League, Team, Player, Driver, Standings, F1Session } from '@/domain/types';

// ============================================================================
// MOCK DATA - Realistic fixtures for F1, NFL, NBA, MLB, Soccer
// All times in ISO 8601 UTC. No fake "live" - these are static snapshots.
// ============================================================================

const now = new Date();
const minutesFromNow = (m: number) => new Date(now.getTime() + m * 60000).toISOString();
const minutesAgo = (m: number) => new Date(now.getTime() - m * 60000).toISOString();
const hoursFromNow = (h: number) => new Date(now.getTime() + h * 3600000).toISOString();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000).toISOString();
const daysFromNow = (d: number) => new Date(now.getTime() + d * 86400000).toISOString();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();

// ─── SPORTS ───
export const SPORTS: Sport[] = [
  {
    id: 'f1',
    name: 'Formula 1',
    type: 'f1',
    icon: '🏎️',
    seasonFormat: 'calendar',
    hasStandings: true,
    hasPlayers: false,
    hasDrivers: true,
    hasTeams: true,
    color: '#e10600',
  },
  {
    id: 'nfl',
    name: 'NFL',
    type: 'nfl',
    icon: '🏈',
    seasonFormat: 'split',
    hasStandings: true,
    hasPlayers: true,
    hasDrivers: false,
    hasTeams: true,
    color: '#013369',
  },
  {
    id: 'nba',
    name: 'NBA',
    type: 'nba',
    icon: '🏀',
    seasonFormat: 'single',
    hasStandings: true,
    hasPlayers: true,
    hasDrivers: false,
    hasTeams: true,
    color: '#1d428a',
  },
  {
    id: 'mlb',
    name: 'MLB',
    type: 'mlb',
    icon: '⚾',
    seasonFormat: 'single',
    hasStandings: true,
    hasPlayers: true,
    hasDrivers: false,
    hasTeams: true,
    color: '#041e42',
  },
  {
    id: 'soccer',
    name: 'Soccer',
    type: 'soccer',
    icon: '⚽',
    seasonFormat: 'single',
    hasStandings: true,
    hasPlayers: true,
    hasDrivers: false,
    hasTeams: true,
    color: '#00a650',
  },
];

// ─── LEAGUES ───
export const LEAGUES: League[] = [
  {
    id: 'f1-2025',
    name: 'Formula 1 World Championship',
    sportId: 'f1',
    season: '2025',
    competitionType: 'championship',
  },
  {
    id: 'nfl-2025',
    name: 'National Football League',
    sportId: 'nfl',
    country: 'USA',
    season: '2025',
    competitionType: 'league',
  },
  {
    id: 'nba-2025',
    name: 'National Basketball Association',
    sportId: 'nba',
    country: 'USA',
    season: '2025-26',
    competitionType: 'league',
  },
  {
    id: 'mlb-2025',
    name: 'Major League Baseball',
    sportId: 'mlb',
    country: 'USA',
    season: '2025',
    competitionType: 'league',
  },
  {
    id: 'epl-2025',
    name: 'Premier League',
    sportId: 'soccer',
    country: 'England',
    season: '2025-26',
    competitionType: 'league',
  },
  {
    id: 'laliga-2025',
    name: 'La Liga',
    sportId: 'soccer',
    country: 'Spain',
    season: '2025-26',
    competitionType: 'league',
  },
  {
    id: 'mls-2025',
    name: 'Major League Soccer',
    sportId: 'soccer',
    country: 'USA',
    season: '2025',
    competitionType: 'league',
  },
];

// ─── TEAMS ───
export const TEAMS: Team[] = [
  // F1 Constructors
  { id: 'ferrari', name: 'Scuderia Ferrari', shortName: 'FER', abbreviation: 'FER', leagueId: 'f1-2025', sportId: 'f1', colors: { primary: '#dc0000', secondary: '#000000' }, venue: { name: 'Maranello', city: 'Maranello', country: 'Italy', timezone: 'Europe/Rome' } },
  { id: 'mercedes', name: 'Mercedes-AMG Petronas', shortName: 'MER', abbreviation: 'MER', leagueId: 'f1-2025', sportId: 'f1', colors: { primary: '#00d2be', secondary: '#000000' }, venue: { name: 'Brackley', city: 'Brackley', country: 'UK', timezone: 'Europe/London' } },
  { id: 'redbull', name: 'Oracle Red Bull Racing', shortName: 'RBR', abbreviation: 'RBR', leagueId: 'f1-2025', sportId: 'f1', colors: { primary: '#0600ef', secondary: '#000000' }, venue: { name: 'Milton Keynes', city: 'Milton Keynes', country: 'UK', timezone: 'Europe/London' } },
  { id: 'mclaren', name: 'McLaren F1 Team', shortName: 'MCL', abbreviation: 'MCL', leagueId: 'f1-2025', sportId: 'f1', colors: { primary: '#ff8000', secondary: '#000000' }, venue: { name: 'Woking', city: 'Woking', country: 'UK', timezone: 'Europe/London' } },
  { id: 'williams', name: 'Williams Racing', shortName: 'WIL', abbreviation: 'WIL', leagueId: 'f1-2025', sportId: 'f1', colors: { primary: '#00a0de', secondary: '#000000' }, venue: { name: 'Grove', city: 'Grove', country: 'UK', timezone: 'Europe/London' } },

  // NFL
  { id: 'nfl-kc', name: 'Kansas City Chiefs', shortName: 'Chiefs', abbreviation: 'KC', leagueId: 'nfl-2025', sportId: 'nfl', city: 'Kansas City', colors: { primary: '#e31837', secondary: '#ffb81c' }, venue: { name: 'Arrowhead Stadium', city: 'Kansas City', country: 'USA', timezone: 'America/Chicago' } },
  { id: 'nfl-sf', name: 'San Francisco 49ers', shortName: '49ers', abbreviation: 'SF', leagueId: 'nfl-2025', sportId: 'nfl', city: 'San Francisco', colors: { primary: '#aa0000', secondary: '#b3995d' }, venue: { name: 'Levi\'s Stadium', city: 'Santa Clara', country: 'USA', timezone: 'America/Los_Angeles' } },
  { id: 'nfl-dal', name: 'Dallas Cowboys', shortName: 'Cowboys', abbreviation: 'DAL', leagueId: 'nfl-2025', sportId: 'nfl', city: 'Dallas', colors: { primary: '#003594', secondary: '#869397' }, venue: { name: 'AT&T Stadium', city: 'Arlington', country: 'USA', timezone: 'America/Chicago' } },
  { id: 'nfl-buf', name: 'Buffalo Bills', shortName: 'Bills', abbreviation: 'BUF', leagueId: 'nfl-2025', sportId: 'nfl', city: 'Buffalo', colors: { primary: '#00338d', secondary: '#c60c30' }, venue: { name: 'Highmark Stadium', city: 'Orchard Park', country: 'USA', timezone: 'America/New_York' } },

  // NBA
  { id: 'nba-lal', name: 'Los Angeles Lakers', shortName: 'Lakers', abbreviation: 'LAL', leagueId: 'nba-2025', sportId: 'nba', city: 'Los Angeles', colors: { primary: '#552583', secondary: '#fdb927' }, venue: { name: 'Crypto.com Arena', city: 'Los Angeles', country: 'USA', timezone: 'America/Los_Angeles' } },
  { id: 'nba-bos', name: 'Boston Celtics', shortName: 'Celtics', abbreviation: 'BOS', leagueId: 'nba-2025', sportId: 'nba', city: 'Boston', colors: { primary: '#007a33', secondary: '#ba9653' }, venue: { name: 'TD Garden', city: 'Boston', country: 'USA', timezone: 'America/New_York' } },
  { id: 'nba-gsw', name: 'Golden State Warriors', shortName: 'Warriors', abbreviation: 'GSW', leagueId: 'nba-2025', sportId: 'nba', city: 'San Francisco', colors: { primary: '#1d428a', secondary: '#ffc72c' }, venue: { name: 'Chase Center', city: 'San Francisco', country: 'USA', timezone: 'America/Los_Angeles' } },
  { id: 'nba-mia', name: 'Miami Heat', shortName: 'Heat', abbreviation: 'MIA', leagueId: 'nba-2025', sportId: 'nba', city: 'Miami', colors: { primary: '#98002e', secondary: '#f9a01b' }, venue: { name: 'Kaseya Center', city: 'Miami', country: 'USA', timezone: 'America/New_York' } },

  // MLB
  { id: 'mlb-nyy', name: 'New York Yankees', shortName: 'Yankees', abbreviation: 'NYY', leagueId: 'mlb-2025', sportId: 'mlb', city: 'New York', colors: { primary: '#0c2340', secondary: '#c4ced4' }, venue: { name: 'Yankee Stadium', city: 'New York', country: 'USA', timezone: 'America/New_York' } },
  { id: 'mlb-lad', name: 'Los Angeles Dodgers', shortName: 'Dodgers', abbreviation: 'LAD', leagueId: 'mlb-2025', sportId: 'mlb', city: 'Los Angeles', colors: { primary: '#005a9c', secondary: '#ef3e42' }, venue: { name: 'Dodger Stadium', city: 'Los Angeles', country: 'USA', timezone: 'America/Los_Angeles' } },
  { id: 'mlb-bos', name: 'Boston Red Sox', shortName: 'Red Sox', abbreviation: 'BOS', leagueId: 'mlb-2025', sportId: 'mlb', city: 'Boston', colors: { primary: '#bd3039', secondary: '#0c2340' }, venue: { name: 'Fenway Park', city: 'Boston', country: 'USA', timezone: 'America/New_York' } },

  // Soccer - EPL
  { id: 'epl-ars', name: 'Arsenal', shortName: 'Arsenal', abbreviation: 'ARS', leagueId: 'epl-2025', sportId: 'soccer', city: 'London', colors: { primary: '#ef0107', secondary: '#063672' }, venue: { name: 'Emirates Stadium', city: 'London', country: 'England', timezone: 'Europe/London' } },
  { id: 'epl-mci', name: 'Manchester City', shortName: 'Man City', abbreviation: 'MCI', leagueId: 'epl-2025', sportId: 'soccer', city: 'Manchester', colors: { primary: '#6cabdd', secondary: '#1c2a5e' }, venue: { name: 'Etihad Stadium', city: 'Manchester', country: 'England', timezone: 'Europe/London' } },
  { id: 'epl-liv', name: 'Liverpool', shortName: 'Liverpool', abbreviation: 'LIV', leagueId: 'epl-2025', sportId: 'soccer', city: 'Liverpool', colors: { primary: '#c8102e', secondary: '#00b2a9' }, venue: { name: 'Anfield', city: 'Liverpool', country: 'England', timezone: 'Europe/London' } },
  { id: 'epl-che', name: 'Chelsea', shortName: 'Chelsea', abbreviation: 'CHE', leagueId: 'epl-2025', sportId: 'soccer', city: 'London', colors: { primary: '#034694', secondary: '#dba111' }, venue: { name: 'Stamford Bridge', city: 'London', country: 'England', timezone: 'Europe/London' } },

  // Soccer - La Liga
  { id: 'liga-rma', name: 'Real Madrid', shortName: 'Real Madrid', abbreviation: 'RMA', leagueId: 'laliga-2025', sportId: 'soccer', city: 'Madrid', colors: { primary: '#00529f', secondary: '#febd11' }, venue: { name: 'Santiago Bernabéu', city: 'Madrid', country: 'Spain', timezone: 'Europe/Madrid' } },
  { id: 'liga-barca', name: 'FC Barcelona', shortName: 'Barcelona', abbreviation: 'BAR', leagueId: 'laliga-2025', sportId: 'soccer', city: 'Barcelona', colors: { primary: '#a50044', secondary: '#004d98' }, venue: { name: 'Spotify Camp Nou', city: 'Barcelona', country: 'Spain', timezone: 'Europe/Madrid' } },
];

// ─── DRIVERS ───
export const DRIVERS: Driver[] = [
  { id: 'lec', name: 'Charles Leclerc', code: 'LEC', number: 16, teamId: 'ferrari', nationality: 'Monaco', championshipPoints: 245, championshipPosition: 2, stats: { season: '2025', races: 14, wins: 3, podiums: 8, poles: 4, fastestLaps: 3, points: 245, championshipPosition: 2, dnfs: 1 } },
  { id: 'ver', name: 'Max Verstappen', code: 'VER', number: 1, teamId: 'redbull', nationality: 'Netherlands', championshipPoints: 312, championshipPosition: 1, stats: { season: '2025', races: 14, wins: 7, podiums: 10, poles: 6, fastestLaps: 5, points: 312, championshipPosition: 1, dnfs: 0 } },
  { id: 'nor', name: 'Lando Norris', code: 'NOR', number: 4, teamId: 'mclaren', nationality: 'UK', championshipPoints: 289, championshipPosition: 3, stats: { season: '2025', races: 14, wins: 5, podiums: 11, poles: 5, fastestLaps: 4, points: 289, championshipPosition: 3, dnfs: 1 } },
  { id: 'ham', name: 'Lewis Hamilton', code: 'HAM', number: 44, teamId: 'mercedes', nationality: 'UK', championshipPoints: 198, championshipPosition: 4, stats: { season: '2025', races: 14, wins: 2, podiums: 5, poles: 2, fastestLaps: 2, points: 198, championshipPosition: 4, dnfs: 2 } },
  { id: 'rus', name: 'George Russell', code: 'RUS', number: 63, teamId: 'mercedes', nationality: 'UK', championshipPoints: 192, championshipPosition: 5, stats: { season: '2025', races: 14, wins: 1, podiums: 4, poles: 3, fastestLaps: 1, points: 192, championshipPosition: 5, dnfs: 1 } },
  { id: 'sai', name: 'Carlos Sainz', code: 'SAI', number: 55, teamId: 'williams', nationality: 'Spain', championshipPoints: 87, championshipPosition: 12, stats: { season: '2025', races: 14, wins: 0, podiums: 1, poles: 0, fastestLaps: 0, points: 87, championshipPosition: 12, dnfs: 2 } },
  { id: 'pie', name: 'Oscar Piastri', code: 'PIA', number: 81, teamId: 'mclaren', nationality: 'Australia', championshipPoints: 247, championshipPosition: 6, stats: { season: '2025', races: 14, wins: 4, podiums: 7, poles: 3, fastestLaps: 2, points: 247, championshipPosition: 6, dnfs: 1 } },
];

// ─── PLAYERS ───
export const PLAYERS: Player[] = [
  // NFL
  { id: 'nfl-mahomes', name: 'Patrick Mahomes', teamId: 'nfl-kc', leagueId: 'nfl-2025', sportId: 'nfl', position: 'QB', number: 15, nationality: 'USA', stats: { season: '2025', gamesPlayed: 4, passingYards: 1240, passingTD: 11, interceptions: 3, completionPct: 68.5 } },
  { id: 'nfl-kelce', name: 'Travis Kelce', teamId: 'nfl-kc', leagueId: 'nfl-2025', sportId: 'nfl', position: 'TE', number: 87, nationality: 'USA', stats: { season: '2025', gamesPlayed: 4, receptions: 28, receivingYards: 312, receivingTD: 3 } },
  { id: 'nfl-mccaffrey', name: 'Christian McCaffrey', teamId: 'nfl-sf', leagueId: 'nfl-2025', sportId: 'nfl', position: 'RB', number: 23, nationality: 'USA', stats: { season: '2025', gamesPlayed: 4, rushingYards: 412, rushingTD: 5, receptions: 19, receivingYards: 145 } },

  // NBA
  { id: 'nba-lebron', name: 'LeBron James', teamId: 'nba-lal', leagueId: 'nba-2025', sportId: 'nba', position: 'SF', number: 23, nationality: 'USA', stats: { season: '2025-26', gamesPlayed: 6, ppg: 24.8, rpg: 8.2, apg: 9.1, fgPct: 52.1 } },
  { id: 'nba-curry', name: 'Stephen Curry', teamId: 'nba-gsw', leagueId: 'nba-2025', sportId: 'nba', position: 'PG', number: 30, nationality: 'USA', stats: { season: '2025-26', gamesPlayed: 6, ppg: 29.3, rpg: 4.8, apg: 6.2, fgPct: 47.8, threePct: 42.1 } },
  { id: 'nba-tatum', name: 'Jayson Tatum', teamId: 'nba-bos', leagueId: 'nba-2025', sportId: 'nba', position: 'SF', number: 0, nationality: 'USA', stats: { season: '2025-26', gamesPlayed: 6, ppg: 27.9, rpg: 8.6, apg: 5.4, fgPct: 46.3 } },

  // MLB
  { id: 'mlb-judge', name: 'Aaron Judge', teamId: 'mlb-nyy', leagueId: 'mlb-2025', sportId: 'mlb', position: 'RF', number: 99, nationality: 'USA', stats: { season: '2025', gamesPlayed: 110, avg: 0.322, hr: 38, rbi: 92, ops: 1.058 } },
  { id: 'mlb-ohtani', name: 'Shohei Ohtani', teamId: 'mlb-lad', leagueId: 'mlb-2025', sportId: 'mlb', position: 'DH', number: 17, nationality: 'Japan', stats: { season: '2025', gamesPlayed: 108, avg: 0.289, hr: 34, rbi: 78, ops: 0.984 } },
  { id: 'mlb-devers', name: 'Rafael Devers', teamId: 'mlb-bos', leagueId: 'mlb-2025', sportId: 'mlb', position: '3B', number: 11, nationality: 'Dominican Republic', stats: { season: '2025', gamesPlayed: 105, avg: 0.281, hr: 29, rbi: 84, ops: 0.912 } },

  // Soccer
  { id: 'soc-saka', name: 'Bukayo Saka', teamId: 'epl-ars', leagueId: 'epl-2025', sportId: 'soccer', position: 'RW', number: 7, nationality: 'England', stats: { season: '2025-26', gamesPlayed: 7, goals: 5, assists: 4, yellowCards: 1 } },
  { id: 'soc-haaland', name: 'Erling Haaland', teamId: 'epl-mci', leagueId: 'epl-2025', sportId: 'soccer', position: 'ST', number: 9, nationality: 'Norway', stats: { season: '2025-26', gamesPlayed: 7, goals: 9, assists: 2, yellowCards: 0 } },
  { id: 'soc-vini', name: 'Vinícius Júnior', teamId: 'liga-rma', leagueId: 'laliga-2025', sportId: 'soccer', position: 'LW', number: 7, nationality: 'Brazil', stats: { season: '2025-26', gamesPlayed: 6, goals: 6, assists: 3, yellowCards: 2 } },
  { id: 'soc-lewandowski', name: 'Robert Lewandowski', teamId: 'liga-barca', leagueId: 'laliga-2025', sportId: 'soccer', position: 'ST', number: 9, nationality: 'Poland', stats: { season: '2025-26', gamesPlayed: 6, goals: 7, assists: 1, yellowCards: 0 } },
];

// ─── EVENTS ───
export const EVENTS: SportEvent[] = [
  // ─── F1: Japanese GP (Live) ───
  {
    id: 'f1-japan-2025-race',
    sportId: 'f1',
    leagueId: 'f1-2025',
    name: 'Japanese Grand Prix',
    status: 'live',
    startTime: minutesAgo(45),
    eventTimezone: 'Asia/Tokyo',
    venue: { name: 'Suzuka Circuit', city: 'Suzuka', country: 'Japan', timezone: 'Asia/Tokyo' },
    competition: 'Round 14',
    participants: [],
    details: {
      sportType: 'f1',
      circuit: { id: 'suzuka', name: 'Suzuka Circuit', country: 'Japan', city: 'Suzuka', length: 5.807 },
      round: 14,
      currentSession: {
        type: 'race',
        name: 'Race',
        startTime: minutesAgo(45),
        status: 'live',
        lapCount: 53,
        currentLap: 38,
        weather: { condition: 'Clear', temperature: 27, trackTemp: 42 },
        fastestLap: { driverId: 'nor', time: '1:30.456', lap: 32 },
        results: [
          { driverId: 'nor', position: 1, gridPosition: 2, laps: 38, points: 25, status: 'finished' },
          { driverId: 'ver', position: 2, gridPosition: 1, laps: 38, points: 18, status: 'finished' },
          { driverId: 'lec', position: 3, gridPosition: 4, laps: 38, points: 15, status: 'finished', fastestLap: true },
          { driverId: 'ham', position: 4, gridPosition: 5, laps: 38, points: 12, status: 'finished' },
          { driverId: 'rus', position: 5, gridPosition: 3, laps: 38, points: 10, status: 'finished' },
          { driverId: 'pie', position: 6, gridPosition: 6, laps: 38, points: 8, status: 'finished' },
          { driverId: 'sai', position: 14, gridPosition: 12, laps: 36, points: 0, status: 'did_not_finish' },
        ],
      },
      sessions: [
        {
          type: 'practice', name: 'Free Practice 1', startTime: daysAgo(2), status: 'completed',
        },
        {
          type: 'qualifying', name: 'Qualifying', startTime: daysAgo(1), status: 'completed',
          results: [
            { driverId: 'ver', position: 1, gridPosition: 1, status: 'finished' },
            { driverId: 'nor', position: 2, gridPosition: 2, status: 'finished' },
            { driverId: 'rus', position: 3, gridPosition: 3, status: 'finished' },
            { driverId: 'lec', position: 4, gridPosition: 4, status: 'finished' },
          ],
        },
        {
          type: 'race', name: 'Race', startTime: minutesAgo(45), status: 'live',
          lapCount: 53, currentLap: 38,
          weather: { condition: 'Clear', temperature: 27, trackTemp: 42 },
          fastestLap: { driverId: 'nor', time: '1:30.456', lap: 32 },
          results: [
            { driverId: 'nor', position: 1, gridPosition: 2, laps: 38, points: 25, status: 'finished' },
            { driverId: 'ver', position: 2, gridPosition: 1, laps: 38, points: 18, status: 'finished' },
            { driverId: 'lec', position: 3, gridPosition: 4, laps: 38, points: 15, status: 'finished', fastestLap: true },
            { driverId: 'ham', position: 4, gridPosition: 5, laps: 38, points: 12, status: 'finished' },
            { driverId: 'rus', position: 5, gridPosition: 3, laps: 38, points: 10, status: 'finished' },
            { driverId: 'pie', position: 6, gridPosition: 6, laps: 38, points: 8, status: 'finished' },
            { driverId: 'sai', position: 14, gridPosition: 12, laps: 36, points: 0, status: 'did_not_finish' },
          ],
        },
      ],
    },
  },

  // ─── NFL: Chiefs vs 49ers (Live) ───
  {
    id: 'nfl-kc-sf-2025-w4',
    sportId: 'nfl',
    leagueId: 'nfl-2025',
    name: 'Chiefs vs 49ers',
    status: 'live',
    startTime: minutesAgo(22),
    eventTimezone: 'America/Chicago',
    venue: { name: 'Arrowhead Stadium', city: 'Kansas City', country: 'USA', timezone: 'America/Chicago' },
    competition: 'Week 4',
    participants: [
      { id: 'nfl-kc', type: 'team', name: 'Kansas City Chiefs', shortName: 'KC', score: 17, logo: '🏈' },
      { id: 'nfl-sf', type: 'team', name: 'San Francisco 49ers', shortName: 'SF', score: 14, logo: '🏈' },
    ],
    details: {
      sportType: 'nfl',
      currentPeriod: 3,
      clock: '08:42',
      possession: 'nfl-kc',
      periods: [
        { number: 1, type: 'quarter', name: 'Q1', score: { home: 7, away: 0 } },
        { number: 2, type: 'quarter', name: 'Q2', score: { home: 10, away: 7 } },
        { number: 3, type: 'quarter', name: 'Q3', score: { home: 17, away: 14 } },
      ],
      nflSpecific: {
        down: 2,
        distance: 8,
        yardLine: 42,
        possessionTeamId: 'nfl-kc',
        quarterScores: [{ home: 7, away: 0 }, { home: 10, away: 7 }, { home: 17, away: 14 }],
        scoringPlays: [
          { quarter: 1, time: '06:12', teamId: 'nfl-kc', type: 'touchdown', description: 'Mahomes 12yd TD pass to Kelce', homeScore: 7, awayScore: 0 },
          { quarter: 2, time: '11:45', teamId: 'nfl-sf', type: 'field_goal', description: 'Moody 38yd FG', homeScore: 7, awayScore: 3 },
          { quarter: 2, time: '02:18', teamId: 'nfl-kc', type: 'field_goal', description: 'Butker 45yd FG', homeScore: 10, awayScore: 3 },
          { quarter: 3, time: '09:33', teamId: 'nfl-sf', type: 'touchdown', description: 'McCaffrey 4yd TD run', homeScore: 10, awayScore: 10 },
          { quarter: 3, time: '03:21', teamId: 'nfl-kc', type: 'touchdown', description: 'Mahomes 9yd TD run', homeScore: 17, awayScore: 10 },
        ],
      },
    },
  },

  // ─── NBA: Lakers vs Celtics (Live) ───
  {
    id: 'nba-lal-bos-2025-11',
    sportId: 'nba',
    leagueId: 'nba-2025',
    name: 'Lakers vs Celtics',
    status: 'live',
    startTime: minutesAgo(35),
    eventTimezone: 'America/Los_Angeles',
    venue: { name: 'Crypto.com Arena', city: 'Los Angeles', country: 'USA', timezone: 'America/Los_Angeles' },
    competition: 'Regular Season',
    participants: [
      { id: 'nba-lal', type: 'team', name: 'Los Angeles Lakers', shortName: 'LAL', score: 78, logo: '🏀' },
      { id: 'nba-bos', type: 'team', name: 'Boston Celtics', shortName: 'BOS', score: 82, logo: '🏀' },
    ],
    details: {
      sportType: 'nba',
      currentPeriod: 3,
      clock: '04:18',
      periods: [
        { number: 1, type: 'quarter', name: 'Q1', score: { home: 28, away: 31 } },
        { number: 2, type: 'quarter', name: 'Q2', score: { home: 52, away: 55 } },
        { number: 3, type: 'quarter', name: 'Q3', score: { home: 78, away: 82 } },
      ],
      nbaSpecific: {
        quarterScores: [{ home: 28, away: 31 }, { home: 52, away: 55 }, { home: 78, away: 82 }],
        fouls: { home: 12, away: 14 },
        timeouts: { home: 4, away: 3 },
        scoringPlays: [
          { quarter: 1, time: '00:45', teamId: 'nba-bos', type: 'other', description: 'Tatum 3pt', homeScore: 0, awayScore: 3 },
          { quarter: 2, time: '05:12', teamId: 'nba-lal', type: 'other', description: 'LeBron dunk', homeScore: 40, awayScore: 42 },
        ],
        leadChanges: 7,
        biggestLead: { teamId: 'nba-bos', points: 9 },
      },
    },
  },

  // ─── MLB: Yankees vs Red Sox (Live) ───
  {
    id: 'mlb-nyy-bos-2025-0704',
    sportId: 'mlb',
    leagueId: 'mlb-2025',
    name: 'Yankees vs Red Sox',
    status: 'live',
    startTime: minutesAgo(55),
    eventTimezone: 'America/New_York',
    venue: { name: 'Yankee Stadium', city: 'New York', country: 'USA', timezone: 'America/New_York' },
    competition: 'Regular Season',
    participants: [
      { id: 'mlb-nyy', type: 'team', name: 'New York Yankees', shortName: 'NYY', score: 4, logo: '⚾' },
      { id: 'mlb-bos', type: 'team', name: 'Boston Red Sox', shortName: 'BOS', score: 3, logo: '⚾' },
    ],
    details: {
      sportType: 'mlb',
      currentPeriod: 7,
      periods: [
        { number: 1, type: 'inning', name: 'Top 1', score: { home: 0, away: 0 } },
        { number: 2, type: 'inning', name: 'Bot 1', score: { home: 1, away: 0 } },
        { number: 3, type: 'inning', name: 'Top 2', score: { home: 1, away: 0 } },
        { number: 4, type: 'inning', name: 'Bot 2', score: { home: 1, away: 0 } },
        { number: 5, type: 'inning', name: 'Top 3', score: { home: 1, away: 2 } },
        { number: 6, type: 'inning', name: 'Bot 3', score: { home: 3, away: 2 } },
        { number: 7, type: 'inning', name: 'Top 4', score: { home: 3, away: 2 } },
        { number: 8, type: 'inning', name: 'Bot 4', score: { home: 4, away: 2 } },
        { number: 9, type: 'inning', name: 'Top 5', score: { home: 4, away: 3 } },
        { number: 10, type: 'inning', name: 'Bot 5', score: { home: 4, away: 3 } },
        { number: 11, type: 'inning', name: 'Top 6', score: { home: 4, away: 3 } },
        { number: 12, type: 'inning', name: 'Bot 6', score: { home: 4, away: 3 } },
        { number: 13, type: 'inning', name: 'Top 7', score: { home: 4, away: 3 } },
      ],
      mlbSpecific: {
        inning: 7,
        half: 'top',
        outs: 1,
        bases: { first: true, second: false, third: false },
        pitcher: 'Crochet',
        batter: 'Judge',
        count: { balls: 2, strikes: 1 },
        lineScore: { home: [1, 0, 2, 1, 0, 0, 0, 0, 0], away: [0, 0, 2, 0, 1, 0, 0, 0, 0] },
      },
    },
  },

  // ─── Soccer EPL: Arsenal vs Chelsea (Live) ───
  {
    id: 'epl-ars-che-2025-07',
    sportId: 'soccer',
    leagueId: 'epl-2025',
    name: 'Arsenal vs Chelsea',
    status: 'live',
    startTime: minutesAgo(38),
    eventTimezone: 'Europe/London',
    venue: { name: 'Emirates Stadium', city: 'London', country: 'England', timezone: 'Europe/London' },
    competition: 'Matchday 7',
    participants: [
      { id: 'epl-ars', type: 'team', name: 'Arsenal', shortName: 'ARS', score: 2, logo: '⚽' },
      { id: 'epl-che', type: 'team', name: 'Chelsea', shortName: 'CHE', score: 1, logo: '⚽' },
    ],
    details: {
      sportType: 'soccer',
      currentPeriod: 1,
      clock: '38:00',
      soccerSpecific: {
        minute: 38,
        half: 1,
        goals: [
          { minute: 12, scorerId: 'soc-saka', scorerName: 'Saka', teamId: 'epl-ars', type: 'regular', assist: 'Ødegaard' },
          { minute: 29, scorerId: 'soc-saka', scorerName: 'Saka', teamId: 'epl-ars', type: 'regular', assist: 'Rice' },
          { minute: 34, scorerId: 'epl-che', scorerName: 'Palmer', teamId: 'epl-che', type: 'regular', assist: 'Enzo' },
        ],
        cards: [
          { minute: 22, playerName: 'Caicedo', teamId: 'epl-che', type: 'yellow' },
        ],
        substitutions: [],
      },
    },
  },

  // ─── UPCOMING EVENTS ───
  {
    id: 'f1-china-2025-race',
    sportId: 'f1',
    leagueId: 'f1-2025',
    name: 'Chinese Grand Prix',
    status: 'scheduled',
    startTime: daysFromNow(7),
    eventTimezone: 'Asia/Shanghai',
    venue: { name: 'Shanghai International Circuit', city: 'Shanghai', country: 'China', timezone: 'Asia/Shanghai' },
    competition: 'Round 15',
    participants: [],
    details: {
      sportType: 'f1',
      circuit: { id: 'shanghai', name: 'Shanghai International Circuit', country: 'China', city: 'Shanghai', length: 5.451 },
      round: 15,
      sessions: [
        { type: 'practice', name: 'Free Practice 1', startTime: daysFromNow(7), status: 'scheduled' },
        { type: 'qualifying', name: 'Qualifying', startTime: daysFromNow(7), status: 'scheduled' },
        { type: 'race', name: 'Race', startTime: daysFromNow(7), status: 'scheduled' },
      ],
    },
  },
  {
    id: 'nfl-kc-buf-2025-w5',
    sportId: 'nfl',
    leagueId: 'nfl-2025',
    name: 'Chiefs vs Bills',
    status: 'scheduled',
    startTime: daysFromNow(4),
    eventTimezone: 'America/Chicago',
    venue: { name: 'Arrowhead Stadium', city: 'Kansas City', country: 'USA', timezone: 'America/Chicago' },
    competition: 'Week 5',
    participants: [
      { id: 'nfl-kc', type: 'team', name: 'Kansas City Chiefs', shortName: 'KC', logo: '🏈' },
      { id: 'nfl-buf', type: 'team', name: 'Buffalo Bills', shortName: 'BUF', logo: '🏈' },
    ],
    details: {
      sportType: 'nfl',
      periods: [],
    },
  },
  {
    id: 'nba-gsw-mia-2025-12',
    sportId: 'nba',
    leagueId: 'nba-2025',
    name: 'Warriors vs Heat',
    status: 'scheduled',
    startTime: daysFromNow(2),
    eventTimezone: 'America/Los_Angeles',
    venue: { name: 'Chase Center', city: 'San Francisco', country: 'USA', timezone: 'America/Los_Angeles' },
    competition: 'Regular Season',
    participants: [
      { id: 'nba-gsw', type: 'team', name: 'Golden State Warriors', shortName: 'GSW', logo: '🏀' },
      { id: 'nba-mia', type: 'team', name: 'Miami Heat', shortName: 'MIA', logo: '🏀' },
    ],
    details: {
      sportType: 'nba',
      periods: [],
    },
  },
  {
    id: 'epl-mci-liv-2025-08',
    sportId: 'soccer',
    leagueId: 'epl-2025',
    name: 'Manchester City vs Liverpool',
    status: 'scheduled',
    startTime: hoursFromNow(20),
    eventTimezone: 'Europe/London',
    venue: { name: 'Etihad Stadium', city: 'Manchester', country: 'England', timezone: 'Europe/London' },
    competition: 'Matchday 8',
    participants: [
      { id: 'epl-mci', type: 'team', name: 'Manchester City', shortName: 'MCI', logo: '⚽' },
      { id: 'epl-liv', type: 'team', name: 'Liverpool', shortName: 'LIV', logo: '⚽' },
    ],
    details: {
      sportType: 'soccer',
      soccerSpecific: { minute: 0, half: 1, goals: [], cards: [], substitutions: [] },
    },
  },
  {
    id: 'liga-rma-barca-2025-09',
    sportId: 'soccer',
    leagueId: 'laliga-2025',
    name: 'Real Madrid vs Barcelona',
    status: 'scheduled',
    startTime: daysFromNow(5),
    eventTimezone: 'Europe/Madrid',
    venue: { name: 'Santiago Bernabéu', city: 'Madrid', country: 'Spain', timezone: 'Europe/Madrid' },
    competition: 'Matchday 9',
    participants: [
      { id: 'liga-rma', type: 'team', name: 'Real Madrid', shortName: 'RMA', logo: '⚽' },
      { id: 'liga-barca', type: 'team', name: 'Barcelona', shortName: 'BAR', logo: '⚽' },
    ],
    details: {
      sportType: 'soccer',
      soccerSpecific: { minute: 0, half: 1, goals: [], cards: [], substitutions: [] },
    },
  },

  // ─── COMPLETED EVENTS ───
  {
    id: 'f1-singapore-2025-race',
    sportId: 'f1',
    leagueId: 'f1-2025',
    name: 'Singapore Grand Prix',
    status: 'completed',
    startTime: daysAgo(3),
    eventTimezone: 'Asia/Singapore',
    venue: { name: 'Marina Bay Street Circuit', city: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore' },
    competition: 'Round 13',
    participants: [],
    details: {
      sportType: 'f1',
      circuit: { id: 'marina-bay', name: 'Marina Bay Street Circuit', country: 'Singapore', city: 'Singapore', length: 4.94 },
      round: 13,
      sessions: [
        {
          type: 'race', name: 'Race', startTime: daysAgo(3), status: 'completed',
          lapCount: 62, currentLap: 62,
          results: [
            { driverId: 'ver', position: 1, gridPosition: 1, points: 25, status: 'finished' },
            { driverId: 'nor', position: 2, gridPosition: 3, points: 18, status: 'finished' },
            { driverId: 'lec', position: 3, gridPosition: 4, points: 15, status: 'finished', fastestLap: true },
            { driverId: 'pie', position: 4, gridPosition: 2, points: 12, status: 'finished' },
            { driverId: 'ham', position: 5, gridPosition: 5, points: 10, status: 'finished' },
          ],
        },
      ],
    },
  },
  {
    id: 'nfl-dal-buf-2025-w3',
    sportId: 'nfl',
    leagueId: 'nfl-2025',
    name: 'Cowboys vs Bills',
    status: 'completed',
    startTime: daysAgo(2),
    eventTimezone: 'America/Chicago',
    venue: { name: 'AT&T Stadium', city: 'Arlington', country: 'USA', timezone: 'America/Chicago' },
    competition: 'Week 3',
    participants: [
      { id: 'nfl-dal', type: 'team', name: 'Dallas Cowboys', shortName: 'DAL', score: 28, logo: '🏈' },
      { id: 'nfl-buf', type: 'team', name: 'Buffalo Bills', shortName: 'BUF', score: 35, logo: '🏈' },
    ],
    details: {
      sportType: 'nfl',
      currentPeriod: 4,
      periods: [
        { number: 1, type: 'quarter', name: 'Q1', score: { home: 7, away: 14 } },
        { number: 2, type: 'quarter', name: 'Q2', score: { home: 14, away: 21 } },
        { number: 3, type: 'quarter', name: 'Q3', score: { home: 21, away: 28 } },
        { number: 4, type: 'quarter', name: 'Q4', score: { home: 28, away: 35 } },
      ],
    },
  },
  {
    id: 'nba-lal-gsw-2025-10',
    sportId: 'nba',
    leagueId: 'nba-2025',
    name: 'Lakers vs Warriors',
    status: 'completed',
    startTime: daysAgo(1),
    eventTimezone: 'America/Los_Angeles',
    venue: { name: 'Crypto.com Arena', city: 'Los Angeles', country: 'USA', timezone: 'America/Los_Angeles' },
    competition: 'Regular Season',
    participants: [
      { id: 'nba-lal', type: 'team', name: 'Los Angeles Lakers', shortName: 'LAL', score: 112, logo: '🏀' },
      { id: 'nba-gsw', type: 'team', name: 'Golden State Warriors', shortName: 'GSW', score: 118, logo: '🏀' },
    ],
    details: {
      sportType: 'nba',
      currentPeriod: 4,
      periods: [
        { number: 1, type: 'quarter', name: 'Q1', score: { home: 28, away: 31 } },
        { number: 2, type: 'quarter', name: 'Q2', score: { home: 55, away: 60 } },
        { number: 3, type: 'quarter', name: 'Q3', score: { home: 84, away: 89 } },
        { number: 4, type: 'quarter', name: 'Q4', score: { home: 112, away: 118 } },
      ],
    },
  },
  {
    id: 'epl-liv-che-2025-06',
    sportId: 'soccer',
    leagueId: 'epl-2025',
    name: 'Liverpool vs Chelsea',
    status: 'completed',
    startTime: daysAgo(2),
    eventTimezone: 'Europe/London',
    venue: { name: 'Anfield', city: 'Liverpool', country: 'England', timezone: 'Europe/London' },
    competition: 'Matchday 6',
    participants: [
      { id: 'epl-liv', type: 'team', name: 'Liverpool', shortName: 'LIV', score: 3, logo: '⚽' },
      { id: 'epl-che', type: 'team', name: 'Chelsea', shortName: 'CHE', score: 1, logo: '⚽' },
    ],
    details: {
      sportType: 'soccer',
      soccerSpecific: {
        minute: 90,
        half: 2,
        goals: [
          { minute: 15, scorerId: 'epl-liv', scorerName: 'Salah', teamId: 'epl-liv', type: 'regular' },
          { minute: 42, scorerId: 'epl-che', scorerName: 'Jackson', teamId: 'epl-che', type: 'regular' },
          { minute: 67, scorerId: 'epl-liv', scorerName: 'Núñez', teamId: 'epl-liv', type: 'regular' },
          { minute: 84, scorerName: 'Salah', teamId: 'epl-liv', type: 'penalty' },
        ],
        cards: [],
        substitutions: [],
      },
    },
  },
];

// ─── STANDINGS ───
export const STANDINGS: Record<string, Standings> = {
  'f1-2025': {
    leagueId: 'f1-2025',
    season: '2025',
    type: 'driver',
    updatedAt: daysAgo(3).toString(),
    table: DRIVERS
      .slice()
      .sort((a, b) => (b.championshipPoints ?? 0) - (a.championshipPoints ?? 0))
      .map((d, i) => ({
        position: i + 1,
        participantId: d.id,
        name: d.name,
        played: d.stats?.races ?? 14,
        wins: d.stats?.wins ?? 0,
        losses: 0,
        points: d.championshipPoints ?? 0,
        podiums: d.stats?.podiums,
        poles: d.stats?.poles,
        form: ['W', 'W', 'L', 'W', 'D'] as any,
      })),
  },
  'f1-2025-constructors': {
    leagueId: 'f1-2025',
    season: '2025',
    type: 'team',
    updatedAt: daysAgo(3).toString(),
    table: [
      { position: 1, participantId: 'mclaren', name: 'McLaren', played: 14, wins: 9, losses: 0, points: 536, constructorId: 'mclaren' },
      { position: 2, participantId: 'redbull', name: 'Red Bull', played: 14, wins: 7, losses: 0, points: 498, constructorId: 'redbull' },
      { position: 3, participantId: 'ferrari', name: 'Ferrari', played: 14, wins: 3, losses: 0, points: 442, constructorId: 'ferrari' },
      { position: 4, participantId: 'mercedes', name: 'Mercedes', played: 14, wins: 3, losses: 0, points: 390, constructorId: 'mercedes' },
    ],
  },
  'nfl-2025': {
    leagueId: 'nfl-2025',
    season: '2025',
    type: 'team',
    updatedAt: daysAgo(2).toString(),
    table: [
      { position: 1, participantId: 'nfl-kc', name: 'Kansas City Chiefs', played: 4, wins: 4, losses: 0, points: 0, pointsDifference: 48 },
      { position: 2, participantId: 'nfl-buf', name: 'Buffalo Bills', played: 4, wins: 3, losses: 1, points: 0, pointsDifference: 32 },
      { position: 3, participantId: 'nfl-sf', name: 'San Francisco 49ers', played: 4, wins: 3, losses: 1, points: 0, pointsDifference: 21 },
      { position: 4, participantId: 'nfl-dal', name: 'Dallas Cowboys', played: 4, wins: 2, losses: 2, points: 0, pointsDifference: -8 },
    ],
  },
  'nba-2025': {
    leagueId: 'nba-2025',
    season: '2025-26',
    type: 'team',
    updatedAt: daysAgo(1).toString(),
    table: [
      { position: 1, participantId: 'nba-bos', name: 'Boston Celtics', played: 6, wins: 5, losses: 1, points: 0, pointsDifference: 54 },
      { position: 2, participantId: 'nba-gsw', name: 'Golden State Warriors', played: 6, wins: 4, losses: 2, points: 0, pointsDifference: 38 },
      { position: 3, participantId: 'nba-lal', name: 'Los Angeles Lakers', played: 6, wins: 4, losses: 2, points: 0, pointsDifference: 22 },
      { position: 4, participantId: 'nba-mia', name: 'Miami Heat', played: 6, wins: 3, losses: 3, points: 0, pointsDifference: -12 },
    ],
  },
  'epl-2025': {
    leagueId: 'epl-2025',
    season: '2025-26',
    type: 'team',
    updatedAt: daysAgo(2).toString(),
    table: [
      { position: 1, participantId: 'epl-mci', name: 'Manchester City', played: 7, wins: 6, draws: 1, losses: 0, points: 19, pointsDifference: 14 },
      { position: 2, participantId: 'epl-ars', name: 'Arsenal', played: 7, wins: 5, draws: 2, losses: 0, points: 17, pointsDifference: 11 },
      { position: 3, participantId: 'epl-liv', name: 'Liverpool', played: 7, wins: 5, draws: 1, losses: 1, points: 16, pointsDifference: 9 },
      { position: 4, participantId: 'epl-che', name: 'Chelsea', played: 7, wins: 4, draws: 2, losses: 1, points: 14, pointsDifference: 6 },
    ],
  },
  'laliga-2025': {
    leagueId: 'laliga-2025',
    season: '2025-26',
    type: 'team',
    updatedAt: daysAgo(2).toString(),
    table: [
      { position: 1, participantId: 'liga-rma', name: 'Real Madrid', played: 6, wins: 5, draws: 1, losses: 0, points: 16, pointsDifference: 12 },
      { position: 2, participantId: 'liga-barca', name: 'Barcelona', played: 6, wins: 5, draws: 0, losses: 1, points: 15, pointsDifference: 10 },
    ],
  },
};

// ─── MOCK REAL-TIME SIMULATOR ───
// Clearly labeled as simulation - NOT real live data
let liveSimulatorActive = false;
const SIMULATION_INTERVAL = 5000; // 5 seconds
let simulationTimer: ReturnType<typeof setInterval> | null = null;
const subscribers: ((events: SportEvent[]) => void)[] = [];

export function startLiveSimulation(onEventUpdate: (events: SportEvent[]) => void): () => void {
  if (liveSimulatorActive) {
    return () => stopLiveSimulation();
  }
  liveSimulatorActive = true;
  subscribers.push(onEventUpdate);

  simulationTimer = setInterval(() => {
    // Mutate live events with realistic score changes
    EVENTS.forEach((event) => {
      if (event.status !== 'live') return;

      if (event.sportId === 'nfl' || event.sportId === 'nba') {
        const home = event.participants[0];
        const away = event.participants[1];
        if (Math.random() > 0.7) {
          if (Math.random() > 0.5) {
            home.score = (home.score ?? 0) + (event.sportId === 'nba' ? 2 : 7);
          } else {
            away.score = (away.score ?? 0) + (event.sportId === 'nba' ? 2 : 7);
          }
        }
      }

      if (event.sportId === 'soccer') {
        const soccer = event.details as any;
        if (soccer?.soccerSpecific && Math.random() > 0.8) {
          // Advance match minute
          soccer.soccerSpecific.minute += 1;
        }
      }

      if (event.sportId === 'mlb') {
        const mlb = event.details as any;
        if (mlb?.mlbSpecific && Math.random() > 0.8) {
          // Could advance inning - keep simple for mock
        }
      }

      if (event.sportId === 'f1') {
        const f1 = event.details as any;
        if (f1?.currentSession?.currentLap && f1.currentSession.currentLap < f1.currentSession.lapCount) {
          f1.currentSession.currentLap += 1;
          // Random position changes
          if (Math.random() > 0.9 && f1.currentSession.results?.length >= 2) {
            const r = f1.currentSession.results;
            const a = r[0].position;
            const b = r[1].position;
            r[0].position = b;
            r[1].position = a;
          }
        }
      }
    });

    subscribers.forEach((cb) => cb(EVENTS.filter((e) => e.status === 'live')));
  }, SIMULATION_INTERVAL);

  return () => stopLiveSimulation();
}

export function stopLiveSimulation() {
  if (simulationTimer) {
    clearInterval(simulationTimer);
    simulationTimer = null;
  }
  liveSimulatorActive = false;
  subscribers.length = 0;
}