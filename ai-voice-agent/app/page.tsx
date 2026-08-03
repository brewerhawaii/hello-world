"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

interface Stats {
  totalProspects: number;
  activeSequences: number;
  wonProspects: number;
  activeClients: number;
  totalCalls: number;
  monthlyRevenue: number;
  videosSent: number;
  replyRate: number;
  conversionRate: number;
}

const PHASE_STEPS = [
  { num: 1, title: "Build Prospect List", desc: "Scrape Google Maps, filter for pain signals, qualify sweet-spot businesses.", icon: "🗺️", href: "/prospects" },
  { num: 2, title: "Build AI Voice Agent", desc: "Configure Vapi agent with business name, emergency routing, and scheduling.", icon: "🤖", href: "/agents" },
  { num: 3, title: "Record Proof Video", desc: "Call prospect live on camera, show voicemail, then demo the AI agent.", icon: "🎥", href: "/videos" },
  { num: 4, title: "Send Outreach Sequence", desc: "4-touch sequence: Day 1 Loom → Day 3 email → Day 6 SMS/VM → Day 10 close.", icon: "📬", href: "/sequences" },
  { num: 5, title: "Onboard & Get Paid", desc: "Screen share call forwarding setup, collect $497 setup + $297/mo.", icon: "🏆", href: "/clients" },
];

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetch("/api/stats").then((r) => r.json()).then(setStats);
  }, []);

  async function seedData() {
    setSeeding(true);
    await fetch("/api/seed", { method: "POST" });
    const s = await fetch("/api/stats").then((r) => r.json());
    setStats(s);
    setSeeding(false);
  }

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div
            className="text-xs font-bold tracking-widest uppercase mb-1"
            style={{ color: "var(--cyan)" }}
          >
            B2B Outreach System
          </div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-sub mt-1">Every missed call is their money you&apos;re about to close.</p>
        </div>
        {stats?.totalProspects === 0 && (
          <button onClick={seedData} disabled={seeding} className="btn btn-primary">
            {seeding ? "Seeding..." : "⚡ Load Demo Data"}
          </button>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 mb-8" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
        <StatCard num={stats?.totalProspects ?? 0} label="Total Prospects" icon="🎯" />
        <StatCard num={stats?.activeSequences ?? 0} label="Active Sequences" icon="📬" />
        <StatCard num={stats?.videosSent ?? 0} label="Videos Sent" icon="🎥" />
        <StatCard num={`${stats?.replyRate ?? 0}%`} label="Reply Rate" icon="💬" />
        <StatCard num={stats?.activeClients ?? 0} label="Active Clients" icon="🏆" />
        <StatCard num={formatCurrency(stats?.monthlyRevenue ?? 0)} label="Monthly MRR" icon="💰" />
        <StatCard num={stats?.totalCalls ?? 0} label="AI Calls Handled" icon="📞" />
        <StatCard num={`${stats?.conversionRate ?? 0}%`} label="Conversion Rate" icon="📈" />
      </div>

      {/* 5-Phase System */}
      <div className="mb-6">
        <div
          className="text-xs font-bold tracking-widest uppercase mb-4"
          style={{ color: "var(--slate2)" }}
        >
          The 5-Phase System
        </div>
        <div className="flex flex-col gap-0">
          {PHASE_STEPS.map((step, i) => (
            <Link href={step.href} key={step.num} className="group flex items-start gap-4 relative">
              <div className="flex flex-col items-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold flex-shrink-0 z-10"
                  style={{
                    fontFamily: "Syne, sans-serif",
                    background: "var(--navy3)",
                    border: "2px solid var(--blue)",
                    color: "var(--cyan)",
                    boxShadow: "0 0 0 4px rgba(37,99,235,0.1)",
                  }}
                >
                  {step.num}
                </div>
                {i < PHASE_STEPS.length - 1 && (
                  <div
                    className="w-0.5 flex-1"
                    style={{
                      background: "linear-gradient(to bottom, rgba(37,99,235,0.5), rgba(37,99,235,0.05))",
                      minHeight: 32,
                    }}
                  />
                )}
              </div>
              <div className="card flex-1 p-4 mb-3 transition-colors" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center gap-2 mb-1">
                  <span>{step.icon}</span>
                  <span
                    className="font-bold text-sm"
                    style={{ fontFamily: "Syne, sans-serif", color: "var(--white)" }}
                  >
                    {step.title}
                  </span>
                  <span className="ml-auto text-sm" style={{ color: "var(--cyan)" }}>→</span>
                </div>
                <p className="text-xs" style={{ color: "var(--slate)" }}>{step.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Revenue math */}
      <div
        className="card p-5"
        style={{ background: "rgba(249,115,22,0.05)", borderColor: "rgba(249,115,22,0.2)" }}
      >
        <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "var(--orange)" }}>
          ⚡ The Revenue Math
        </div>
        <div className="grid gap-2 text-sm" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          <RevenueItem label="Avg missed calls/week" value="4–8×" />
          <RevenueItem label="Avg emergency ticket" value="$800–$2,400" />
          <RevenueItem label="Monthly revenue lost" value="$10K–$15K" />
          <RevenueItem label="Callers who don't leave VM" value="73%" />
          <RevenueItem label="Hours to agent live" value="48h" />
          <RevenueItem label="1 recovered call covers" value="6 months of service" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ num, label, icon }: { num: number | string; label: string; icon: string }) {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between">
        <div className="stat-num">{num}</div>
        <div className="text-2xl opacity-40">{icon}</div>
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function RevenueItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1.5 px-2 rounded" style={{ background: "rgba(0,0,0,0.2)" }}>
      <span style={{ color: "var(--slate)" }}>{label}</span>
      <span className="font-bold" style={{ color: "var(--orange)" }}>{value}</span>
    </div>
  );
}
