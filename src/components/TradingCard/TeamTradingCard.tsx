/**
 * Team Trading Card Component
 * 
 * Simpler card layout for teams/constructors.
 * Uses a vertical layout with logo, name, and metadata.
 * 
 * Not part of the 3D flip system - these are display cards only.
 */

import { Link } from 'react-router-dom'
import { HeartButton } from '@/components/HeartButton'
import './TeamTradingCard.css'

export interface TeamTradingCardProps {
  name: string
  logo?: string
  color: string
  meta: string
  href: string
  type: 'team' | 'league'
  refId: string
}

export function TeamTradingCard({
  name,
  logo,
  color,
  meta,
  href,
  type,
  refId,
}: TeamTradingCardProps) {
  return (
    <Link to={href} className="team-card" style={{ display: 'block' }}>
      <div className="team-card-inner">
        {/* Logo area */}
        <div className="team-card-logo-area" style={{ background: `linear-gradient(180deg, ${color}, #16382c)` }}>
          {logo ? (
            <img src={logo} alt={name} className="team-card-logo" />
          ) : (
            <img src="/brand/dannyboy-logo.png" alt="" className="team-card-fallback-logo" />
          )}
        </div>

        {/* Info area */}
        <div className="team-card-info">
          <h3 className="team-card-name">{name}</h3>
          <p className="team-card-meta">{meta}</p>
          <div className="team-card-action">
            <HeartButton type={type} refId={refId} name={name} />
          </div>
        </div>
      </div>
    </Link>
  )
}
