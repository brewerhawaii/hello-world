"use client";
import { useEffect, useState } from "react";
import { VERTICALS, generateSystemPrompt, formatDate } from "@/lib/utils";

interface Call {
  id: string;
  callerName?: string;
  callerPhone?: string;
  callType: string;
  duration?: number;
  summary?: string;
  outcome?: string;
  createdAt: string;
}

interface Agent {
  id: string;
  name: string;
  businessName: string;
  businessPhone?: string;
  transferPhone: string;
  voiceId: string;
  status: string;
  vapiAssistantId?: string;
  vapiPhoneNumber?: string;
  systemPrompt?: string;
  createdAt: string;
  calls?: Call[];
  _count?: { calls: number };
}

const VOICES = [
  { id: "adam", label: "Adam — Deep, trustworthy" },
  { id: "rachel", label: "Rachel — Warm, professional" },
  { id: "josh", label: "Josh — Friendly, energetic" },
  { id: "bella", label: "Bella — Calm, approachable" },
];

const EMPTY = { name: "", businessName: "", businessPhone: "", transferPhone: "", voiceId: "adam", status: "draft", vapiAssistantId: "", vapiPhoneNumber: "" };

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selected, setSelected] = useState<Agent | null>(null);
  const [modal, setModal] = useState<"add" | "edit" | "prompt" | null>(null);
  const [form, setForm] = useState<typeof EMPTY>(EMPTY);
  const [saving, setSaving] = useState(false);

  function load() {
    fetch("/api/agents").then((r) => r.json()).then((data) => {
      setAgents(data);
      if (selected) {
        const updated = data.find((a: Agent) => a.id === selected.id);
        if (updated) setSelected(updated);
      }
    });
  }

  useEffect(load, []);

  async function loadDetails(agent: Agent) {
    const data = await fetch(`/api/agents/${agent.id}`).then((r) => r.json());
    setSelected(data);
  }

  async function save() {
    setSaving(true);
    const method = (form as typeof EMPTY & { id?: string }).id ? "PATCH" : "POST";
    const url = (form as typeof EMPTY & { id?: string }).id ? `/api/agents/${(form as typeof EMPTY & { id?: string }).id}` : "/api/agents";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false);
    setModal(null);
    setForm(EMPTY);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this agent?")) return;
    await fetch(`/api/agents/${id}`, { method: "DELETE" });
    if (selected?.id === id) setSelected(null);
    load();
  }

  async function toggleStatus(agent: Agent) {
    const status = agent.status === "active" ? "paused" : "active";
    await fetch(`/api/agents/${agent.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    load();
  }

  const statusColor: Record<string, string> = {
    draft: "badge-slate",
    active: "badge-green",
    paused: "badge-yellow",
    error: "badge-red",
  };

  const callTypeColor: Record<string, string> = {
    emergency: "badge-red",
    booking: "badge-green",
    standard: "badge-blue",
  };

  const outcomeColor: Record<string, string> = {
    transferred: "badge-orange",
    booked: "badge-green",
    voicemail: "badge-slate",
    hung_up: "badge-red",
  };

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">AI Agents</h1>
          <p className="page-sub">Vapi-powered voice agents for each client. Clone, configure, deploy.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm(EMPTY); setModal("add"); }}>
          + New Agent
        </button>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: selected ? "320px 1fr" : "1fr" }}>
        {/* Agent list */}
        <div className="flex flex-col gap-3">
          {agents.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🤖</div>
              <div className="font-semibold">No agents yet</div>
              <div className="text-sm">Create your first AI voice agent.</div>
            </div>
          ) : (
            agents.map((agent) => (
              <div
                key={agent.id}
                className="card p-4 cursor-pointer transition-all"
                style={{ borderColor: selected?.id === agent.id ? "rgba(0,212,255,0.4)" : "var(--border)", background: selected?.id === agent.id ? "rgba(0,212,255,0.04)" : "var(--navy2)" }}
                onClick={() => loadDetails(agent)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold text-sm">{agent.businessName}</div>
                    <div className="text-xs" style={{ color: "var(--slate2)" }}>{agent.name}</div>
                  </div>
                  <span className={`badge ${statusColor[agent.status] ?? "badge-slate"}`}>{agent.status}</span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs" style={{ color: "var(--slate2)" }}>
                  <span>🎙 {VOICES.find((v) => v.id === agent.voiceId)?.label.split(" — ")[0] ?? agent.voiceId}</span>
                  <span>📞 {agent._count?.calls ?? 0} calls</span>
                  {agent.vapiPhoneNumber && <span style={{ color: "var(--cyan)", fontFamily: "monospace" }}>{agent.vapiPhoneNumber}</span>}
                </div>
                <div className="flex gap-1 mt-3">
                  <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); setForm({ ...agent } as typeof EMPTY); setModal("edit"); }}>Edit</button>
                  <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); toggleStatus(agent); }}>
                    {agent.status === "active" ? "Pause" : "Activate"}
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); remove(agent.id); }}>✕</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Agent detail */}
        {selected && (
          <div className="flex flex-col gap-4">
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="page-title text-xl">{selected.businessName}</div>
                  <div className="text-sm" style={{ color: "var(--slate2)" }}>Created {formatDate(selected.createdAt)}</div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>✕ Close</button>
              </div>

              <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
                <InfoRow label="Transfer Phone" value={selected.transferPhone} mono />
                <InfoRow label="Voice" value={VOICES.find((v) => v.id === selected.voiceId)?.label ?? selected.voiceId} />
                {selected.vapiPhoneNumber && <InfoRow label="Vapi Number" value={selected.vapiPhoneNumber} mono />}
                {selected.vapiAssistantId && <InfoRow label="Vapi ID" value={selected.vapiAssistantId} mono />}
              </div>

              <div className="mt-4">
                <div className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "var(--slate2)" }}>System Prompt</div>
                <div
                  className="rounded-lg p-3 text-xs leading-relaxed"
                  style={{ background: "#080c18", border: "1px solid rgba(37,99,235,0.2)", fontFamily: "JetBrains Mono, monospace", color: "#6EE7B7", whiteSpace: "pre-wrap" }}
                >
                  {selected.systemPrompt}
                </div>
              </div>
            </div>

            {/* Call log */}
            <div className="card p-5">
              <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "var(--slate2)" }}>
                Call Log ({selected.calls?.length ?? 0} recent)
              </div>
              {!selected.calls?.length ? (
                <div className="text-sm text-center py-8" style={{ color: "var(--slate2)" }}>No calls yet</div>
              ) : (
                <div className="table-wrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Caller</th>
                        <th>Type</th>
                        <th>Duration</th>
                        <th>Outcome</th>
                        <th>Summary</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selected.calls.map((call) => (
                        <tr key={call.id}>
                          <td>
                            <div className="font-medium text-sm">{call.callerName ?? "Unknown"}</div>
                            {call.callerPhone && <div className="text-xs font-mono" style={{ color: "var(--slate2)" }}>{call.callerPhone}</div>}
                          </td>
                          <td><span className={`badge ${callTypeColor[call.callType] ?? "badge-slate"}`}>{call.callType}</span></td>
                          <td className="text-sm">{call.duration ? `${Math.floor(call.duration / 60)}:${String(call.duration % 60).padStart(2, "0")}` : "—"}</td>
                          <td>{call.outcome ? <span className={`badge ${outcomeColor[call.outcome] ?? "badge-slate"}`}>{call.outcome}</span> : "—"}</td>
                          <td className="text-xs" style={{ color: "var(--slate)", maxWidth: 200 }}>{call.summary ?? "—"}</td>
                          <td className="text-xs" style={{ color: "var(--slate2)" }}>{formatDate(call.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Setup checklist */}
            <div className="card p-5">
              <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "var(--slate2)" }}>
                Deployment Checklist
              </div>
              <div className="flex flex-col gap-2">
                {[
                  { done: !!selected.vapiAssistantId, label: "Agent created in Vapi dashboard" },
                  { done: !!selected.vapiPhoneNumber, label: "Vapi phone number provisioned" },
                  { done: selected.status === "active", label: "Agent status set to Active" },
                  { done: true, label: "Emergency transfer phone configured" },
                  { done: false, label: "Call forwarding set up with client (screen share)" },
                  { done: false, label: "Live test call completed" },
                  { done: false, label: "Webhook/lead delivery configured" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                      style={{ background: item.done ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.05)", color: item.done ? "var(--green)" : "var(--slate2)" }}
                    >
                      {item.done ? "✓" : "○"}
                    </div>
                    <span style={{ color: item.done ? "var(--white)" : "var(--slate2)" }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(modal === "add" || modal === "edit") && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <h2 className="modal-title">{modal === "add" ? "New AI Voice Agent" : "Edit Agent"}</h2>
            <div className="grid gap-3">
              <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
                <Field label="Agent Name *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Mike's Plumbing Agent" />
                <Field label="Business Name *" value={form.businessName} onChange={(v) => setForm({ ...form, businessName: v })} placeholder="Mike's Plumbing & Drain" />
                <Field label="Business Phone" value={form.businessPhone ?? ""} onChange={(v) => setForm({ ...form, businessPhone: v })} type="tel" placeholder="8085551234" />
                <Field label="Emergency Transfer Phone *" value={form.transferPhone} onChange={(v) => setForm({ ...form, transferPhone: v })} type="tel" placeholder="Owner cell number" />
                <Field label="Vapi Assistant ID" value={form.vapiAssistantId ?? ""} onChange={(v) => setForm({ ...form, vapiAssistantId: v })} placeholder="From Vapi dashboard" />
                <Field label="Vapi Phone Number" value={form.vapiPhoneNumber ?? ""} onChange={(v) => setForm({ ...form, vapiPhoneNumber: v })} placeholder="+18085550001" />
              </div>
              <div className="form-group">
                <label className="form-label">Voice (ElevenLabs)</label>
                <select className="select" value={form.voiceId} onChange={(e) => setForm({ ...form, voiceId: e.target.value })}>
                  {VOICES.map((v) => <option key={v.id} value={v.id}>{v.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                </select>
              </div>
              {form.businessName && form.transferPhone && (
                <div>
                  <div className="text-xs font-bold tracking-widest uppercase mb-1.5" style={{ color: "var(--slate2)" }}>System Prompt Preview</div>
                  <div
                    className="rounded-lg p-3 text-xs leading-relaxed"
                    style={{ background: "#080c18", border: "1px solid rgba(37,99,235,0.2)", fontFamily: "JetBrains Mono, monospace", color: "#6EE7B7", whiteSpace: "pre-wrap", maxHeight: 160, overflow: "auto" }}
                  >
                    {generateSystemPrompt(form.businessName, form.transferPhone)}
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" disabled={saving || !form.name || !form.businessName || !form.transferPhone} onClick={save}>
                {saving ? "Saving..." : modal === "add" ? "Create Agent" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-xs font-bold tracking-widest uppercase mb-0.5" style={{ color: "var(--slate2)" }}>{label}</div>
      <div className="text-sm" style={{ fontFamily: mono ? "JetBrains Mono, monospace" : undefined, color: "var(--white)" }}>{value}</div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input className="input" type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}
