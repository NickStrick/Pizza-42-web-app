"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useCart } from "@/context/CartContext";
import { useOrderHistory } from "@/context/OrderHistoryContext";
import LoyaltyBanner from "@/components/LoyaltyBanner";
import CheckoutModal from "@/components/CheckoutModal";
import { GOLD_DISCOUNT_RATE, GOLD_TIER, LOYALTY_TIER_CLAIM, type OrderHistoryEntry } from "@/lib/claims";

type OrderResult =
  | { status: "success"; order: OrderHistoryEntry }
  | { status: "error"; message: string };

export default function CartDrawer() {
  const { lines, updateQuantity, subtotal, clearCart, isOpen, closeCart } = useCart();
  const { user } = useUser();
  const { addOrder } = useOrderHistory();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  const isGold = user?.[LOYALTY_TIER_CLAIM] === GOLD_TIER;
  const discount = isGold ? subtotal * GOLD_DISCOUNT_RATE : 0;
  const total = subtotal - discount;

  const handleCheckout = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({ name: l.item.name, qty: l.quantity })),
          total,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        addOrder(data.order);
        clearCart();
        closeCart();
        setShowCheckout(false);
        setOrderResult({ status: "success", order: data.order });
      } else {
        setOrderResult({ status: "error", message: data.error });
      }
    } catch {
      setOrderResult({ status: "error", message: "Network request failed." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-black/40"
            onClick={closeCart}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative flex h-full w-full max-w-md flex-col bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h2 className="text-lg font-bold text-gray-900">Your Order</h2>
              <button onClick={closeCart} aria-label="Close cart" className="text-2xl leading-none">
                &times;
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {lines.length === 0 ? (
                <p className="mt-10 text-center text-sm text-gray-500">
                  Your cart is empty. Add a pizza to get started!
                </p>
              ) : (
                <ul className="flex flex-col gap-4">
                  {lines.map(({ item, quantity }) => (
                    <li key={item.id} className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, quantity - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-gray-400 text-base font-bold text-gray-900 hover:bg-gray-100"
                        >
                          &minus;
                        </button>
                        <span className="w-5 text-center text-sm font-semibold text-gray-900">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, quantity + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-gray-400 text-base font-bold text-gray-900 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t border-gray-200 px-5 py-4">
              <LoyaltyBanner className="mb-3 rounded-lg text-xs" />

              <div className="mb-1 flex items-center justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {isGold && (
                <div className="mb-1 flex items-center justify-between text-sm font-semibold text-amber-600">
                  <span>Gold discount (10%)</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="mb-4 flex items-center justify-between text-base font-bold text-gray-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              {user ? (
                <button
                  disabled={lines.length === 0 || !user.email_verified || isSubmitting}
                  onClick={() => setShowCheckout(true)}
                  className="w-full rounded-full bg-red-600 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                >
                  {isSubmitting
                    ? "Processing Order..."
                    : user.email_verified
                      ? `Place Order · $${total.toFixed(2)}`
                      : "Verify Email to Place Order 🔒"}
                </button>
              ) : (
                <a
                  href="/auth/login"
                  className="block w-full rounded-full bg-black py-3 text-center text-sm font-bold text-white hover:opacity-90"
                >
                  Sign in to Checkout
                </a>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {showCheckout && (
        <CheckoutModal
          total={total}
          isSubmitting={isSubmitting}
          onSubmit={handleCheckout}
          onClose={() => setShowCheckout(false)}
        />
      )}

      {orderResult && (
        <OrderResultModal result={orderResult} onClose={() => setOrderResult(null)} />
      )}
    </AnimatePresence>
  );
}

function OrderResultModal({
  result,
  onClose,
}: {
  result: OrderResult;
  onClose: () => void;
}) {
  const isSuccess = result.status === "success";

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl"
      >
        <div
          className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full text-2xl ${
            isSuccess ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {isSuccess ? "🍕" : "❌"}
        </div>

        <h2 className="mb-1 text-lg font-bold text-gray-900">
          {isSuccess ? "Order placed!" : "Order failed"}
        </h2>

        {isSuccess ? (
          <>
            <p className="mb-4 text-sm font-semibold text-red-600">
              Ready by {new Date(result.order.readyAt).toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>

            <div className="mb-5 rounded-xl bg-gray-50 p-4 text-left">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Order Summary
              </p>
              <ul className="mb-3 flex flex-col gap-1">
                {result.order.items.map((item, i) => (
                  <li key={i} className="flex justify-between text-sm text-gray-700">
                    <span>{item.qty}x {item.name}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between border-t border-gray-200 pt-2 text-sm font-bold text-gray-900">
                <span>Total</span>
                <span>${result.order.total.toFixed(2)}</span>
              </div>
              <p className="mt-3 text-xs text-gray-500">📍 {result.order.location}</p>
              <p className="mt-1 text-xs text-gray-400">Order ID: {result.order.orderId}</p>
            </div>
          </>
        ) : (
          <p className="mb-5 text-sm text-gray-500">{result.message}</p>
        )}

        <button
          onClick={onClose}
          className="w-full rounded-full bg-black py-2.5 text-sm font-bold text-white hover:opacity-90"
        >
          Done
        </button>
      </motion.div>
    </div>
  );
}
