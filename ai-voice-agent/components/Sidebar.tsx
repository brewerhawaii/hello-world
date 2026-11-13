"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", icon: "⚡", label: "Dashboard" },
  { href: "/prospects", icon: "🎯", label: "Prospects" },
  { href: "/sequences", icon: "📬", label: "Sequences" },
  { href: "/agents", icon: "🤖", label: "AI Agents" },
  { href: "/videos", icon: "🎥", label: "Videos" },
  { href: "/clients", icon: "🏆", label: "Clients" },
  { href: "/settings", icon: "⚙️", label: "Settings" },
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside
      className="fixed left-0 top-0 h-full z-40 flex flex-col"
      style={{
        width: 220,
        background: "var(--navy2)",
        borderRight: "1px solid var(--border)",
      }}
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: "var(--border)" }}>
        <div
          className="text-lg font-extrabold tracking-tight"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          AI<span style={{ color: "var(--cyan)" }}>Voice</span> Agent
        </div>
        <div
          className="text-xs mt-0.5 font-semibold tracking-widest uppercase"
          style={{ color: "var(--slate2)" }}
        >
          Outreach System
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {nav.map((item) => {
          const active = path === item.href || (item.href !== "/" && path.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: active ? "rgba(0,212,255,0.08)" : "transparent",
                color: active ? "var(--cyan)" : "var(--slate)",
                borderLeft: active ? "2px solid var(--cyan)" : "2px solid transparent",
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom status */}
      <div
        className="px-5 py-4 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: "var(--green)" }}
          />
          <span className="text-xs" style={{ color: "var(--slate2)" }}>
            System Online
          </span>
        </div>
      </div>
    </aside>
  );
}
