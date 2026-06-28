"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";

type CheckoutModalProps = {
  total: number;
  isSubmitting: boolean;
  onSubmit: () => void;
  onClose: () => void;
};

// Formats only — these fields are never sent anywhere. The "payment" here is
// purely a UI simulation so the checkout flow feels real without us having to
// handle (or even touch) actual card data.
function formatCardNumber(value: string) {
  return value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

export default function CheckoutModal({ total, isSubmitting, onSubmit, onClose }: CheckoutModalProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isValid =
    cardNumber.replace(/\s/g, "").length === 16 &&
    /^\d{2}\/\d{2}$/.test(expiry) &&
    cvc.length === 3;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      setError("Fill in valid card details to continue.");
      return;
    }
    setError(null);
    onSubmit();
  };

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

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Checkout</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout"
            className="text-2xl leading-none text-gray-500"
          >
            &times;
          </button>
        </div>
        <p className="mb-4 text-xs text-gray-500">
          Simulated checkout for demo purposes — no real payment is processed and no card data is stored.
        </p>

        <label className="mb-3 block text-sm">
          <span className="mb-1 block font-semibold text-gray-700">Card number</span>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            required
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            placeholder="4242 4242 4242 4242"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-red-500 focus:outline-none"
          />
        </label>

        <div className="mb-4 flex gap-3">
          <label className="flex-1 text-sm">
            <span className="mb-1 block font-semibold text-gray-700">Expiry</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              required
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              placeholder="MM/YY"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-red-500 focus:outline-none"
            />
          </label>
          <label className="flex-1 text-sm">
            <span className="mb-1 block font-semibold text-gray-700">CVC</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              required
              value={cvc}
              onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 3))}
              placeholder="123"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-red-500 focus:outline-none"
            />
          </label>
        </div>

        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-red-600 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {isSubmitting ? "Processing Order..." : `Pay · $${total.toFixed(2)}`}
        </button>
      </motion.form>
    </div>
  );
}
