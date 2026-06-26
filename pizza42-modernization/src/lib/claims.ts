// Custom ID token claim set by the "Order History Enrichment" Login Action.
// Must stay in sync with the `namespace` constant in that Action's source.
export const ORDER_HISTORY_CLAIM = 'https://pizza42orders.com/order_history';

// Custom ID token claim set by the "Add Roles to Token" Login Action.
export const ROLES_CLAIM = 'https://pizza42orders.com/roles';

export const PIZZA_CHEF_ROLE = 'Pizza Chef';

// Custom ID token claim set by the "VIP Crust Club" Post-Login Action,
// granted once a customer has placed 5+ orders.
export const LOYALTY_TIER_CLAIM = 'https://pizza42orders.com/loyalty_tier';

export const GOLD_TIER = 'Gold';
export const GOLD_DISCOUNT_RATE = 0.1;
// Must stay in sync with the order-count check in the "VIP Crust Club" Action.
export const GOLD_ORDER_THRESHOLD = 5;

export type OrderHistoryEntry = {
  orderId: string;
  date: string;
  items: { name: string; qty: number }[];
  total: number;
  location: string;
  readyAt: string;
};
