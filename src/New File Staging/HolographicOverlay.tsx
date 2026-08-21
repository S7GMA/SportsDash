/**
 * Holographic Overlay Component
 * 
 * Adds a premium holographic shimmer effect to cards.
 * Uses CSS animations for performance.
 * Respects prefers-reduced-motion for accessibility.
 */

export interface HolographicOverlayProps {
  prefersReducedMotion: boolean
}

export function HolographicOverlay({ prefersReducedMotion }: HolographicOverlayProps) {
  return (
    <>
      {/* Main holographic shimmer effect */}
      <div
        className="holographic-shimmer"
        style={{
          animation: prefersReducedMotion ? 'none' : 'holographic-shimmer 4s ease-in-out infinite',
        }}
        role="presentation"
        aria-hidden="true"
      />

      {/* Secondary iridescent light effect */}
      <div
        className="holographic-light"
        style={{
          animation: prefersReducedMotion ? 'none' : 'holographic-light 6s ease-in-out infinite',
        }}
        role="presentation"
        aria-hidden="true"
      />

      {/* Optional: rainbow gradient sweep on hover */}
      <div
        className="holographic-rainbow"
        style={{
          animation: prefersReducedMotion ? 'none' : 'holographic-rainbow 8s linear infinite',
        }}
        role="presentation"
        aria-hidden="true"
      />

      {/* Static holographic texture (always visible) */}
      <div className="holographic-texture" role="presentation" aria-hidden="true" />
    </>
  )
}

/**
 * Exported function to handle holographic card detection
 * Used in card version branching
 */
export function isHolographicCard(version: string): boolean {
  return version === 'holographic'
}
