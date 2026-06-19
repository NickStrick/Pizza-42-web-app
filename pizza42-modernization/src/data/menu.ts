export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "Pizza" | "Sides" | "Drinks";
};

export const menu: MenuItem[] = [
  {
    id: "cheese",
    name: "Cheese Pizza",
    description: "Classic mozzarella and house tomato sauce on our hand-tossed crust.",
    price: 8.5,
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80",
    category: "Pizza",
  },
  {
    id: "pepperoni",
    name: "Pepperoni Classic",
    description: "Pepperoni, mozzarella, and house tomato sauce. A Pizza 42 favorite.",
    price: 9.75,
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80",
    category: "Pizza",
  },
  {
    id: "forty-two-supreme",
    name: "The Forty-Two Supreme",
    description: "Pepperoni, sausage, peppers, onions, and mushrooms. Loaded.",
    price: 13.99,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
    category: "Pizza",
  },
  {
    id: "bbq-chicken",
    name: "BBQ Chicken",
    description: "Grilled chicken, smoky BBQ sauce, red onion, and cilantro.",
    price: 12.5,
    image:
      "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=600&q=80",
    category: "Pizza",
  },
  {
    id: "veggie-garden",
    name: "Veggie Garden",
    description: "Mushrooms, peppers, onions, black olives, and tomatoes.",
    price: 11.25,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Vegetarian_Pizza.jpg/960px-Vegetarian_Pizza.jpg",
    category: "Pizza",
  },
  {
    id: "margherita",
    name: "Margherita",
    description: "Fresh mozzarella, basil, vine tomatoes, and olive oil.",
    price: 10.5,
    image:
      "https://images.unsplash.com/photo-1571066811602-716837d681de?auto=format&fit=crop&w=600&q=80",
    category: "Pizza",
  },
  {
    id: "meat-lovers",
    name: "Meat Lovers",
    description: "Pepperoni, Italian sausage, bacon, and ham.",
    price: 14.5,
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80",
    category: "Pizza",
  },
  {
    id: "buffalo-chicken",
    name: "Buffalo Chicken",
    description: "Buffalo chicken, mozzarella, and a ranch drizzle.",
    price: 12.99,
    image:
      "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?auto=format&fit=crop&w=600&q=80",
    category: "Pizza",
  },
  {
    id: "garlic-knots",
    name: "Garlic Knots",
    description: "Warm baked knots brushed with garlic butter and parmesan.",
    price: 5.99,
    image:
      "https://images.unsplash.com/photo-1619531040576-f9416740661b?auto=format&fit=crop&w=600&q=80",
    category: "Sides",
  },
  {
    id: "breadsticks",
    name: "Breadsticks",
    description: "Soft-baked breadsticks served with marinara dipping sauce.",
    price: 6.5,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/2023-04-02_12_51_29_Breadsticks_from_Pizza_Hut_in_Westampton_Township%2C_Burlington_County%2C_New_Jersey.jpg/960px-2023-04-02_12_51_29_Breadsticks_from_Pizza_Hut_in_Westampton_Township%2C_Burlington_County%2C_New_Jersey.jpg",
    category: "Sides",
  },
  {
    id: "caesar-salad",
    name: "Caesar Salad",
    description: "Romaine, parmesan, croutons, and Caesar dressing.",
    price: 7.25,
    image:
      "https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&w=600&q=80",
    category: "Sides",
  },
  {
    id: "mozzarella-sticks",
    name: "Mozzarella Sticks",
    description: "Breaded mozzarella, fried golden, served with marinara.",
    price: 7.99,
    image: "https://upload.wikimedia.org/wikipedia/commons/0/09/Mozzarella_sticks.jpg",
    category: "Sides",
  },
  {
    id: "fountain-soda",
    name: "Fountain Soda",
    description: "Coke, Diet Coke, Sprite, or Root Beer.",
    price: 2.49,
    image:
      "https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=600&q=80",
    category: "Drinks",
  },
  {
    id: "bottled-water",
    name: "Bottled Water",
    description: "16.9 oz spring water.",
    price: 1.99,
    image:
      "https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&w=600&q=80",
    category: "Drinks",
  },
  {
    id: "italian-soda",
    name: "Italian Soda",
    description: "Sparkling water with your choice of flavored syrup.",
    price: 3.5,
    image:
      "https://images.unsplash.com/photo-1437418747212-8d9709afab22?auto=format&fit=crop&w=600&q=80",
    category: "Drinks",
  },
  {
    id: "iced-tea",
    name: "Iced Tea",
    description: "Freshly brewed, served over ice.",
    price: 2.75,
    image:
      "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&w=600&q=80",
    category: "Drinks",
  },
];

export const categories = ["Pizza", "Sides", "Drinks"] as const;

export const categoryEmoji: Record<(typeof categories)[number], string> = {
  Pizza: "🍕",
  Sides: "🍟",
  Drinks: "🥤",
};
