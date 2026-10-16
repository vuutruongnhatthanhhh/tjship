"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShieldCheck, UserRound } from "lucide-react";
import Logo from "./Logo";

const links = [
  { href: "/", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/admin", label: "Quản trị", icon: ShieldCheck },
  { href: "/driver", label: "Tài xế", icon: UserRound },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col overflow-y-auto border-r border-border bg-surface px-4 py-5 md:flex">
      <div className="px-1">
        <Logo />
      </div>
      <nav className="mt-8 flex flex-col gap-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-brand/15 text-brand ring-1 ring-brand/30"
                  : "text-muted hover:bg-surface-2 hover:text-foreground"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
