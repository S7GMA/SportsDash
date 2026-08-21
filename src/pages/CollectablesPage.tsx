import { useMemo, useState } from 'react'
import { TradingCard } from '@/components/TradingCard'
import type { Sport, CardVersion, TradingCard as TradingCardData } from '@/domain/tradingCard'
import { createF1DriverCard } from '@/domain/tradingCard'
import { useSportsData } from '@/providers/SportsDataContext'
import { SEED_TRADING_CARDS } from '@/data/seedCards'
import './CollectablesPage.css'

type SportFilter = Sport | 'all'
type VersionFilter = CardVersion | 'all'

function withHoloTwins(cards: TradingCardData[]): TradingCardData[] {
  const out: TradingCardData[] = []
  for (const c of cards) {
    if (c.version === 'special') {
      out.push(c)
      continue
    }
    const base = { ...c, version: 'common' as const, id: `${c.athleteId}-common` }
    if (!out.some((x) => x.id === base.id)) out.push(base)
    const holoId = `${c.athleteId}-holographic`
    if (!out.some((x) => x.id === holoId)) out.push({ ...base, id: holoId, version: 'holographic' })
  }
  return out
}

export function CollectablesPage() {
  const { loading, drivers } = useSportsData()
  const [filters, setFilters] = useState<{ sport: SportFilter; version: VersionFilter }>({
    sport: 'all',
    version: 'all',
  })

  const allCards = useMemo(() => {
    const liveF1 = drivers.map((d) => createF1DriverCard(d, 'common'))
    const seedNoF1 = SEED_TRADING_CARDS.filter((c) => c.sport !== 'f1')
    return withHoloTwins([...liveF1, ...seedNoF1])
  }, [drivers])

  const filteredCards = useMemo(
    () =>
      allCards.filter((card) => {
        if (filters.sport !== 'all' && card.sport !== filters.sport) return false
        if (filters.version !== 'all' && card.version !== filters.version) return false
        return true
      }),
    [allCards, filters],
  )

  if (loading) return <p className="loading-message">Loading collectables…</p>

  return (
    <div className="collectables-page">
      <header className="collectables-header">
        <h1 className="collectables-title">Collectables</h1>
        <p className="collectables-description">
          Live F1 grid plus multi-sport cards. Holographics = common art + holo filter. Click a card to flip.
        </p>
      </header>

      <div className="collectables-filters">
        <div className="filter-group">
          <label className="filter-label">Sport</label>
          <div className="filter-buttons">
            {(['all', 'f1', 'nba', 'nfl', 'mlb', 'soccer'] as const).map((sport) => (
              <button
                key={sport}
                className={`filter-button ${filters.sport === sport ? 'active' : ''}`}
                onClick={() => setFilters((p) => ({ ...p, sport }))}
              >
                {sport === 'all' ? 'All' : sport.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <label className="filter-label">Card Version</label>
          <div className="filter-buttons">
            {(['all', 'common', 'holographic', 'special'] as const).map((version) => (
              <button
                key={version}
                className={`filter-button ${filters.version === version ? 'active' : ''}`}
                onClick={() => setFilters((p) => ({ ...p, version }))}
              >
                {version === 'all' ? 'All Versions' : version}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="collectables-summary">
        <p className="summary-text">{filteredCards.length} cards found</p>
      </div>

      {filteredCards.length > 0 ? (
        <div className="collectables-grid">
          {filteredCards.map((card) => (
            <div key={card.id} className="collectables-card-wrapper">
              <TradingCard
                card={card}
                enableFlip
                href={card.sport === 'f1' ? `/driver/${card.athleteId}` : undefined}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="collectables-empty">
          <p>No cards found matching your filters.</p>
        </div>
      )}
    </div>
  )
}

export default CollectablesPage
