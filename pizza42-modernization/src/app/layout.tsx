import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Auth0Provider } from "@auth0/nextjs-auth0/client";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pizza 42 - Online Ordering",
  description: "Order pizza online from Pizza 42, powered by Auth0",
  icons: {
    icon: "https://img.icons8.com/emoji/96/pizza-emoji.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Auth0Provider>
          <CartProvider>
            <Header />
            {children}
            <CartDrawer />
          </CartProvider>
        </Auth0Provider>
      </body>
    </html>
  );
}
