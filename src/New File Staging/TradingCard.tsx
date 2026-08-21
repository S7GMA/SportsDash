/**
 * Generic Trading Card Component
 * 
 * Renders trading cards for any sport, any athlete, any card version.
 * Supports:
 * - Common cards (standard athlete image)
 * - Holographic cards (animated shimmer effect)
 * - Special cards (custom art, highlights, animations)
 * 
 * Does NOT handle:
 * - Data loading
 * - Routing/navigation
 * - Authentication/ownership
 * - API calls
 * 
 * Those concerns are handled by consumer components.
 */

import { useState, useCallback, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import type { TradingCard as TradingCardData, CardVersion } from '@/domain/tradingCard'
import { CardFront } from './CardFront'
import { CardBack } from './CardBack'
import { CardSpecial } from './CardSpecial'
import { HolographicOverlay } from './HolographicOverlay'
import './TradingCard.css'

export interface TradingCardProps {
  /** The card data */
  card: TradingCardData

  /** Optional: link to detail page (e.g., /driver/max-verstappen) */
  href?: string

  /** Optional: called when card is interacted with */
  onFlip?: () => void

  /** Optional: custom class name */
  className?: string

  /** Optional: whether user owns this card */
  isOwned?: boolean

  /** Optional: show heart/favorite button */
  showFavorite?: boolean
  onFavorite?: () => void

  /** Optional: enable 3D flip animation */
  enableFlip?: boolean

  /** Optional: action buttons (favorite, trade, etc.) */
  actions?: React.ReactNode
}

export function TradingCard({
  card,
  href,
  onFlip,
  className,
  isOwned,
  showFavorite,
  onFavorite,
  enableFlip = true,
  actions,
}: TradingCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle flip animation
  const handleFlip = useCallback(() => {
    if (enableFlip) {
      setIsFlipped(!isFlipped)
      onFlip?.()
    }
  }, [isFlipped, enableFlip, onFlip])

  // Handle keyboard accessibility (Space/Enter to flip)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.code === 'Space' || e.code === 'Enter') && enableFlip) {
        e.preventDefault()
        handleFlip()
      }
    },
    [enableFlip, handleFlip]
  )

  // Respect prefers-reduced-motion
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  const cardClasses = [
    'trading',
    `trading-${card.version}`,
    `trading-sport-${card.sport}`,
    isFlipped && 'trading-flipped',
    prefersReducedMotion && 'trading-no-motion',
    showFavorite && 'trading-with-actions',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const innerContent = (
    <div
      className={cardClasses}
      ref={containerRef}
      onClick={handleFlip}
      onKeyDown={handleKeyDown}
      role={enableFlip ? 'button' : 'presentation'}
      tabIndex={enableFlip ? 0 : -1}
      aria-pressed={isFlipped}
      aria-label={`${card.name} ${card.version} card${isFlipped ? ', back side' : ''}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="trading-inner">
        {/* Front of card */}
        <div className="trading-face trading-front">
          {/* Holographic effect overlay (renders on top) */}
          {card.version === 'holographic' && (
            <HolographicOverlay prefersReducedMotion={prefersReducedMotion} />
          )}

          {/* Special card treatment (replaces normal content) */}
          {card.version === 'special' ? (
            <CardSpecial card={card} isHovering={isHovering} />
          ) : (
            <CardFront card={card} sport={card.sport} />
          )}
        </div>

        {/* Back of card */}
        {enableFlip && (
          <div className="trading-face trading-back">
            <CardBack card={card} sport={card.sport} />
          </div>
        )}
      </div>

      {/* Favorite/action overlay */}
      {showFavorite && (
        <div className="trading-actions">
          {actions}
        </div>
      )}
    </div>
  )

  // Wrap in link if href is provided
  if (href) {
    return (
      <Link to={href} className="trading-link" style={{ display: 'block' }}>
        {innerContent}
      </Link>
    )
  }

  return innerContent
}

/**
 * Hook to detect prefers-reduced-motion
 */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const media = window.matchMedia(query)
    
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches)
    }

    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [query])

  return matches
}

export type { TradingCardData }
