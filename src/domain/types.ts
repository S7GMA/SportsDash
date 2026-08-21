// Single source of truth for all domain types
// Zero dependencies on React, state, or providers

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

export type SportType =
    | 'f1'
    | 'nfl'
    | 'nba'
    | 'mlb'
    | 'soccer'
    | 'nhl'
    | 'golf'
    | 'tennis';

export type EventStatus =
    | 'scheduled'    // upcoming, not started
    | 'live'         // in progress
    | 'halftime'     // mid-game break
    | 'delayed'      // delayed but not postponed
    | 'postponed'    // rescheduled
    | 'suspended'    // temporarily stopped
    | 'cancelled'    // will not be played
    | 'completed';   // finished with final score

export type LiveStatus =
    | 'pre'       // before event
    | 'in_play'   // active
    | 'break'     // halftime / intermission / red flag
    | 'ended';    // final

export type FavoriteType =
    | 'sport'
    | 'league'
    | 'team'
    | 'player'
    | 'driver';

export type Appearance = 'light' | 'dark' | 'system';

export type NotificationType =
    | 'event_starting'
    | 'event_started'
    | 'score_change'
    | 'favorite_scored'
    | 'event_finished'
    | 'status_change'
    | 'schedule_change'
    | 'draft_notification'
    | 'ranking_update';

// ============================================================================
// CORE ENTITIES
// ============================================================================

export interface Sport {
    id: string;
    name: string;
    type: SportType;
    icon?: string;
    seasonFormat: 'calendar' | 'split' | 'single';
    hasStandings: boolean;
    hasPlayers: boolean;
    hasDrivers: boolean;
    hasTeams: boolean;
    color?: string;
}

export interface League {
    id: string;
    name: string;
    sportId: string;
    country?: string;
    logo?: string;
    season?: string;
    competitionType: 'league' | 'cup' | 'tournament' | 'championship';
}

export interface Team {
    id: string;
    name: string;
    shortName: string;
    city?: string;
    abbreviation: string;
    leagueId: string;
    sportId: string;
    logo?: string;
    colors?: {
        primary?: string;
        secondary?: string;
    };
    venue?: Venue;
}

export interface Venue {
    id?: string;
    name: string;
    city: string;
    country?: string;
    capacity?: number;
    timezone?: string;
}

export interface Player {
    id: string;
    name: string;
    teamId: string;
    leagueId: string;
    sportId: string;
    position?: string;
    number?: number;
    nationality?: string;
    photo?: string;
    stats?: PlayerStats;
}

export interface PlayerStats {
    [statName: string]: number | string | undefined;
    season?: string;
    gamesPlayed?: number;
}

export interface Driver {
    id: string;
    name: string;
    code: string;
    number: number;
    teamId: string;
    nationality?: string;
    photo?: string;
    championshipPoints?: number;
    championshipPosition?: number;
    stats?: DriverStats;
}

export interface DriverStats {
    season?: string;
    races?: number;
    wins?: number;
    podiums?: number;
    poles?: number;
    fastestLaps?: number;
    points?: number;
    championshipPosition?: number;
    dnfs?: number;
}

// ============================================================================
// EVENT SYSTEM - Shared base + sport-specific discriminated unions
// ============================================================================

export interface EventParticipant {
    id: string;
    type: 'team' | 'driver';
    name: string;
    score?: number;
    shortName?: string;
    logo?: string;
    isHome?: boolean;
}

export interface SportEvent {
    id: string;
    sportId: string;
    leagueId: string;
    name: string;
    status: EventStatus;
    startTime: string;         // ISO 8601 UTC
    endTime?: string;          // ISO 8601 UTC
    eventTimezone: string;     // IANA tz: 'Asia/Tokyo', 'America/Chicago'
    venue?: Venue;
    competition?: string;
    details?: SportEventDetails;
    participants: EventParticipant[];
    isFavorite?: boolean;      // computed at state layer
}

// Discriminated union for sport-specific event data
export type SportEventDetails =
    | F1EventDetails
    | TeamSportEventDetails;

// ─── F1 / Motorsport ───
export interface F1EventDetails {
    sportType: 'f1';
    circuit: {
        id: string;
        name: string;
        country: string;
        city?: string;
        length?: number;
    };
    sessions: F1Session[];
    currentSession?: F1Session;
    round?: number;
}

export interface F1Session {
    type: 'practice' | 'qualifying' | 'sprint' | 'race';
    name: string;
    startTime: string;
    endTime?: string;
    status: EventStatus;
    results?: F1SessionResult[];
    weather?: {
        condition?: string;
        temperature?: number;
        trackTemp?: number;
    };
    lapCount?: number;
    currentLap?: number;
    fastestLap?: {
        driverId: string;
        time: string;
        lap: number;
    };
}

export interface F1SessionResult {
    driverId: string;
    position: number;
    gridPosition?: number;
    time?: string;
    laps?: number;
    points?: number;
    status: 'finished' | 'dnf' | 'dns' | 'dsq' | 'did_not_finish';
    fastestLap?: boolean;
}

