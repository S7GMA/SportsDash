import { SportsDataProvider, Unsubscribe } from '@/providers/SportsDataProvider';
import { Sport, League, Team, Player, Driver, SportEvent, EventFilter, ScheduleParams, TeamDetails, PlayerDetails, DriverDetails, Standing, ProviderCapabilities } from '@/domain/types';
import { EVENTS, SPORTS, LEAGUES, TEAMS, PLAYERS, DRIVERS, STANDINGS, startLiveSimulation, stopLiveSimulation } from '@/providers/mockData';
import { StorageAdapter } from '@/state/stores';

// ============================================================================
// MOCK SPORTS DATA PROVIDER
// Implements SportsDataProvider with realistic fixture data.
// All times in ISO 8601 UTC. No fake live updates - clearly labeled simulation.
// ============================================================================

export class MockSportsDataProvider implements SportsDataProvider {
  readonly id = 'mock';
  readonly name = 'Mock Sports Data Provider';

  constructor(private storageAdapter: StorageAdapter) {}

  // ─── Discovery ───
  async getSports(): Promise<Sport[]> {
    return [...SPORTS];
  }

  async getLeagues(sportId?: string): Promise<League[]> {
    if (sportId) {
      return LEAGUES.filter(league => league.sportId === sportId);
    }
    return [...LEAGUES];
  }

  async getCompetitions(sportId?: string): Promise<League[]> {
    return this.getLeagues(sportId);
  }

  // ─── Core Entities ───
  async getTeams(leagueId: string): Promise<Team[]> {
    return TEAMS.filter(team => team.leagueId === leagueId);
  }

  async getPlayers(teamId: string): Promise<Player[]> {
    return PLAYERS.filter(player => player.teamId === teamId);
  }

  async getDrivers(leagueId?: string): Promise<Driver[]> {
    if (leagueId) {
      return DRIVERS.filter(driver => driver.teamId === leagueId);
    }
    return [...DRIVERS];
  }

  // ─── Events ───
  async getEvents(filter?: EventFilter): Promise<SportEvent[]> {
    let results = [...EVENTS];

    if (filter) {
      if (filter.sportId) {
        results = results.filter(event => event.sportId === filter.sportId);
      }
      if (filter.leagueId) {
        results = results.filter(event => event.leagueId === filter.leagueId);
      }
      if (filter.teamId) {
        results = results.filter(event =>
          event.participants.some(p => p.id === filter.teamId && p.type === 'team')
        );
      }
      if (filter.driverId) {
        results = results.filter(event =>
          event.participants.some(p => p.id === filter.driverId && p.type === 'driver')
        );
      }
      if (filter.status) {
        results = results.filter(event => event.status === filter.status);
      }
      if (filter.dateFrom) {
        const fromDate = new Date(filter.dateFrom);
        results = results.filter(event => new Date(event.startTime) >= fromDate);
      }
      if (filter.dateTo) {
        const toDate = new Date(filter.dateTo);
        results = results.filter(event => {
          const endTime = event.endTime ? new Date(event.endTime) : new Date(event.startTime);
          return endTime <= toDate;
        });
      }
    }

    return results;
  }

  async getLiveEvents(): Promise<SportEvent[]> {
    return this.getEvents({ status: 'live' });
  }

  async getEventById(eventId: string): Promise<SportEvent | null> {
    return EVENTS.find(event => event.id === eventId) ?? null;
  }

  async getSchedule(params: ScheduleParams): Promise<Schedule> {
    const events = await this.getEvents({
      sportId: params.sportId,
      leagueId: params.leagueId,
      teamId: params.teamId,
      driverId: params.driverId,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
    });

    return {
      events,
      dateRange: {
        start: params.dateFrom ?? new Date().toISOString().split('T')[0],
        end: params.dateTo ?? new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      },
      sportId: params.sportId,
      leagueId: params.leagueId,
    };
  }

  // ─── Standings ───
  async getStandings(leagueId: string): Promise<Standings> {
    const standings = STANDINGS[leagueId];
    if (!standings) {
      throw new Error(`No standings found for league ${leagueId}`);
    }
    return { ...standings };
  }

