"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useCart } from "@/context/CartContext";
import { useOrderHistory } from "@/context/OrderHistoryContext";
import { PIZZA_CHEF_ROLE, ROLES_CLAIM, type OrderHistoryEntry } from "@/lib/claims";

export default function Header() {
  const { user, isLoading } = useUser();
  const { totalCount, openCart } = useCart();
  const { orderHistory } = useOrderHistory();
  const [showOrders, setShowOrders] = useState(false);
  const isChef = (user?.[ROLES_CLAIM] ?? []).includes(PIZZA_CHEF_ROLE);
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3"
    >
      <div className="flex items-center gap-5">
        <Link href="/" className="flex items-center">
          <Image
            src="/pizza42textsliceinline.png"
            alt="Pizza 42"
            width={171}
            height={60}
            className="h-10 w-auto"
            priority
          />
        </Link>

        {isChef && (
          <Link
            href="/kitchen"
            className="text-sm font-semibold text-gray-700 hover:text-red-600"
          >
            Kitchen
          </Link>
        )}
      </div>

      <div className="flex items-center gap-5">
        {!isLoading && user ? (
          <div className="relative flex items-center gap-3">
            <span className="hidden text-sm text-gray-700 sm:inline">
              Hi, {user.name?.split(" ")[0] ?? "there"}
            </span>
            <button
              onClick={() => setShowOrders((open) => !open)}
              className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-red-600"
            >
              Orders
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`text-xs transition-transform ${showOrders ? "rotate-180" : ""}`}
              />
            </button>
            <a
              href="/auth/logout"
              className="text-sm font-semibold text-gray-700 hover:text-red-600"
            >
              Sign out
            </a>

            <AnimatePresence>
              {showOrders && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-10 z-50 w-72 rounded-lg border border-gray-200 bg-white p-3 shadow-lg"
                >
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Order History
                  </p>
                  {orderHistory.length === 0 ? (
                    <p className="text-sm text-gray-500">No past orders yet.</p>
                  ) : (
                    <ul className="flex max-h-64 flex-col gap-2 overflow-y-auto">
                      {orderHistory.map((order) => (
                        <OrderHistoryItem key={order.orderId} order={order} />
                      ))}
                    </ul>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <a
            href="/auth/login"
            className="text-sm font-semibold text-gray-700 hover:text-red-600"
          >
            Sign in
          </a>
        )}

        <button
          onClick={openCart}
          aria-label="Open cart"
          className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-500 bg-white text-gray-900 hover:bg-gray-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          {totalCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
              {totalCount}
            </span>
          )}
        </button>
      </div>
    </motion.header>
  );
}

function OrderHistoryItem({ order }: { order: OrderHistoryEntry }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <li className="text-sm text-gray-700">
      <div className="flex justify-between">
        <span className="font-semibold text-gray-900">
          {order.items.map((i) => `${i.qty}x ${i.name}`).join(", ")}
        </span>
        <span className="font-semibold text-gray-900">${order.total.toFixed(2)}</span>
      </div>
      <p className="text-xs text-gray-500">{new Date(order.date).toLocaleString()}</p>

      <button
        onClick={() => setShowDetails((open) => !open)}
        className="mt-1 text-xs font-semibold text-gray-500 hover:text-red-600"
      >
        {showDetails ? "Hide details" : "Details"}
      </button>

      {showDetails && (
        <p className="mt-1 text-xs text-gray-400">Order ID: {order.orderId}</p>
      )}
    </li>
  );
}
