"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { lines, updateQuantity, subtotal, isOpen, closeCart } = useCart();
  const { user } = useUser();

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
              <div className="mb-4 flex items-center justify-between text-base font-bold text-gray-900">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {user ? (
                <button
                  disabled={lines.length === 0}
                  className="w-full rounded-full bg-red-600 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                >
                  Place Order &middot; ${subtotal.toFixed(2)}
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
    </AnimatePresence>
  );
}
