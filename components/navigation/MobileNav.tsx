"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { isNavItemActive, NAV_ITEMS } from "@/components/navigation/NavLinks";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  githubUrl: string;
}

export function MobileNav({ githubUrl }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? "/";
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-navigation-panel"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-border bg-surface text-ink transition-colors hover:bg-subtle"
      >
        {open ? (
          <X className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Menu className="h-5 w-5" aria-hidden="true" />
        )}
      </button>

      {open ? (
        <div
          id="mobile-navigation-panel"
          className="absolute inset-x-0 top-full z-40 border-b border-border bg-surface px-5 py-4 shadow-sm"
        >
          <nav aria-label="Mobile navigation">
            <ul className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const active = isNavItemActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex min-h-11 items-center justify-between rounded-sm px-3 py-2 text-sm font-medium",
                        active
                          ? "bg-accent-soft text-accent"
                          : "text-ink-secondary hover:bg-subtle hover:text-ink"
                      )}
                    >
                      <span>{item.label}</span>
                      {active ? (
                        <span className="font-mono text-[11px] uppercase tracking-wider">
                          Current
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
              <li className="mt-2 border-t border-border pt-2">
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-11 items-center justify-between rounded-sm px-3 py-2 text-sm font-medium text-ink-secondary hover:bg-subtle hover:text-accent"
                >
                  <span>GitHub</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">(opens in new tab)</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
