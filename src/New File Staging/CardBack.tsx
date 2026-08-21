/**
 * Card Back Component
 * 
 * Renders the back side of a trading card.
 * Shows statistics and other detailed information.
 * Sport-agnostic: adapts to whatever stats are provided.
 */

import type { TradingCard, Sport } from '@/domain/tradingCard'

export interface CardBackProps {
  card: TradingCard
  sport: Sport
}

/**
 * Generic stat grid layout
 * Accepts any number of stats and arranges them responsively
 */
function StatGrid({ stats }: { stats: Array<{ label: string; value: string | number }> }) {
  return (
    <div className="card-stat-grid">
      {stats.map((stat) => (
        <div key={stat.label} className="card-stat">
          <strong className="card-stat-value">{stat.value}</strong>
          <span className="card-stat-label">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}

/**
 * F1-specific back (career record)
 */
function F1CardBack({ card }: { card: TradingCard }) {
  return (
    <div className="card-back-content card-back-f1">
      <div className="card-back-header">
        <div className="card-back-label">All-time record</div>
        <div className="card-back-name">{card.name}</div>
      </div>

      <StatGrid stats={card.stats} />

      <div className="card-back-footer">
        <span className="card-hint">Hover to flip</span>
      </div>
    </div>
  )
}

/**
 * Generic back layout for other sports
 */
function GenericCardBack({ card, sport }: { card: TradingCard; sport: Sport }) {
  const sportLabels: Record<Sport, string> = {
    f1: 'Career Stats',
    nba: 'Season Stats',
    nfl: 'Season Stats',
    mlb: 'Season Stats',
    soccer: 'Season Stats',
  }

  return (
    <div className="card-back-content card-back-generic">
      <div className="card-back-header">
        <div className="card-back-label">{sportLabels[sport]}</div>
        <div className="card-back-name">{card.name}</div>
      </div>

      {card.stats.length > 0 ? (
        <StatGrid stats={card.stats} />
      ) : (
        <div className="card-back-empty">
          <p>Stats coming soon</p>
        </div>
      )}

      {card.backText && (
        <div className="card-back-text">
          <p>{card.backText}</p>
        </div>
      )}

      <div className="card-back-footer">
        <span className="card-hint">Hover to flip</span>
      </div>
    </div>
  )
}

export function CardBack({ card, sport }: CardBackProps) {
  return (
    <div className="card-back-container">
      {sport === 'f1' ? (
        <F1CardBack card={card} />
      ) : (
        <GenericCardBack card={card} sport={sport} />
      )}
    </div>
  )
}
