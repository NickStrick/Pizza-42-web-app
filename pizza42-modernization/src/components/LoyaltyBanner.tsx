"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { useOrderHistory } from "@/context/OrderHistoryContext";
import { GOLD_ORDER_THRESHOLD, GOLD_TIER, LOYALTY_TIER_CLAIM } from "@/lib/claims";

export default function LoyaltyBanner({ className = "" }: { className?: string }) {
  const { user } = useUser();
  const { orderHistory } = useOrderHistory();

  if (!user) return null;

  const isGold = user[LOYALTY_TIER_CLAIM] === GOLD_TIER;
  const ordersUntilGold = GOLD_ORDER_THRESHOLD - orderHistory.length;

  return (
    <div className={`bg-amber-50 px-6 py-3 text-center text-sm font-semibold text-amber-700 ${className}`}>
      {isGold ? (
        <span>👑 VIP Crust Club · Gold member discount applied</span>
      ) : (
        <span>
          🍕 VIP Crust Club:{" "}
          {ordersUntilGold > 0
            ? `${ordersUntilGold} more order${ordersUntilGold === 1 ? "" : "s"} until 10% off every order`
            : "Order again to unlock 10% off!"}
        </span>
      )}
    </div>
  );
}