// ─── Team Sports (NFL, NBA, MLB, Soccer, NHL) ───
export interface TeamSportEventDetails {
    sportType: 'nfl' | 'nba' | 'mlb' | 'soccer' | 'nhl';
    periods?: Period[];
    currentPeriod?: number;
    clock?: string;
    possession?: string;
    lastPlay?: PlayDescription;
    soccerSpecific?: SoccerMatchDetails;
    nflSpecific?: NFLGameDetails;
    nbaSpecific?: NBAGameDetails;
    mlbSpecific?: MLBGameDetails;
}

export interface Period {
    number: number;
    type: 'quarter' | 'half' | 'inning' | 'period' | 'overtime' | 'shootout';
    name: string;
    score: { home: number; away: number };
    startTime?: string;
    endTime?: string;
}

export interface PlayDescription {
    text: string;
    type: 'score' | 'penalty' | 'timeout' | 'turnover' | 'substitution' | 'other';
    teamId?: string;
    timestamp: string;
}

// Soccer specifics
export interface SoccerMatchDetails {
    minute: number;
    stoppageTime?: number;
    half: 1 | 2 | 'et' | 'penalties';
    extraTime?: boolean;
    penaltyShootout?: {
        home: number;
        away: number;
        sequence: PenaltyKick[];
    };
    cards: Card[];
    goals: Goal[];
    substitutions: Substitution[];
}

export interface Goal {
    minute: number;
    scorerId?: string;
    scorerName: string;
    teamId: string;
    type: 'regular' | 'penalty' | 'own_goal';
    assist?: string;
}

export interface Card {
    minute: number;
    playerId?: string;
    playerName: string;
    teamId: string;
    type: 'yellow' | 'red';
}

export interface Substitution {
    minute: number;
    teamId: string;
    playerIn: string;
    playerOut: string;
}

export interface PenaltyKick {
    kicker: string;
    teamId: string;
    scored: boolean;
}

// NFL specifics
export interface NFLGameDetails {
    down: number;
    distance: number;
    yardLine: number;
    possessionTeamId: string;
    quarterScores: { home: number; away: number }[];
    scoringPlays: ScoringPlay[];
}

export interface ScoringPlay {
    quarter: number;
    time: string;
    teamId: string;
    type: 'touchdown' | 'field_goal' | 'safety' | 'two_point' | 'other';
    description: string;
    homeScore: number;
    awayScore: number;
}

// NBA specifics
export interface NBAGameDetails {
    quarterScores: { home: number; away: number }[];
    fouls?: { home: number; away: number };
    timeouts?: { home: number; away: number };
    scoringPlays: ScoringPlay[];
    leadChanges?: number;
    biggestLead?: { teamId: string; points: number };
}

// MLB specifics
export interface MLBGameDetails {
    inning: number;
    half: 'top' | 'bottom';
    outs: number;
    bases: { first: boolean; second: boolean; third: boolean };
    pitcher?: string;
    batter?: string;
    count: { balls: number; strikes: number };
    lineScore: { home: number[]; away: number[] };
}

// ============================================================================
// STANDINGS & SCHEDULES
// ============================================================================

export interface Standings {
    leagueId: string;
    season: string;
    type: 'team' | 'driver';
    table: StandingEntry[];
    updatedAt: string;
}

export interface StandingEntry {
    position: number;
    participantId: string;
    name: string;
    played: number;
    wins: number;
    draws?: number;
    losses: number;
    points?: number;
    pointsFor?: number;
    pointsAgainst?: number;
    pointsDifference?: number;
    form?: ('W' | 'D' | 'L')[];
    constructorId?: string;
    wins2?: number;
    podiums?: number;
    poles?: number;
}

export interface Schedule {
    events: SportEvent[];
    dateRange: {
        start: string;
        end: string;
    };
    sportId?: string;
    leagueId?: string;
}

// ============================================================================
// USER PROFILE & PREFERENCES
// ============================================================================

export interface Favorite {
    id: string;
    type: FavoriteType;
    refId: string;
    name: string;
    addedAt: string;
}

export interface NotificationPreferences {
    enabled: boolean;
    eventStarting: boolean;
    eventStarted: boolean;
    scoreChange: boolean;
    favoriteScored: boolean;
    eventFinished: boolean;
    statusChange: boolean;
    minutesBeforeStart: number;
}

export interface DisplayPreferences {
    timezone: string;
    appearance: Appearance;
    showEventTimezone: boolean;
    compactMode: boolean;
    autoRefresh: boolean;
    refreshInterval: number;
}

export interface UserProfile {
    id: string;
    onboardingComplete: boolean;
    favoriteSports: string[];
    favoriteTeams: string[];
    favoritePlayers: string[];
    favoriteDrivers: string[];
    favoriteLeagues: string[];
    favoriteCompetitions: string[];
    notifications: NotificationPreferences;
    display: DisplayPreferences;
    recentlyViewed: RecentlyViewedItem[];
    followedEvents: string[];
    personalizationSignals: PersonalizationSignal[];
    createdAt: string;
    updatedAt: string;
}

export interface RecentlyViewedItem {
    id: string;
    type: FavoriteType;
    name: string;
    viewedAt: string;
}

