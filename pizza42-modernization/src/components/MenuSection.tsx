"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { categories, categoryEmoji, menu, MenuItem } from "@/data/menu";
import { useCart } from "@/context/CartContext";

const gridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function MenuSection() {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]);
  const { addItem } = useCart();

  const items = menu.filter((item) => item.category === activeCategory);

  return (
    <div className="mx-auto max-w-300 px-6 pb-16">
      <div className="flex gap-6 border-b border-gray-200">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`-mb-px border-b-2 px-1 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${
              activeCategory === category
                ? "border-red-600 text-gray-900"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            {categoryEmoji[category]} {category}
          </button>
        ))}
      </div>

      <h2 className="mt-6 mb-4 text-lg font-bold text-gray-900">Featured Items</h2>
      <motion.div
        key={activeCategory}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={gridVariants}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        {items.map((item) => (
          <MenuItemCard key={item.id} item={item} onAdd={() => addItem(item)} />
        ))}
      </motion.div>
    </div>
  );
}

function MenuItemCard({ item, onAdd }: { item: MenuItem; onAdd: () => void }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02, y: -4, boxShadow: "0 12px 24px -8px rgba(0,0,0,0.18)" }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={onAdd}
      role="button"
      aria-label={`Add ${item.name}`}
      className="flex cursor-pointer items-center gap-4 rounded-2xl border border-gray-200 p-4"
    >
      <div className="flex-1">
        <h3 className="font-bold text-gray-900">{item.name}</h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{item.description}</p>
        <p className="mt-2 text-sm font-semibold text-gray-900">
          ${item.price.toFixed(2)}
        </p>
      </div>

      <motion.div
        whileHover={{ scale: 1.08 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl"
      >
        <Image src={item.image} alt={item.name} fill className="object-cover" />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAdd();
          }}
          aria-label={`Add ${item.name}`}
          className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-base font-bold text-gray-900 shadow"
        >
          +
        </button>
      </motion.div>
    </motion.div>
  );
}
