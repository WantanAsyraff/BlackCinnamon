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

export type EntitlementType = 'RANK' | 'COSMETIC' | 'OTHER';

export type EntitlementStatus = 'ACTIVE' | 'PENDING_DELIVERY' | 'EXPIRED' | 'REVOKED';

export interface MinecraftIdentity {
  username: string;
  uuid: string;
  avatarUrl?: string | null;
}

export interface CheckoutRequest {
  productSlug: string;
  minecraftUsername: string;
  email: string;
  phone?: string;
}

export interface OrderItemView {
  productSlug: string | null;
  productName: string;
  unitPriceMinor: number;
  quantity: number;
}

export interface OrderView {
  publicId: string;
  status: OrderStatus;
  currency: Currency;
  subtotalMinor: number;
  totalMinor: number;
  items: OrderItemView[];
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutResponse {
  order: OrderView;
  payment: {
    billCode: string | null;
    /** External ToyyibPay redirect URL. Null when the bill could not be created. */
    redirectUrl: string | null;
  };
}

export interface PaymentStatusView {
  orderPublicId: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus | null;
}

export interface RankComparisonRank {
  slug: string;
  name: string;
  values: (string | number | boolean | null)[];
}

export interface RankComparison {
  /** Ordered feature labels used as comparison rows. */
  features: string[];
  ranks: RankComparisonRank[];
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  startsAt: string | null;
  endsAt: string | null;
}
