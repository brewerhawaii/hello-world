"use client";
import { useEffect, useState } from "react";
import { formatCurrency, formatDate, formatPhone } from "@/lib/utils";

interface Agent {
  id: string;
  businessName: string;
  status: string;
  vapiPhoneNumber?: string;
  _count?: { calls: number };
}

interface Client {
  id: string;
  businessName: string;
  ownerName: string;
  phone: string;
  email?: string;
  vertical: string;
  city?: string;
  setupFee: number;
  monthlyFee: number;
  emergencyAddon: boolean;
  status: string;
  callForwardingSet: boolean;
  onboardedAt: string;
  nextBillingDate?: string;
  notes?: string;
  agent?: Agent | null;
}

interface Prospect {
  id: string;
  businessName: string;
  ownerName?: string;
  phone: string;
  email?: string;
  vertical: string;
  city: string;
}

const EMPTY = {
  businessName: "", ownerName: "", phone: "", email: "", vertical: "Plumber", city: "",
  setupFee: 497, monthlyFee: 297, emergencyAddon: false, status: "onboarding",
  callForwardingSet: false, notes: "",
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [modal, setModal] = useState<"add" | "edit" | "onboard" | null>(null);
  const [form, setForm] = useState<Partial<typeof EMPTY> & { id?: string; agentId?: string; prospectId?: string }>(EMPTY);
  const [selected, setSelected] = useState<Client | null>(null);
  const [saving, setSaving] = useState(false);

  function load() {
    fetch("/api/clients").then((r) => r.json()).then(setClients);
    fetch("/api/agents").then((r) => r.json()).then(setAgents);
    fetch("/api/prospects").then((r) => r.json()).then(setProspects);
  }

  useEffect(load, []);

  async function save() {
    setSaving(true);
    const method = form.id ? "PATCH" : "POST";
    const url = form.id ? `/api/clients/${form.id}` : "/api/clients";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false);
    setModal(null);
    setForm(EMPTY);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Remove this client?")) return;
    await fetch(`/api/clients/${id}`, { method: "DELETE" });
    if (selected?.id === id) setSelected(null);
    load();
  }

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/clients/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    load();
  }

  async function toggleForwarding(client: Client) {
    await fetch(`/api/clients/${client.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ callForwardingSet: !client.callForwardingSet }) });
    load();
  }

  const totalMRR = clients.filter((c) => c.status === "active").reduce((a, c) => a + c.monthlyFee + (c.emergencyAddon ? 97 : 0), 0);
  const totalSetup = clients.reduce((a, c) => a + c.setupFee, 0);

  const statusColor: Record<string, string> = {
    onboarding: "badge-cyan",
    active: "badge-green",
    paused: "badge-yellow",
    churned: "badge-red",
  };

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Clients</h1>
          <p className="page-sub">Paying clients. Track MRR, agent status, and onboarding checklist.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm(EMPTY); setModal("add"); }}>
          + Add Client
        </button>
      </div>

      {/* Revenue stats */}
      <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
        <StatCard num={formatCurrency(totalMRR)} label="Monthly MRR" icon="💰" />
        <StatCard num={clients.filter((c) => c.status === "active").length} label="Active Clients" icon="✅" />
        <StatCard num={clients.filter((c) => c.status === "onboarding").length} label="In Onboarding" icon="⚙️" />
        <StatCard num={formatCurrency(totalSetup)} label="Total Setup Fees" icon="💵" />
      </div>

      {/* Client list */}
      {clients.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏆</div>
          <div className="font-semibold">No clients yet</div>
          <div className="text-sm">Convert a prospect to a paying client after they say yes.</div>
        </div>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: selected ? "350px 1fr" : "1fr" }}>
          <div className="flex flex-col gap-3">
            {clients.map((client) => (
              <div
                key={client.id}
                className="card p-4 cursor-pointer transition-all"
                style={{
                  borderColor: selected?.id === client.id ? "rgba(0,212,255,0.4)" : "var(--border)",
                  background: selected?.id === client.id ? "rgba(0,212,255,0.04)" : "var(--navy2)",
                }}
                onClick={() => setSelected(selected?.id === client.id ? null : client)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold text-sm">{client.businessName}</div>
                    <div className="text-xs" style={{ color: "var(--slate2)" }}>{client.ownerName} · {client.vertical}</div>
                  </div>
                  <span className={`badge ${statusColor[client.status] ?? "badge-slate"}`}>{client.status}</span>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs mt-1" style={{ color: "var(--slate)" }}>
                  <span>
                    <strong style={{ color: "var(--cyan)" }}>{formatCurrency(client.monthlyFee + (client.emergencyAddon ? 97 : 0))}</strong>/mo
                  </span>
                  {client.emergencyAddon && <span className="badge badge-orange text-xs" style={{ fontSize: 10 }}>+ Emergency</span>}
                  <span style={{ color: client.callForwardingSet ? "var(--green)" : "var(--red)" }}>
                    {client.callForwardingSet ? "✓ Forwarding Set" : "⚠ Forwarding Pending"}
                  </span>
                </div>

                {client.agent && (
                  <div className="flex items-center gap-2 mt-2 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: client.agent.status === "active" ? "var(--green)" : "var(--yellow)" }} />
                    <span style={{ color: "var(--slate2)" }}>Agent: {client.agent.businessName}</span>
                    {client.agent.vapiPhoneNumber && <span style={{ color: "var(--cyan)", fontFamily: "monospace" }}>{client.agent.vapiPhoneNumber}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Detail panel */}
          {selected && (
            <div className="flex flex-col gap-4">
              <div className="card p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="page-title text-xl">{selected.businessName}</div>
                    <div className="text-sm" style={{ color: "var(--slate2)" }}>Client since {formatDate(selected.onboardedAt)}</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-ghost btn-sm" onClick={() => { setForm({ ...selected, agentId: selected.agent?.id } as typeof EMPTY & { id?: string }); setModal("edit"); }}>
                      Edit
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>✕</button>
                  </div>
                </div>

                <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
                  <InfoGroup label="Owner" value={selected.ownerName} />
                  <InfoGroup label="Phone" value={formatPhone(selected.phone)} mono />
                  {selected.email && <InfoGroup label="Email" value={selected.email} />}
                  <InfoGroup label="Location" value={selected.city ?? "—"} />
                  <InfoGroup label="Vertical" value={selected.vertical} />
                  <InfoGroup label="Status" value={selected.status} />
                  <InfoGroup label="Setup Fee" value={formatCurrency(selected.setupFee)} />
                  <InfoGroup label="Monthly Fee" value={`${formatCurrency(selected.monthlyFee + (selected.emergencyAddon ? 97 : 0))}/mo`} />
                </div>
              </div>

              {/* Onboarding checklist */}
              <div className="card p-5">
                <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "var(--slate2)" }}>
                  Onboarding Checklist
                </div>
                <div className="flex flex-col gap-2.5">
                  {[
                    { done: true, label: "Intake form completed (business name, phones, schedule)" },
                    { done: !!selected.agent, label: "Vapi agent cloned and configured" },
                    { done: selected.agent?.status === "active", label: "Agent set to Active in Vapi" },
                    { done: selected.callForwardingSet, label: "Call forwarding set up (screen share with client)", action: () => toggleForwarding(selected) },
                    { done: selected.callForwardingSet, label: "Live test call completed" },
                    { done: true, label: "Lead delivery webhook / notification configured" },
                    { done: selected.status === "active", label: "Invoice sent and payment collected" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <button
                        className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 transition-all"
                        style={{ background: item.done ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.05)", color: item.done ? "var(--green)" : "var(--slate2)", border: "none", cursor: item.action ? "pointer" : "default" }}
                        onClick={item.action}
                      >
                        {item.done ? "✓" : "○"}
                      </button>
                      <span style={{ color: item.done ? "var(--white)" : "var(--slate2)" }}>{item.label}</span>
                      {item.action && !item.done && <span className="text-xs badge badge-yellow" style={{ cursor: "pointer" }} onClick={item.action}>Click to mark done</span>}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 mt-4">
                  <select
                    className="select text-xs py-1"
                    style={{ maxWidth: 150 }}
                    value={selected.status}
                    onChange={(e) => updateStatus(selected.id, e.target.value)}
                  >
                    <option value="onboarding">Onboarding</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="churned">Churned</option>
                  </select>
                  <button className="btn btn-danger btn-sm" onClick={() => remove(selected.id)}>Remove Client</button>
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="card p-5">
                <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "var(--slate2)" }}>
                  Revenue Breakdown
                </div>
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between">
                    <span style={{ color: "var(--slate)" }}>Setup fee (one-time)</span>
                    <span className="font-semibold">{formatCurrency(selected.setupFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "var(--slate)" }}>Monthly retainer</span>
                    <span className="font-semibold">{formatCurrency(selected.monthlyFee)}/mo</span>
                  </div>
                  {selected.emergencyAddon && (
                    <div className="flex justify-between">
                      <span style={{ color: "var(--slate)" }}>Emergency transfer add-on</span>
                      <span className="font-semibold">$97/mo</span>
                    </div>
                  )}
                  <div className="divider my-1" />
                  <div className="flex justify-between font-bold">
                    <span>Total monthly</span>
                    <span style={{ color: "var(--cyan)" }}>
                      {formatCurrency(selected.monthlyFee + (selected.emergencyAddon ? 97 : 0))}/mo
                    </span>
                  </div>
                  <div className="flex justify-between text-xs" style={{ color: "var(--slate2)" }}>
                    <span>Break-even (1 recovered emergency call)</span>
                    <span>~{Math.ceil((selected.monthlyFee + (selected.emergencyAddon ? 97 : 0)) / 800)} calls</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {(modal === "add" || modal === "edit") && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <h2 className="modal-title">{modal === "add" ? "Add Client" : "Edit Client"}</h2>
            <div className="grid gap-3">
              <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
                <Field label="Business Name *" value={form.businessName ?? ""} onChange={(v) => setForm({ ...form, businessName: v })} />
                <Field label="Owner Name *" value={form.ownerName ?? ""} onChange={(v) => setForm({ ...form, ownerName: v })} />
                <Field label="Phone *" value={form.phone ?? ""} onChange={(v) => setForm({ ...form, phone: v })} type="tel" />
                <Field label="Email" value={form.email ?? ""} onChange={(v) => setForm({ ...form, email: v })} type="email" />
                <Field label="City" value={form.city ?? ""} onChange={(v) => setForm({ ...form, city: v })} />
                <div className="form-group">
                  <label className="form-label">Vertical</label>
                  <select className="select" value={form.vertical ?? "Plumber"} onChange={(e) => setForm({ ...form, vertical: e.target.value })}>
                    {["Plumber","Electrician","HVAC","Locksmith","Roofer"].map((v) => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <Field label="Setup Fee ($)" value={String(form.setupFee ?? 497)} onChange={(v) => setForm({ ...form, setupFee: parseFloat(v) || 497 })} type="number" />
                <Field label="Monthly Fee ($)" value={String(form.monthlyFee ?? 297)} onChange={(v) => setForm({ ...form, monthlyFee: parseFloat(v) || 297 })} type="number" />
              </div>

              <div className="form-group">
                <label className="form-label">Assign AI Agent</label>
                <select className="select" value={form.agentId ?? ""} onChange={(e) => setForm({ ...form, agentId: e.target.value || undefined })}>
                  <option value="">— No agent yet —</option>
                  {agents.map((a) => <option key={a.id} value={a.id}>{a.businessName} ({a.status})</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Prospect (optional)</label>
                <select className="select" value={form.prospectId ?? ""} onChange={(e) => setForm({ ...form, prospectId: e.target.value || undefined })}>
                  <option value="">— No prospect linked —</option>
                  {prospects.map((p) => <option key={p.id} value={p.id}>{p.businessName}</option>)}
                </select>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="checkbox" checked={form.emergencyAddon ?? false} onChange={(e) => setForm({ ...form, emergencyAddon: e.target.checked })} />
                  <span>Emergency Transfer Add-on (+$97/mo)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="checkbox" checked={form.callForwardingSet ?? false} onChange={(e) => setForm({ ...form, callForwardingSet: e.target.checked })} />
                  <span>Call Forwarding Set</span>
                </label>
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="select" value={form.status ?? "onboarding"} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="onboarding">Onboarding</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="churned">Churned</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea className="textarea" rows={2} value={form.notes ?? ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
              <button
                className="btn btn-primary"
                disabled={saving || !form.businessName || !form.ownerName || !form.phone}
                onClick={save}
              >
                {saving ? "Saving..." : modal === "add" ? "Add Client" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
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

function InfoGroup({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-xs font-bold tracking-widest uppercase mb-0.5" style={{ color: "var(--slate2)" }}>{label}</div>
      <div className="text-sm" style={{ fontFamily: mono ? "JetBrains Mono, monospace" : undefined }}>{value}</div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input className="input" type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
