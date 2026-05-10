"use client";

import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-[1280px] items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/catalog" className="text-lg font-bold text-primary">
            PawnMarket
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            <Link
              href="/catalog"
              className="text-sm text-foreground hover:text-primary transition-colors"
            >
              Каталог
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            aria-label="Корзина"
            className="inline-flex size-8 items-center justify-center rounded-lg text-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
          </Link>
          <Link
            href="/login"
            aria-label="Войти"
            className="inline-flex size-8 items-center justify-center rounded-lg text-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <User className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
