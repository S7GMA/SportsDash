/**
 * Card Front Component
 * 
 * Renders the front side of a trading card.
 * Common and holographic cards use the same front rendering,
 * with holographic adding a CSS overlay effect.
 */

import { useState } from 'react'
import type { TradingCard, Sport } from '@/domain/tradingCard'

export interface CardFrontProps {
  card: TradingCard
  sport: Sport
}

/**
 * Renders athlete portrait with fallback handling
 */
function CardPortrait({ src, alt }: { src?: string; alt: string }) {
  const [broken, setBroken] = useState(false)
  const showPhoto = Boolean(src) && !broken

  if (showPhoto) {
    return (
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        decoding="async"
        loading="lazy"
        onError={() => setBroken(true)}
        className="card-portrait card-portrait-photo"
      />
    )
  }

  // Fallback: generic sport icon/helmet
  const fallbackIcons: Record<Sport, string> = {
    f1: '/brand/helmet.svg',
    nba: '/brand/basketball-icon.svg',
    nfl: '/brand/football-icon.svg',
    mlb: '/brand/baseball-icon.svg',
    soccer: '/brand/soccer-icon.svg',
  }

  return (
    <img
      src={fallbackIcons[sport]}
      alt="Sport icon"
      className="card-portrait card-portrait-fallback"
    />
  )
}

/**
 * Sport-specific front rendering
 * Allows for different layouts/styling per sport while maintaining structure
 */
function F1CardFront({ card }: { card: TradingCard }) {
  return (
    <>
      {/* Team crest/logo (top right) */}
      <img
        src="/brand/dannyboy-logo.png"
        alt={card.team || 'Team'}
        className="card-crest"
      />

      {/* Number (top left) */}
      <div className="card-number-section">
        <div className="card-team-label">{card.team}</div>
        <div className="card-number">{String(card.number || '').padStart(2, '0')}</div>
      </div>

      {/* Portrait (center) */}
      <CardPortrait src={card.imageUrl} alt={card.name} />

      {/* Name and season stats (bottom) */}
      <div className="card-footer">
        <div className="card-code-line">
          {/* Sport code (e.g., driver code) - adjust per sport */}
          <span className="card-code">F1</span>
          <span className="card-position">P{card.stats[0]?.value || '—'}</span>
        </div>
        <div className="card-name">{card.name}</div>
        <div className="card-subtext">
          {card.stats
            .slice(1, 3)
            .map((s) => s.value)
            .join(' · ')}
        </div>
      </div>
    </>
  )
}

/**
 * Generic card front for non-F1 sports
 */
function GenericCardFront({ card }: { card: TradingCard }) {
  return (
    <>
      {/* Sport logo/crest (top right) */}
      {card.teamLogo && (
        <img src={card.teamLogo} alt={card.team || 'Team'} className="card-crest" />
      )}

      {/* Team badge (top left) */}
      {card.team && (
        <div className="card-team-badge">
          <span className="card-team-label">{card.team}</span>
          {card.number && <span className="card-position">#{card.number}</span>}
        </div>
      )}

      {/* Portrait (center) */}
      <CardPortrait src={card.imageUrl} alt={card.name} />

      {/* Name and stats (bottom) */}
      <div className="card-footer">
        {card.position && (
          <div className="card-position-label">{card.position}</div>
        )}
        <div className="card-name">{card.name}</div>

        {/* Show first few stats */}
        {card.stats.length > 0 && (
          <div className="card-stat-line">
            {card.stats
              .slice(0, 2)
              .map((s) => `${s.label}: ${s.value}`)
              .join(' · ')}
          </div>
        )}
      </div>
    </>
  )
}

export function CardFront({ card, sport }: CardFrontProps) {
  // Apply sport-specific styling through CSS classes
  const frontClasses = ['card-front-content', `card-sport-${sport}`].join(' ')

  return (
    <div
      className={frontClasses}
      style={{
        background: `linear-gradient(180deg, ${card.teamColor} 0%, #16382c 58%)`,
      }}
    >
      {/* Sport-specific rendering */}
      {sport === 'f1' ? (
        <F1CardFront card={card} />
      ) : (
        <GenericCardFront card={card} />
      )}

      {/* Texture/grain overlay for premium feel (optional) */}
      <div className="card-texture" />
    </div>
  )
}
