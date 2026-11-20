"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/now", label: "Now" },
  { href: "/contact", label: "Contact" },
] as const;

export function isNavItemActive(pathname: string, href: string): boolean {
  if (pathname === href) {
    return true;
  }
  if (href === "/projects" && pathname.startsWith("/projects/")) {
    return true;
  }
  return false;
}

export function NavLinks() {
  const pathname = usePathname() ?? "/";

  return (
    <ul className="flex items-center gap-1">
      {NAV_ITEMS.map((item) => {
        const active = isNavItemActive(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex min-h-10 items-center rounded-sm px-3 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "bg-accent-soft text-accent"
                  : "text-ink-secondary hover:bg-subtle hover:text-ink"
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
