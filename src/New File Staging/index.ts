/**
 * Trading Card System - Unified Exports
 * 
 * Import from this file for clean imports:
 * 
 * import { TradingCard, DriverCard, TeamTradingCard } from '@/components/TradingCard'
 * import type { TradingCard as TradingCardType } from '@/components/TradingCard'
 */

// Main components
export { TradingCard } from './TradingCard'
export type { TradingCardProps } from './TradingCard'

// Card content components
export { CardFront } from './CardFront'
export { CardBack } from './CardBack'
export { CardSpecial } from './CardSpecial'
export { HolographicOverlay } from './HolographicOverlay'

// Compatibility wrappers
export { DriverCard } from './DriverCard'
export { TeamTradingCard } from './TeamTradingCard'

// Types
export type { TradingCard as TradingCardData } from '@/domain/tradingCard'
export type { Sport, CardVersion, SpecialCardType, TradingCard } from '@/domain/tradingCard'
