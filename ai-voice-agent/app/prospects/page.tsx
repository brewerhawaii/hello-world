"use client";
import { useEffect, useState } from "react";
import { VERTICALS, STATUS_COLORS, formatDate, formatPhone } from "@/lib/utils";

const STATUSES = ["all", "new", "contacted", "demo_sent", "interested", "won", "lost", "no_reply"] as const;

interface Prospect {
  id: string;
  businessName: string;
  ownerName?: string;
  phone: string;
  email?: string;
  city: string;
  vertical: string;
  rating?: number;
  reviewCount?: number;
  reviewSnippet?: string;
  painSignals?: string;
  status: string;
  notes?: string;
  createdAt: string;
  _count?: { sequences: number };
}

const EMPTY: Partial<Prospect> = {
  businessName: "", ownerName: "", phone: "", email: "", city: "",
  vertical: "Plumber", rating: undefined, reviewCount: undefined,
  reviewSnippet: "", painSignals: "", status: "new", notes: "",
};

export default function ProspectsPage() {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [filter, setFilter] = useState("all");
  const [vertical, setVertical] = useState("all");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState<Partial<Prospect>>(EMPTY);
  const [saving, setSaving] = useState(false);

  function load() {
    const q = new URLSearchParams();
    if (filter !== "all") q.set("status", filter);
    if (vertical !== "all") q.set("vertical", vertical);
    if (search) q.set("search", search);
    fetch(`/api/prospects?${q}`).then((r) => r.json()).then(setProspects);
  }

  useEffect(load, [filter, vertical, search]);

  async function save() {
    setSaving(true);
    const method = form.id ? "PATCH" : "POST";
    const url = form.id ? `/api/prospects/${form.id}` : "/api/prospects";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false);
    setModal(null);
    setForm(EMPTY);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this prospect?")) return;
    await fetch(`/api/prospects/${id}`, { method: "DELETE" });
    load();
  }

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/prospects/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    load();
  }

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Prospects</h1>
          <p className="page-sub">Service trade businesses with missed-call pain signals.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm(EMPTY); setModal("add"); }}>
          + Add Prospect
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <input
          className="input"
          style={{ maxWidth: 240 }}
          placeholder="Search name, phone, city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="select" style={{ maxWidth: 160 }} value={filter} onChange={(e) => setFilter(e.target.value)}>
          {STATUSES.map((s) => <option key={s} value={s}>{s === "all" ? "All Statuses" : s.replace("_", " ")}</option>)}
        </select>
        <select className="select" style={{ maxWidth: 160 }} value={vertical} onChange={(e) => setVertical(e.target.value)}>
          <option value="all">All Verticals</option>
          {VERTICALS.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
        <div className="ml-auto text-sm" style={{ color: "var(--slate2)" }}>
          {prospects.length} prospect{prospects.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Table */}
      {prospects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎯</div>
          <div className="font-semibold">No prospects yet</div>
          <div className="text-sm">Add your first prospect or load demo data from the dashboard.</div>
        </div>
      ) : (
        <div className="card table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Business</th>
                <th>Contact</th>
                <th>Location</th>
                <th>Vertical</th>
                <th>Rating</th>
                <th>Pain Signals</th>
                <th>Status</th>
                <th>Seqs</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {prospects.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="font-semibold text-sm">{p.businessName}</div>
                    {p.ownerName && <div className="text-xs" style={{ color: "var(--slate2)" }}>{p.ownerName}</div>}
                  </td>
                  <td>
                    <div className="text-xs font-mono">{formatPhone(p.phone)}</div>
                    {p.email && <div className="text-xs" style={{ color: "var(--slate2)" }}>{p.email}</div>}
                  </td>
                  <td className="text-xs" style={{ color: "var(--slate)" }}>{p.city}</td>
                  <td>
                    <span className="badge badge-blue">{p.vertical}</span>
                  </td>
                  <td>
                    {p.rating ? (
                      <div className="text-sm">
                        <span style={{ color: "var(--yellow)" }}>★</span> {p.rating}
                        {p.reviewCount && <span className="text-xs ml-1" style={{ color: "var(--slate2)" }}>({p.reviewCount})</span>}
                      </div>
                    ) : "—"}
                  </td>
                  <td>
                    {p.painSignals ? (
                      <div className="flex flex-wrap gap-1">
                        {p.painSignals.split(",").slice(0, 2).map((sig, i) => (
                          <span key={i} className="badge badge-red text-xs">{sig.trim()}</span>
                        ))}
                      </div>
                    ) : "—"}
                  </td>
                  <td>
                    <select
                      className="select text-xs py-1 px-2"
                      style={{ minWidth: 100 }}
                      value={p.status}
                      onChange={(e) => updateStatus(p.id, e.target.value)}
                    >
                      {["new","contacted","demo_sent","interested","won","lost","no_reply"].map((s) => (
                        <option key={s} value={s}>{s.replace("_"," ")}</option>
                      ))}
                    </select>
                  </td>
                  <td className="text-center">
                    <span className="badge badge-slate">{p._count?.sequences ?? 0}</span>
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => { setForm(p); setModal("edit"); }}
                      >
                        Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => remove(p.id)}>✕</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {modal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <h2 className="modal-title">{modal === "add" ? "Add Prospect" : "Edit Prospect"}</h2>
            <div className="grid gap-3">
              <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
                <Field label="Business Name *" value={form.businessName ?? ""} onChange={(v) => setForm({ ...form, businessName: v })} />
                <Field label="Owner Name" value={form.ownerName ?? ""} onChange={(v) => setForm({ ...form, ownerName: v })} />
                <Field label="Phone *" value={form.phone ?? ""} onChange={(v) => setForm({ ...form, phone: v })} type="tel" />
                <Field label="Email" value={form.email ?? ""} onChange={(v) => setForm({ ...form, email: v })} type="email" />
                <Field label="City" value={form.city ?? ""} onChange={(v) => setForm({ ...form, city: v })} />
                <div className="form-group">
                  <label className="form-label">Vertical</label>
                  <select className="select" value={form.vertical ?? "Plumber"} onChange={(e) => setForm({ ...form, vertical: e.target.value })}>
                    {VERTICALS.map((v) => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <Field label="Rating (0–5)" value={String(form.rating ?? "")} onChange={(v) => setForm({ ...form, rating: parseFloat(v) || undefined })} type="number" />
                <Field label="Review Count" value={String(form.reviewCount ?? "")} onChange={(v) => setForm({ ...form, reviewCount: parseInt(v) || undefined })} type="number" />
              </div>
              <div className="form-group">
                <label className="form-label">Review Snippet</label>
                <textarea className="textarea" rows={2} value={form.reviewSnippet ?? ""} onChange={(e) => setForm({ ...form, reviewSnippet: e.target.value })} placeholder="Paste a review that shows pain signals..." />
              </div>
              <Field label="Pain Signals (comma separated)" value={form.painSignals ?? ""} onChange={(v) => setForm({ ...form, painSignals: v })} placeholder="no answer, voicemail, hard to reach" />
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea className="textarea" rows={2} value={form.notes ?? ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" disabled={saving || !form.businessName || !form.phone} onClick={save}>
                {saving ? "Saving..." : modal === "add" ? "Add Prospect" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
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
