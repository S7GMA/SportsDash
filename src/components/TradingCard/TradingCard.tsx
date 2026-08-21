import { useState, useCallback, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import type { TradingCard as TradingCardData } from '@/domain/tradingCard'
import { CardFront } from './CardFront'
import { CardBack } from './CardBack'
import { CardSpecial } from './CardSpecial'
import { HolographicOverlay } from './HolographicOverlay'
import './TradingCard.css'

export interface TradingCardProps {
  card: TradingCardData
  href?: string
  onFlip?: () => void
  className?: string
  isOwned?: boolean
  showFavorite?: boolean
  onFavorite?: () => void
  enableFlip?: boolean
  actions?: React.ReactNode
}

export function TradingCard({
  card,
  href,
  onFlip,
  className,
  showFavorite,
  enableFlip = true,
  actions,
}: TradingCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 })
  const cardRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  const handleFlip = useCallback(
    (e?: React.MouseEvent) => {
      e?.preventDefault()
      e?.stopPropagation()
      if (!enableFlip) return
      setTilt({ rx: 0, ry: 0 })
      setIsFlipped((f) => !f)
      onFlip?.()
    },
    [enableFlip, onFlip],
  )

  const onMove = (e: React.MouseEvent) => {
    if (prefersReducedMotion || isFlipped || !cardRef.current) return
    const r = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    setTilt({ rx: y * 16, ry: x * -16 })
  }

  // Single transform on the 3D stage: flip OR anti-parallax tilt
  const stageTransform = isFlipped
    ? 'rotateY(180deg)'
    : prefersReducedMotion
      ? 'rotateY(0deg)'
      : `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`

  const cardClasses = [
    'trading',
    `trading-${card.version}`,
    `trading-sport-${card.sport}`,
    isFlipped && 'is-flipped',
    prefersReducedMotion && 'trading-no-motion',
    showFavorite && 'trading-with-actions',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={cardClasses}
      ref={cardRef}
      onClick={handleFlip}
      onKeyDown={(e) => {
        if ((e.code === 'Space' || e.code === 'Enter') && enableFlip) {
          e.preventDefault()
          handleFlip()
        }
      }}
      role={enableFlip ? 'button' : 'presentation'}
      tabIndex={enableFlip ? 0 : -1}
      aria-pressed={isFlipped}
      aria-label={`${card.name} card. Click to flip.`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseMove={onMove}
      onMouseLeave={() => {
        setIsHovering(false)
        setTilt({ rx: 0, ry: 0 })
      }}
    >
      <div
        className="trading-inner"
        style={{
          transform: stageTransform,
          transition: prefersReducedMotion ? 'none' : undefined,
        }}
      >
        <div className="trading-face trading-front">
          {card.version === 'special' ? (
            <CardSpecial card={card} isHovering={isHovering} />
          ) : (
            <CardFront card={card} sport={card.sport} />
          )}
          {card.version === 'holographic' && (
            <HolographicOverlay prefersReducedMotion={prefersReducedMotion} />
          )}
        </div>
        <div className="trading-face trading-back">
          <CardBack card={card} sport={card.sport} />
        </div>
      </div>
      {showFavorite && (
        <div className="trading-actions" onClick={(e) => e.stopPropagation()}>
          {actions}
        </div>
      )}
      {href && (
        <Link
          to={href}
          className="trading-detail-link"
          onClick={(e) => e.stopPropagation()}
          aria-label={`Open ${card.name}`}
        >
          Open
        </Link>
      )}
    </div>
  )
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )
  useEffect(() => {
    const media = window.matchMedia(query)
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [query])
  return matches
}

export type { TradingCardData }
