/**
 * Trading Card System - Unified Exports
 *
 * import { TradingCard, DriverCard, TeamTradingCard } from '@/components/TradingCard'
 * import type { TradingCardData } from '@/components/TradingCard'
 */

export { TradingCard } from './TradingCard';
export type { TradingCardProps } from './TradingCard';

export { CardFront } from './CardFront';
export { CardBack } from './CardBack';
export { CardSpecial } from './CardSpecial';
export { HolographicOverlay } from './HolographicOverlay';

export { DriverCard } from './DriverCard';
export { TeamTradingCard } from './TeamTradingCard';

export type {
  TradingCard as TradingCardData,
  Sport,
  CardVersion,
  SpecialCardType,
} from '@/domain/tradingCard';
