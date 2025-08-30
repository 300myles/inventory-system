import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { InventoryProvider } from "@/contexts/inventory-context";
import { ThemeProvider } from "@/contexts/theme-context";

export const metadata = {
  title: "Inventory Management System",
  description: "Created by Flamez and 300-Myles",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <InventoryProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </InventoryProvider>
      </body>
    </html>
  );
}
