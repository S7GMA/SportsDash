import { Sport, League, Team, Player, Driver, SportEvent, EventFilter, ScheduleParams, TeamDetails, PlayerDetails, DriverDetails, Standing, ProviderCapabilities, Unsubscribe, SportType, EventStatus } from '@/domain/types';

// ============================================================================
// SPORTS DATA PROVIDER INTERFACE
// Core contract between UI and data layer
// ============================================================================

export interface SportsDataProvider {
  // Provider identity
  readonly id: string;
  readonly name: string;

  // ─── Discovery ───
  // Get all sports supported by this provider
  getSports(): Promise<Sport[]>;

  // Get leagues for a sport (or all sports if sportId omitted)
  getLeagues(sportId?: string): Promise<League[]>;

  // Alias for leagues (comprehensive competition data)
  getCompetitions(sportId?: string): Promise<League[]>;

  // ─── Core Entities ───
  // Get teams for a league
  getTeams(leagueId: string): Promise<Team[]>;

  // Get players for a team
  getPlayers(teamId: string): Promise<Player[]>;

  // Get drivers for a league (motorsport)
  getDrivers(leagueId?: string): Promise<Driver[]>;

  // ─── Events ───
  // Get events with optional filtering
  // Filter parameters allow narrowing events by sport, date, team, etc.
  getEvents(filter?: EventFilter): Promise<SportEvent[]>;

  // Get live events (events currently in progress)
  getLiveEvents(): Promise<SportEvent[]>;

  // Get single event by ID
  getEventById(eventId: string): Promise<SportEvent | null>;

  // Get schedule for date range with optional filters
  getSchedule(params: ScheduleParams): Promise<Schedule>;

  // ─── Standings ───
  // Get league standings (team or driver specific)
  getStandings(leagueId: string): Promise<Standings>;

  // ─── Details ───
  // Get comprehensive team details including next event, results, roster, standings
  getTeamDetails(teamId: string): Promise<TeamDetails>;

  // Get player details including recent games, season stats
  getPlayerDetails(playerId: string): Promise<PlayerDetails>;

  // Get driver details including next session, race results, championship info
  getDriverDetails(driverId: string): Promise<DriverDetails>;

  // ─── Real-time Support ───
  // Declare what real-time mechanism this provider supports
  // UI respects provider's capabilities
  supportsRealTime(): 'polling' | 'websocket' | 'sse' | 'none';

  // Subscribe to live event updates
  // Provider pushes updates to callback when events change
  subscribeToLiveEvents(
    onUpdate: (events: SportEvent[]) => void,
    onError?: (err: Error) => void
  ): Unsubscribe;

  // ─── Capabilities ───
  // Get provider's capabilities for UI to display appropriate empty states
  // Returns object with booleans indicating what this provider can/cannot do
  getCapabilities(): ProviderCapabilities;
}

// ============================================================================
// PROVIDER CAPABILITIES INTERFACE
// Used by UI to show honest empty states based on provider limitations
// ============================================================================

export interface ProviderCapabilities {
  // Core data capabilities
  liveScores: boolean;               // Can provider give live scores?
  realTimeUpdates: 'polling' | 'websocket' | 'sse' | 'none';  // Mechanism type
  pollingIntervalMs: number;         // Recommended poll frequency

  // Sport-specific coverage
  supportsF1: boolean;               // Can provide F1 data?
  supportsSoccer: boolean;           // Can provide soccer data?
  supportsNFL: boolean;               // Can provide NFL data?
  supportsNBA: boolean;               // Can provide NBA data?
  supportsMLB: boolean;               // Can provide MLB data?

  // Additional data types
  supportsStandings: boolean;        // Can provide standings?
  supportsPlayerStats: boolean;       // Can provide player statistics?
  supportsDriverDetails: boolean;     // Can provide driver championship data?
}

// ============================================================================
// SCHEDULE INTERFACE
// Return type for getSchedule()
// ============================================================================

export interface Schedule {
  events: SportEvent[];
  dateRange: {
    start: string;           // ISO date
    end: string;             // ISO date
  };
  sportId?: string;
  leagueId?: string;
}

// ============================================================================
// HELPERS
// ============================================================================

// Filter type for getEvents() - comprehensive filtering options
export interface EventFilter {
  sportId?: string;           // Filter by sport
  leagueId?: string;          // Filter by league
  teamId?: string;            // Filter by team (events where team participates)
  driverId?: string;          // Filter by driver (motorsport)
  status?: EventStatus;       // Filter by status (scheduled, live, completed, etc.)
  dateFrom?: string;          // Filter events starting from this date (ISO date)
  dateTo?: string;            // Filter events ending by this date (ISO date)
  participantId?: string;     // Filter events involving specific participant
}

// Schedule parameters for getSchedule()
export interface ScheduleParams {
  dateFrom?: string;          // Start of schedule window
  dateTo?: string;            // End of schedule window
  sportId?: string;           // Filter by sport
  leagueId?: string;          // Filter by league
  teamId?: string;            // Filter team's schedule
  driverId?: string;          // Filter driver's schedule
  favoriteOnly?: boolean;     // Return only events with user's favorite participants
  includeCompleted?: boolean; // Include completed events in returned schedule
}

// ============================================================================
// EXPORT DECLARATION
// Single export for easy importing
// ============================================================================
export { SportsDataProvider };