"use client";

import { useState } from "react";
import Image from "next/image";
import type { MenuItem } from "@/data/menu";

export default function KitchenMenuEditor({ initialMenu }: { initialMenu: MenuItem[] }) {
  const [menu, setMenu] = useState<MenuItem[]>(initialMenu);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggleAvailability = async (id: string) => {
    const target = menu.find((item) => item.id === id);
    if (!target) return;
    const nextAvailable = !target.available;

    setMenu((prev) => prev.map((item) => (item.id === id ? { ...item, available: nextAvailable } : item)));
    setSavingId(id);
    setError(null);

    try {
      const response = await fetch("/api/menu", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, available: nextAvailable }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to save menu");
      }
      // Adopt the server's copy so any fields we don't track locally
      // (like totalOrdered) stay accurate after the round trip.
      setMenu(data.menu);
    } catch (err) {
      // Roll back the optimistic toggle if the S3 write failed.
      setMenu((prev) => prev.map((item) => (item.id === id ? { ...item, available: target.available } : item)));
      setError(err instanceof Error ? err.message : "Failed to save menu");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <div className="flex items-center justify-between gap-4 px-1 pb-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">Item</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">In Stock</span>
      </div>

      <ul className="flex flex-col divide-y divide-gray-100">
        {menu.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-4 py-3">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-500">${item.price.toFixed(2)} · {item.category}</p>
              </div>
            </div>

            <button
              onClick={() => toggleAvailability(item.id)}
              disabled={savingId === item.id}
              role="switch"
              aria-checked={item.available}
              aria-label={`Toggle availability for ${item.name}`}
              className={`relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:opacity-50 ${
                item.available ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  item.available ? "translate-x-[-1px]" : "translate-x-[-20px]"
                }`}
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
