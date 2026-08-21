/**
 * Card Special Component
 * 
 * Renders special/rare card variants:
 * - custom-art: Uses custom artwork instead of athlete photo
 * - highlight: Shows a video highlight on hover
 * - animated: Displays animated artwork
 * 
 * Each type can be extended with new treatments without rewriting card logic.
 */

import { useState, useRef, useEffect } from 'react'
import type { TradingCard } from '@/domain/tradingCard'

export interface CardSpecialProps {
  card: TradingCard
  isHovering: boolean
}

/**
 * Custom art variant
 * Displays custom artwork with athlete name overlay
 */
function CustomArtCard({ card }: { card: TradingCard }) {
  const [imageBroken, setImageBroken] = useState(false)

  // Fallback to regular image if custom art fails
  const imageUrl = !imageBroken ? card.customArtUrl : card.imageUrl

  return (
    <div className="card-special-content card-special-custom-art">
      <img
        src={imageUrl}
        alt={card.name}
        onError={() => setImageBroken(true)}
        className="card-special-image"
        style={{ objectFit: 'cover' }}
      />

      {/* Name overlay */}
      <div className="card-special-overlay">
        <div className="card-special-badge">SPECIAL</div>
        <div className="card-special-name">{card.name}</div>
      </div>

      {/* Gradient fade at bottom */}
      <div className="card-special-fade" />
    </div>
  )
}

/**
 * Highlight video variant
 * Shows video on hover, pauses/resets when not hovering
 */
function HighlightCard({ card, isHovering }: { card: TradingCard; isHovering: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  // Play on hover, pause on leave
  useEffect(() => {
    if (!videoRef.current) return

    if (isHovering) {
      // Lazy load video when user hovers
      if (!videoRef.current.src && card.highlightVideoUrl) {
        videoRef.current.src = card.highlightVideoUrl
      }
      videoRef.current.play().catch(() => {
        // Silently fail if autoplay blocked or media unavailable
      })
    } else {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }, [isHovering, card.highlightVideoUrl])

  return (
    <div className="card-special-content card-special-highlight">
      {/* Show static image by default */}
      {!isHovering && (
        <img
          src={card.imageUrl}
          alt={card.name}
          className="card-special-static-image"
        />
      )}

      {/* Video plays on hover (lazy loaded) */}
      <video
        ref={videoRef}
        className="card-special-video"
        style={{
          opacity: isHovering ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
        muted
        playsInline
        // Do NOT set src here - it's set on hover for lazy loading
      />

      {/* Name always visible */}
      <div className="card-special-overlay">
        <div className="card-special-badge">HIGHLIGHT</div>
        <div className="card-special-name">{card.name}</div>
      </div>

      {/* Gradient fade */}
      <div className="card-special-fade" />
    </div>
  )
}

/**
 * Animated artwork variant
 * Displays animated artwork (CSS-based or giflike)
 */
function AnimatedCard({ card }: { card: TradingCard }) {
  const [imageBroken, setImageBroken] = useState(false)

  const imageUrl = !imageBroken ? card.animatedArtUrl : card.imageUrl

  return (
    <div className="card-special-content card-special-animated">
      {/* Animated image/GIF */}
      <img
        src={imageUrl}
        alt={card.name}
        onError={() => setImageBroken(true)}
        className="card-special-animated-image"
      />

      {/* Apply custom animation if provided */}
      {card.animationCss && (
        <style>{`
          .card-special-animated-image {
            ${card.animationCss}
          }
        `}</style>
      )}

      {/* Name overlay */}
      <div className="card-special-overlay">
        <div className="card-special-badge">ANIMATED</div>
        <div className="card-special-name">{card.name}</div>
      </div>

      {/* Gradient fade */}
      <div className="card-special-fade" />
    </div>
  )
}

/**
 * Route to correct special card renderer
 */
export function CardSpecial({ card, isHovering }: CardSpecialProps) {
  // Ensure this is actually a special card
  if (card.version !== 'special') {
    return null
  }

  const specialType = card.specialType

  switch (specialType) {
    case 'custom-art':
      return <CustomArtCard card={card} />
    case 'highlight':
      return <HighlightCard card={card} isHovering={isHovering} />
    case 'animated':
      return <AnimatedCard card={card} />
    default:
      // Fallback to custom art if type is unknown
      return <CustomArtCard card={card} />
  }
}

/**
 * Type guard for special card types
 */
export function isSpecialCardType(
  type: string | null | undefined
): type is 'custom-art' | 'highlight' | 'animated' {
  return type === 'custom-art' || type === 'highlight' || type === 'animated'
}