  // ─── Details ───
  async getTeamDetails(teamId: string): Promise<TeamDetails> {
    const team = TEAMS.find(t => t.id === teamId);
    if (!team) {
      throw new Error(`Team not found: ${teamId}`);
    }

    const upcoming = await this.getEvents({
      teamId,
      status: 'scheduled',
      dateFrom: new Date().toISOString(),
    });

    const recent = await this.getEvents({
      teamId,
      status: 'completed',
      dateTo: new Date().toISOString(),
    });

    // Recent results (last 5)
    const recentResults = recent
      .slice()
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
      .slice(0, 5);

    // Upcoming schedule (next 5)
    const upcomingSchedule = upcoming
      .slice()
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      .slice(0, 5);

    return {
      ...team,
      nextEvent: upcoming[0] ?? null,
      recentResults,
      upcomingSchedule,
    };
  }

  async getPlayerDetails(playerId: string): Promise<PlayerDetails> {
    const player = PLAYERS.find(p => p.id === playerId);
    if (!player) {
      throw new Error(`Player not found: ${playerId}`);
    }

    const recentGames = await this.getEvents({
      teamId: player.teamId,
      // In a real implementation, we'd filter by player participation
      // For mock, we'll return some recent games of the team
      dateTo: new Date().toISOString(),
      status: 'completed',
    });

    // Sort by date descending and take last 5
    const sortedGames = recentGames
      .slice()
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
      .slice(0, 5);

    return {
      ...player,
      recentGames: sortedGames.map(game => ({
        eventId: game.id,
        date: game.startTime,
        opponentName: game.participants
          .find(p => p.id !== player.teamId && p.type === 'team')
          ?.name ?? 'Unknown',
        stats: {}, // Simplified for mock
        result: 'win', // Simplified
      })),
      seasonStats: player.stats ?? {},
    };
  }

  async getDriverDetails(driverId: string): Promise<DriverDetails> {
    const driver = DRIVERS.find(d => d.id === driverId);
    if (!driver) {
      throw new Error(`Driver not found: ${driverId}`);
    }

    const recentResults = await this.getEvents({
      driverId,
      status: 'completed',
      dateTo: new Date().toISOString(),
    });

    // Sort by date descending
    const sortedResults = recentResults
      .slice()
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

    return {
      ...driver,
      nextSession: null, // Would get from schedule in real impl
      recentResults: sortedResults.map(event => ({
        eventId: event.id,
        date: event.startTime,
        // In real impl, extract position from event.details
        position: Math.floor(Math.random() * 10) + 1,
        points: Math.floor(Math.random() * 26),
        status: 'finished' as const,
      })),
      championshipStandings: {
        position: driver.championshipPosition ?? 1,
        participantId: driver.id,
        name: driver.name,
        played: driver.stats?.races ?? 0,
        wins: driver.stats?.wins ?? 0,
        points: driver.championshipPoints ?? 0,
      },
      seasonStats: driver.stats ?? {},
    };
  }

  // ─── Real-time ───
  supportsRealTime(): 'polling' | 'websocket' | 'sse' | 'none' {
    // Mock provider supports polling simulation
    return 'polling';
  }

  subscribeToLiveEvents(
    onUpdate: (events: SportEvent[]) => void,
    onError?: (err: Error) => void
  ): Unsubscribe {
    // Start the live simulation and return unsubscribe function
    const unsubscribe = startLiveSimulation(onUpdate);
    return () => {
      unsubscribe();
      // Optionally remove from subscribers list if needed
    };
  }

  // ─── Capabilities ───
  getCapabilities(): ProviderCapabilities {
    return {
      liveScores: true,
      realTimeUpdates: 'polling',
      pollingIntervalMs: 5000, // 5 seconds for demo
      supportsF1: true,
      supportsSoccer: true,
      supportsNFL: true,
      supportsNBA: true,
      supportsMLB: true,
      supportsStandings: true,
      supportsPlayerStats: true,
      supportsDriverDetails: true,
    };
  }
}

// ============================================================================
// FACTORY FUNCTION
// ============================================================================

export function createMockSportsDataProvider(storageAdapter: StorageAdapter): SportsDataProvider {
  return new MockSportsDataProvider(storageAdapter);
}