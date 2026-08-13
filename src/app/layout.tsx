import type { Metadata } from "next";
import type React from "react";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "RecipeShare — Discover & Share Amazing Recipes",
  description:
    "Browse and share delicious recipes from around the world using the native Web Share API.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 max-w-6xl flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🍽️</span>
              <span className="font-bold text-xl text-orange-600">
                RecipeShare
              </span>
            </Link>
            <nav className="flex items-center gap-6 text-sm font-medium">
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                All Recipes
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t py-8 mt-16">
          <div className="container mx-auto px-4 max-w-6xl text-center text-sm text-muted-foreground">
            <p>
              Built with Next.js, Tailwind CSS, and the{" "}
              <a
                href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                Web Share API
              </a>
              .
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

