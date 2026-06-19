"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { user, isLoading } = useUser();
  const { totalCount, openCart } = useCart();

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3"
    >
      <a href="/" className="flex items-center">
        <Image
          src="/pizza42textsliceinline.png"
          alt="Pizza 42"
          width={171}
          height={60}
          className="h-10 w-auto"
          priority
        />
      </a>

      <div className="flex items-center gap-5">
        {!isLoading && user ? (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-gray-700 sm:inline">
              Hi, {user.name?.split(" ")[0] ?? "there"}
            </span>
            <a
              href="/auth/logout"
              className="text-sm font-semibold text-gray-700 hover:text-red-600"
            >
              Sign out
            </a>
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
