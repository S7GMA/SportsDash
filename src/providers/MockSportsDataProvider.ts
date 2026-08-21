import type {
  Driver,
  DriverDetails,
  EventFilter,
  League,
  Player,
  PlayerDetails,
  ProviderCapabilities,
  Schedule,
  ScheduleParams,
  Sport,
  SportEvent,
  SportsDataProvider,
  Standings,
  Team,
  TeamDetails,
  Unsubscribe,
} from '@/domain/types';
import {
  DRIVERS,
  EVENTS,
  LEAGUES,
  PLAYERS,
  SPORTS,
  STANDINGS,
  TEAMS,
  startLiveSimulation,
} from '@/providers/mockData';

function clone<T>(value: T): T {
  return structuredClone(value);
}

export class MockSportsDataProvider implements SportsDataProvider {
  readonly id = 'mock';
  readonly name = 'Mock Sports Data Provider';

  async getSports(): Promise<Sport[]> {
    return clone(SPORTS);
  }

  async getLeagues(sportId?: string): Promise<League[]> {
    return clone(sportId ? LEAGUES.filter((l) => l.sportId === sportId) : LEAGUES);
  }

  async getCompetitions(sportId?: string): Promise<League[]> {
    return this.getLeagues(sportId);
  }

  async getTeams(leagueId: string): Promise<Team[]> {
    return clone(TEAMS.filter((t) => t.leagueId === leagueId));
  }

  async getPlayers(teamId: string): Promise<Player[]> {
    return clone(PLAYERS.filter((p) => p.teamId === teamId));
  }

  async getDrivers(leagueId?: string): Promise<Driver[]> {
    if (!leagueId) return clone(DRIVERS);
    const teamIds = new Set(TEAMS.filter((t) => t.leagueId === leagueId).map((t) => t.id));
    return clone(DRIVERS.filter((d) => teamIds.has(d.teamId)));
  }

  async getEvents(filter?: EventFilter): Promise<SportEvent[]> {
    let results = clone(EVENTS);
    if (!filter) return results;
    if (filter.sportId) results = results.filter((e) => e.sportId === filter.sportId);
    if (filter.leagueId) results = results.filter((e) => e.leagueId === filter.leagueId);
    if (filter.status) results = results.filter((e) => e.status === filter.status);
    if (filter.teamId) {
      results = results.filter((e) => e.participants.some((p) => p.id === filter.teamId && p.type === 'team'));
    }
    if (filter.driverId) {
      results = results.filter((e) => e.participants.some((p) => p.id === filter.driverId && p.type === 'driver'));
    }
    if (filter.dateFrom) {
      const from = new Date(filter.dateFrom).getTime();
      results = results.filter((e) => new Date(e.startTime).getTime() >= from);
    }
    if (filter.dateTo) {
      const to = new Date(filter.dateTo).getTime();
      results = results.filter((e) => new Date(e.startTime).getTime() <= to);
    }
    return results;
  }

  async getLiveEvents(): Promise<SportEvent[]> {
    return this.getEvents({ status: 'live' });
  }

  async getEventById(eventId: string): Promise<SportEvent | null> {
    return clone(EVENTS.find((e) => e.id === eventId) ?? null);
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
        start: params.dateFrom ?? new Date().toISOString().slice(0, 10),
        end: params.dateTo ?? new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      },
      sportId: params.sportId,
      leagueId: params.leagueId,
    };
  }

  async getStandings(leagueId: string): Promise<Standings> {
    const standings = STANDINGS[leagueId];
    if (!standings) {
      return {
        leagueId,
        season: '',
        type: 'team',
        table: [],
        updatedAt: new Date().toISOString(),
      };
    }
    return clone(standings);
  }

  async getTeamDetails(teamId: string): Promise<TeamDetails> {
    const team = TEAMS.find((t) => t.id === teamId);
    if (!team) throw new Error(`Team not found: ${teamId}`);
    const related = EVENTS.filter((e) => e.participants.some((p) => p.id === teamId));
    const upcoming = related
      .filter((e) => e.status === 'scheduled')
      .sort((a, b) => +new Date(a.startTime) - +new Date(b.startTime));
    const recent = related
      .filter((e) => e.status === 'completed')
      .sort((a, b) => +new Date(b.startTime) - +new Date(a.startTime));
    const standings = STANDINGS[team.leagueId]?.table.find((row) => row.participantId === teamId);
    return clone({
      ...team,
      nextEvent: upcoming[0],
      recentResults: recent.slice(0, 5),
      upcomingSchedule: upcoming.slice(0, 5),
      standings,
      roster: PLAYERS.filter((p) => p.teamId === teamId),
    });
  }

  async getPlayerDetails(playerId: string): Promise<PlayerDetails> {
    const player = PLAYERS.find((p) => p.id === playerId);
    if (!player) throw new Error(`Player not found: ${playerId}`);
    const recent = EVENTS.filter(
      (e) => e.status === 'completed' && e.participants.some((p) => p.id === player.teamId),
    )
      .sort((a, b) => +new Date(b.startTime) - +new Date(a.startTime))
      .slice(0, 5);
    return clone({
      ...player,
      recentGames: recent.map((game) => ({
        eventId: game.id,
        date: game.startTime,
        opponentName: game.participants.find((p) => p.id !== player.teamId)?.name ?? 'Unknown',
        stats: {},
        result: undefined,
      })),
      seasonStats: player.stats ?? {},
    });
  }

  async getDriverDetails(driverId: string): Promise<DriverDetails> {
    const driver = DRIVERS.find((d) => d.id === driverId);
    if (!driver) throw new Error(`Driver not found: ${driverId}`);
    const liveOrNext = EVENTS.find((e) => e.sportId === 'f1' && (e.status === 'live' || e.status === 'scheduled'));
    const session =
      liveOrNext?.details && liveOrNext.details.sportType === 'f1'
        ? liveOrNext.details.currentSession ?? liveOrNext.details.sessions.at(-1)
        : undefined;
    const recent = EVENTS.filter((e) => e.sportId === 'f1' && e.status === 'completed');
    const results = recent.flatMap((event) => {
      if (!event.details || event.details.sportType !== 'f1') return [];
      const race = event.details.sessions.find((s) => s.type === 'race');
      return (race?.results ?? []).filter((r) => r.driverId === driverId);
    });
    return clone({
      ...driver,
      nextSession: session,
      recentResults: results,
      championshipStandings: {
        position: driver.championshipPosition ?? 0,
        participantId: driver.id,
        name: driver.name,
        played: driver.stats?.races ?? 0,
        wins: driver.stats?.wins ?? 0,
        losses: 0,
        points: driver.championshipPoints ?? 0,
        podiums: driver.stats?.podiums,
        poles: driver.stats?.poles,
      },
      seasonStats: driver.stats,
    });
  }

  supportsRealTime(): 'polling' | 'websocket' | 'sse' | 'none' {
    return 'polling';
  }

  subscribeToLiveEvents(
    onUpdate: (events: SportEvent[]) => void,
    _onError?: (err: Error) => void,
  ): Unsubscribe {
    onUpdate(clone(EVENTS.filter((e) => e.status === 'live')));
    return startLiveSimulation((events) => onUpdate(clone(events)));
  }

  getCapabilities(): ProviderCapabilities {
    return {
      liveScores: true,
      realTimeUpdates: 'polling',
      pollingIntervalMs: 5000,
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

export const sportsDataProvider = new MockSportsDataProvider();
