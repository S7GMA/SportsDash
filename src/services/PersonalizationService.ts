import { SportEvent, FavoriteType, UserProfile } from '@/domain/types';

// ============================================================================
// PERSONALIZATION SERVICE
// Deterministic signal-based ranking. No AI. Pure function.
// ============================================================================

export interface PersonalizationService {
  rankEvents(events: SportEvent[]): SportEvent[];
  rankTeams(teams: any[]): any[];
  rankPlayers(players: any[]): any[];
  rankDrivers(drivers: any[]): any[];
  rankScheduleItems(schedule: any[]): any[];
  getRecommendedContent(): SportEvent[] | null;
}

// ============================================================================
// CORE RANKING LOGIC
// ============================================================================

export class DefaultPersonalizationService implements PersonalizationService {
  constructor(private userProfile: UserProfile) {}

  rankEvents(events: SportEvent[]): SportEvent[] {
    if (!this.userProfile || !this.userProfile.favoriteSports) return events;

    // Rule 1: Prioritize events matching favorite sports
    const favoriteSports = new Set(this.userProfile.favoriteSports);
    const prioritizedEvents = events
      .filter(event => favoriteSports.has(event.sportId))
      .sort((a, b) => {
        // Give higher priority to favorites-related events
        const aFav = a.participants.some(p => this.isFavoriteEntity(p.id));
        const bFav = b.participants.some(p => this.isFavoriteEntity(p.id));
        return (bFav ? 1 : 0) - (aFav ? 1 : 0);
      });

    // Rule 2: Prioritize events with favorite participants
    const favoriteEntities = new Set([...this.userProfile.favoriteTeams, ...this.userProfile.favoritePlayers, ...this.userProfile.favoriteDrivers]);
    const participantsEvents = prioritizedEvents
      .filter(event => event.participants.some(participant => favoriteEntities.has(participant.id)))
      .sort((a, b) => {
        // Favor events with more fav entities
        const aCount = a.participants.filter(e => favoriteEntities.has(e.id)).length;
        const bCount = b.participants.filter(e => favoriteEntities.has(e.id)).length;
        return bCount - aCount;
      });

    // Rule 3: Add recently viewed as lower priority
    const recentlyViewedEntities = new Set(this.userProfile.recentlyViewed.map(item => item.id));
    const recentEvents = prioritizedEvents
      .filter(event => recentlyViewedEntities.has(event.id))
      .sort((a, b) => {
        const aRecent = this.userProfile.recentlyViewed.find(i => i.id === a.id);
        const bRecent = this.userProfile.recentlyViewed.find(i => i.id === b.id);
        return (bRecent?.viewedAt ?? '') - (aRecent?.viewedAt ?? '');
      });

    // Combine results
    return [...prioritizedEvents, ...recentEvents];
  }

  // Other ranking methods follow similar patterns...

  // Placeholder - will implement full logic
  rankTeams = (teams) => teams;
  rankPlayers = (players) => players;
  rankDrivers = (drivers) => drivers;
  rankScheduleItems = (schedule) => schedule;

  getRecommendedContent() {
    // Combine ranked events + top favorites
    const rankedEvents = this.rankEvents([...EVENTS]);
    return rankedEvents.slice(0, 5); // top 5
  }
}

// Register singleton instance
const personalizationService = new DefaultPersonalizationService(null as any);
export default personalizationService;