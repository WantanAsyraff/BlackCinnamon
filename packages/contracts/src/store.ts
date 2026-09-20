/**
 * Store and payment domain contracts.
 *
 * Prices are always expressed in minor units (e.g. sen for MYR) and are
 * authoritative only when produced by the backend.
 */

export type Currency = 'MYR';

export type ProductType = 'rank' | 'cosmetic' | 'other';

export interface Money {
  /** Amount in minor units, e.g. 2490 === RM 24.90 */
  amountMinor: number;
  currency: Currency;
}

export interface RankFeature {
  label: string;
  value: string;
  sortOrder: number;
}

export interface Rank {
  slug: string;
  name: string;
  description: string;
  price: Money;
  /** Duration in seconds; null means permanent. */
  durationSeconds: number | null;
  features: RankFeature[];
}

export interface Product {
  slug: string;
  name: string;
  description: string;
  type: ProductType;
  price: Money;
  active: boolean;
}

export type OrderStatus =
  'PENDING_PAYMENT' | 'PAID' | 'FAILED' | 'EXPIRED' | 'CANCELLED' | 'REFUNDED';

export type PaymentStatus =
  'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED' | 'EXPIRED' | 'REFUNDED' | 'CANCELLED';

export type FulfilmentStatus = 'PENDING' | 'RETRYING' | 'DELIVERED' | 'FAILED';

export interface MinecraftIdentity {
  username: string;
  uuid: string;
  avatarUrl?: string | null;
}
