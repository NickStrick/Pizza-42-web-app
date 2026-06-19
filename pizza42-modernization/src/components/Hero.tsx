"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Hero() {
  const [fulfillment, setFulfillment] = useState<"delivery" | "pickup">("pickup");

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative h-56 w-full overflow-hidden sm:h-72"
      >
        <Image
          src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1600&q=80"
          alt="Fresh Pizza 42 pizza"
          fill
          priority
          className="object-cover"
        />
      </motion.div>

      <div className="mx-auto flex max-w-300 flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
        >
          <h1 className="flex items-center gap-2">
            <Image src="/pizza42text.png" alt="Pizza 42" width={142} height={63} className="h-20 w-auto" />
            <span className="text-2xl font-extrabold text-gray-900">- Downtown</span>
          </h1>
          <p className="text-sm text-gray-600">100 Main Street, Springfield, IL</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col gap-3 sm:items-end"
        >
          <div className="flex rounded-full bg-gray-100 p-1">
            <button
              onClick={() => setFulfillment("delivery")}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                fulfillment === "delivery" ? "bg-white shadow text-gray-900" : "text-gray-500"
              }`}
            >
              🛵 Delivery
            </button>
            <button
              onClick={() => setFulfillment("pickup")}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                fulfillment === "pickup" ? "bg-white shadow text-gray-900" : "text-gray-500"
              }`}
            >
              🛍️ Pickup
            </button>
          </div>
          <p className="text-sm text-gray-600">
            {fulfillment === "pickup" ? (
              <>
                Pickup from <span className="font-semibold">100 Main Street</span> &middot;
                ASAP &middot; 15-20 min
              </>
            ) : (
              <>
                Delivery to your address &middot; ASAP &middot; 30-40 min
              </>
            )}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
