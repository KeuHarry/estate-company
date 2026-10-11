"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/logo";
import { button } from "@/components/ui/pill-button";
import { cn } from "@/lib/utils";
import { navItems } from "./nav-items";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);
  const reduce = useReducedMotion();
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close the menu when the route changes (adjusting state during render, not in an effect).
  if (openedAt !== pathname) {
    setOpenedAt(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <div className="container-x">
        <div
          className={cn(
            "relative flex h-14 items-center justify-between rounded-full pr-2 pl-5 transition-[background-color,box-shadow,backdrop-filter] duration-300",
            scrolled || open ? "bg-white/80 shadow-float backdrop-blur-xl backdrop-saturate-150" : "bg-white/45 backdrop-blur-md",
          )}
        >
          <Link href="/" aria-label="Arise home" className="rounded-full">
            <Logo />
          </Link>

          <nav aria-label="Main" className="absolute left-1/2 hidden -translate-x-1/2 lg:block">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "press inline-flex h-9 items-center rounded-full px-4 text-sm font-medium whitespace-nowrap",
                      isActive(item.href) ? "bg-ink/[0.06] text-ink" : "text-stone hover:text-ink",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            <Link href="/rentals" className={button({ size: "md", className: "hidden sm:inline-flex" })}>
              Find a home
            </Link>
            <button
              ref={toggleRef}
              type="button"
              className="press inline-flex size-11 items-center justify-center rounded-full text-ink hover:bg-ink/5 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.nav
              id="mobile-menu"
              aria-label="Mobile"
              initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(-8px) scale(0.98)" }}
              animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(-6px) scale(0.98)", transition: { duration: 0.15 } }}
              transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
              style={{ transformOrigin: "top right" }}
              className="mt-2 rounded-[1.5rem] bg-white/95 p-3 shadow-float backdrop-blur-xl lg:hidden"
            >
              <ul className="flex flex-col">
                {[{ href: "/", label: "Home" }, ...navItems].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={(item.href === "/" ? pathname === "/" : isActive(item.href)) ? "page" : undefined}
                      className="flex h-13 items-center rounded-2xl px-4 text-lg font-semibold tracking-tight text-ink hover:bg-mist aria-[current=page]:bg-mist"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/rentals" className={button({ size: "lg", className: "mt-2 w-full" })}>
                Find a home
              </Link>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