export interface PersonalizationSignal {
    entityType: FavoriteType;
    entityId: string;
    signal: 'favorite' | 'recently_viewed' | 'followed_event' | 'notification_interaction';
    weight: number;
    timestamp: string;
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export interface AppNotification {
    id: string;
    type: NotificationType;
    eventId: string;
    sportId: string;
    title: string;
    body: string;
    timestamp: string;
    read: boolean;
    data?: {
        teamId?: string;
        driverId?: string;
        leagueId?: string;
        oldScore?: string;
        newScore?: string;
    };
}

// ============================================================================
// BRACKETS & DRAFTS
// ============================================================================

export interface Bracket {
    id: string;
    competitionId: string;
    name: string;
    sportType: SportType;
    rounds: BracketRound[];
    status: 'upcoming' | 'in_progress' | 'completed';
}

export interface BracketRound {
    round: number;
    name: string;
    matches: BracketMatch[];
}

export interface BracketMatch {
    id: string;
    round: number;
    matchNumber: number;
    participant1?: BracketParticipant;
    participant2?: BracketParticipant;
    winner?: BracketParticipant;
    score?: { p1: number; p2: number };
    status: 'scheduled' | 'live' | 'completed';
    nextMatchId?: string;
}

export interface BracketParticipant {
    id: string;
    name: string;
    logo?: string;
    seed?: number;
    isFavorite?: boolean;
}

export interface Draft {
    id: string;
    leagueId: string;
    sportId: string;
    year: number;
    status: 'upcoming' | 'in_progress' | 'completed';
    currentPick?: number;
    currentRound?: number;
    totalRounds: number;
    picks: DraftPick[];
}

export interface DraftPick {
    pickNumber: number;
    round: number;
    teamId: string;
    playerId?: string;
    playerName?: string;
    position?: string;
    timestamp?: string;
    isFavoriteTeam?: boolean;
}

// ============================================================================
// PROVIDER CONTRACTS
// ============================================================================

export interface EventFilter {
    sportId?: string;
    leagueId?: string;
    teamId?: string;
    driverId?: string;
    status?: EventStatus;
    dateFrom?: string;
    dateTo?: string;
}

export interface ScheduleParams {
    dateFrom?: string;
    dateTo?: string;
    sportId?: string;
    leagueId?: string;
    teamId?: string;
    driverId?: string;
}

export interface TeamDetails extends Team {
    nextEvent?: SportEvent;
    recentResults: SportEvent[];
    upcomingSchedule: SportEvent[];
    standings?: StandingEntry;
    roster?: Player[];
}

export interface PlayerDetails extends Player {
    recentGames: GamePerformance[];
    seasonStats: PlayerStats;
}

export interface DriverDetails extends Driver {
    nextSession?: F1Session;
    recentResults: F1SessionResult[];
    championshipStandings?: StandingEntry;
    seasonStats?: DriverStats;
}

export interface GamePerformance {
    eventId: string;
    date: string;
    opponentName: string;
    stats: { [key: string]: number | string };
    result?: 'win' | 'loss' | 'draw';
}

export interface ProviderCapabilities {
    liveScores: boolean;
    realTimeUpdates: 'polling' | 'websocket' | 'sse' | 'none';
    pollingIntervalMs: number;
    supportsF1: boolean;
    supportsSoccer: boolean;
    supportsNFL: boolean;
    supportsNBA: boolean;
    supportsMLB: boolean;
    supportsStandings: boolean;
    supportsPlayerStats: boolean;
    supportsDriverDetails: boolean;
}

export interface Unsubscribe {
    (): void;
}

export interface SportsDataProvider {
    readonly id: string;
    readonly name: string;

    // Discovery
    getSports(): Promise<Sport[]>;
    getLeagues(sportId?: string): Promise<League[]>;
    getCompetitions(sportId?: string): Promise<League[]>;

    // Entities
    getTeams(leagueId: string): Promise<Team[]>;
    getPlayers(teamId: string): Promise<Player[]>;
    getDrivers(leagueId?: string): Promise<Driver[]>;

    // Events
    getEvents(filter?: EventFilter): Promise<SportEvent[]>;
    getLiveEvents(): Promise<SportEvent[]>;
    getEventById(eventId: string): Promise<SportEvent | null>;
    getSchedule(params: ScheduleParams): Promise<Schedule>;

    // Standings
    getStandings(leagueId: string): Promise<Standings>;

    // Details
    getTeamDetails(teamId: string): Promise<TeamDetails>;
    getPlayerDetails(playerId: string): Promise<PlayerDetails>;
    getDriverDetails(driverId: string): Promise<DriverDetails>;

    // Real-time
    supportsRealTime(): 'polling' | 'websocket' | 'sse' | 'none';
    subscribeToLiveEvents(
        onUpdate: (events: SportEvent[]) => void,
        onError?: (err: Error) => void
    ): Unsubscribe;

    // Capabilities
    getCapabilities(): ProviderCapabilities;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };
export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> };
export type EntityMap<T extends { id: string }> = Record<string, T>;