/**
 * DriverCard Component (Backward Compatibility Wrapper)
 * 
 * Wraps the generic TradingCard component to maintain backward compatibility
 * with existing code that imports DriverCard.
 * 
 * This allows:
 * 1. Existing pages to continue working without changes
 * 2. Gradual migration to generic TradingCard
 * 3. Testing the new system in parallel
 * 
 * DEPRECATED: Use TradingCard directly for new code.
 * This wrapper will be removed in a future version.
 */

import { HeartButton } from '@/components/HeartButton'
import { TradingCard } from './TradingCard'
import { createF1DriverCard } from '@/domain/tradingCard'
import type { DbsDriver, CareerRecord } from '@/domain/dbs'

export interface DriverCardProps {
  driver: DbsDriver
  career?: CareerRecord
}

/**
 * Renders a driver card using the new generic TradingCard system
 * Maintains the existing API and behavior
 */
export function DriverCard({ driver, career }: DriverCardProps) {
  // Convert DbsDriver to TradingCard format
  const tradingCard = createF1DriverCard(driver, 'common')

  // Keep season stats first (front of card), append career for the back
  if (career) {
    tradingCard.stats = [
      { label: 'Position', value: driver.season.position },
      { label: 'Points', value: driver.season.points },
      { label: 'Wins', value: driver.season.wins },
      { label: 'Races', value: career.races ?? '—' },
      { label: 'Podiums', value: career.podiums ?? '—' },
      { label: 'Poles', value: career.poles ?? '—' },
      { label: 'Titles', value: career.championships ?? '—' },
      { label: 'Career Pts', value: career.points ?? '—' },
    ]
  }

  return (
    <TradingCard
      card={tradingCard}
      href={`/driver/${driver.id}`}
      showFavorite
      actions={<HeartButton type="driver" refId={driver.id} name={driver.name} />}
      enableFlip
    />
  )
}

