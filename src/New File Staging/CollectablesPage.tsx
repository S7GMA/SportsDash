/**
 * Collectables Page (NEW)
 * 
 * Multi-sport trading card collection browser.
 * Features:
 * - Sport filtering (F1, NBA, NFL, MLB, Soccer)
 * - Card version filtering (Common, Holographic, Special)
 * - Responsive grid layout
 * - Lazy loading for performance
 * 
 * This page will eventually show:
 * - Cards the user owns
 * - Cards available for trade
 * - Collection statistics
 */

import { useState, useMemo } from 'react'
import { TradingCard } from '@/components/TradingCard/TradingCard'
import type { Sport, CardVersion, TradingCard as TradingCardData } from '@/domain/tradingCard'
import { useSportsData } from '@/providers/SportsDataContext'
import { SEED_TRADING_CARDS } from '@/data/seedCards'
import './CollectablesPage.css'

export type SportFilter = Sport | 'all'
export type VersionFilter = CardVersion | 'all'

interface FilterState {
  sport: SportFilter
  version: VersionFilter
}

/**
 * Collectables Page - Browse trading cards across all sports
 */
export function CollectablesPage() {
  const { loading } = useSportsData()
  const [filters, setFilters] = useState<FilterState>({
    sport: 'all',
    version: 'all',
  })

  // Get all available cards (from API or seed data)
  const allCards = useMemo(() => {
    return SEED_TRADING_CARDS
  }, [])

  // Filter cards based on current filter state
  const filteredCards = useMemo(() => {
    return allCards.filter((card) => {
      if (filters.sport !== 'all' && card.sport !== filters.sport) {
        return false
      }
      if (filters.version !== 'all' && card.version !== filters.version) {
        return false
      }
      return true
    })
  }, [allCards, filters])

  const handleSportFilter = (sport: SportFilter) => {
    setFilters((prev) => ({ ...prev, sport }))
  }

  const handleVersionFilter = (version: VersionFilter) => {
    setFilters((prev) => ({ ...prev, version }))
  }

  if (loading) return <p className="loading-message">Loading collectables…</p>

  return (
    <div className="collectables-page">
      <header className="collectables-header">
        <h1 className="collectables-title">Collectables</h1>
        <p className="collectables-description">
          Build your collection across Formula 1, NBA, NFL, MLB, and more. Find rare cards, trade with others, and complete your sets.
        </p>
      </header>

      {/* Filter Panel */}
      <div className="collectables-filters">
        {/* Sport Filter */}
        <div className="filter-group">
          <label className="filter-label">Sport</label>
          <div className="filter-buttons">
            {(['all', 'f1', 'nba', 'nfl', 'mlb', 'soccer'] as const).map((sport) => (
              <button
                key={sport}
                className={`filter-button ${filters.sport === sport ? 'active' : ''}`}
                onClick={() => handleSportFilter(sport)}
                aria-pressed={filters.sport === sport}
              >
                {sport === 'all' ? 'All' : sport.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Version Filter */}
        <div className="filter-group">
          <label className="filter-label">Card Version</label>
          <div className="filter-buttons">
            {(['all', 'common', 'holographic', 'special'] as const).map((version) => (
              <button
                key={version}
                className={`filter-button ${filters.version === version ? 'active' : ''}`}
                onClick={() => handleVersionFilter(version)}
                aria-pressed={filters.version === version}
              >
                {version === 'all'
                  ? 'All Versions'
                  : version.charAt(0).toUpperCase() + version.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="collectables-summary">
        <p className="summary-text">
          {filteredCards.length} {filteredCards.length === 1 ? 'card' : 'cards'} found
        </p>
      </div>

      {/* Card Grid */}
      {filteredCards.length > 0 ? (
        <div className="collectables-grid">
          {filteredCards.map((card) => (
            <div key={card.id} className="collectables-card-wrapper">
              <TradingCard
                card={card}
                href={`/card/${card.id}`}
                showFavorite
                enableFlip={card.version !== 'special' || card.specialType !== 'highlight'}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="collectables-empty">
          <p>No cards found matching your filters.</p>
          <p>Try adjusting your search.</p>
        </div>
      )}

      {/* Info Section */}
      <section className="collectables-info">
        <h2>Card Versions</h2>
        <dl className="collectables-legend">
          <dt className="legend-term">
            <span className="legend-badge common">Common</span>
          </dt>
          <dd>Standard trading card with athlete photo</dd>

          <dt className="legend-term">
            <span className="legend-badge holographic">Holographic</span>
          </dt>
          <dd>Premium card with animated holographic shimmer effect</dd>

          <dt className="legend-term">
            <span className="legend-badge special">Special</span>
          </dt>
          <dd>Rare cards with custom artwork, highlight videos, or animations</dd>
        </dl>
      </section>
    </div>
  )
}

export default CollectablesPage
