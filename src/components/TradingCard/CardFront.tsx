/**
 * Card Front Component
 * 
 * Renders the front side of a trading card.
 * Common and holographic cards use the same front rendering,
 * with holographic adding a CSS overlay effect.
 */

import { useEffect, useMemo, useState } from 'react'
import type { TradingCard, Sport } from '@/domain/tradingCard'
import { localCardCandidates } from '@/lib/cardAssets'

export interface CardFrontProps {
  card: TradingCard
  sport: Sport
}

const FALLBACK: Record<Sport, string> = {
  f1: '/brand/helmet.svg',
  nba: '/brand/basketball-icon.svg',
  nfl: '/brand/football-icon.svg',
  mlb: '/brand/baseball-icon.svg',
  soccer: '/brand/soccer-icon.svg',
}

/** Local `/cards/{athleteId}.*` first, then remote URL, then sport icon */
function CardPortrait({
  athleteId,
  src,
  alt,
  sport,
}: {
  athleteId: string
  src?: string
  alt: string
  sport: Sport
}) {
  const candidates = useMemo(() => {
    const list = [...localCardCandidates(athleteId)]
    if (src) list.push(src)
    list.push(FALLBACK[sport])
    return list
  }, [athleteId, src, sport])

  const [idx, setIdx] = useState(0)
  useEffect(() => setIdx(0), [athleteId, src])
  const current = candidates[Math.min(idx, candidates.length - 1)]
  const isFallback = current === FALLBACK[sport]

  return (
    <img
      src={current}
      alt={isFallback ? '' : alt}
      referrerPolicy="no-referrer"
      decoding="async"
      loading="lazy"
      onError={() => setIdx((i) => Math.min(i + 1, candidates.length - 1))}
      className={isFallback ? 'card-portrait card-portrait-fallback' : 'card-portrait card-portrait-photo'}
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
      <CardPortrait athleteId={card.athleteId} src={card.imageUrl} alt={card.name} sport="f1" />

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
      <CardPortrait athleteId={card.athleteId} src={card.imageUrl} alt={card.name} sport={card.sport} />

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
