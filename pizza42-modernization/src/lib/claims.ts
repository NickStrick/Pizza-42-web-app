// Custom ID token claim set by the "Order History Enrichment" Login Action.
// Must stay in sync with the `namespace` constant in that Action's source.
export const ORDER_HISTORY_CLAIM = 'https://pizza42orders.com/order_history';

// Custom ID token claim set by the "Add Roles to Token" Login Action.
export const ROLES_CLAIM = 'https://pizza42orders.com/roles';

export const PIZZA_CHEF_ROLE = 'Pizza Chef';

export type OrderHistoryEntry = {
  orderId: string;
  date: string;
  items: { name: string; qty: number }[];
  total: number;
  location: string;
  readyAt: string;
};
