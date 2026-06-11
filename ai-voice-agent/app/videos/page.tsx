"use client";
import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";

interface Video {
  id: string;
  title: string;
  loomUrl?: string;
  prospectId?: string;
  status: string;
  viewCount: number;
  duration?: number;
  notes?: string;
  createdAt: string;
  prospect?: {
    id: string;
    businessName: string;
    ownerName?: string;
    vertical: string;
    phone: string;
  } | null;
}

interface Prospect {
  id: string;
  businessName: string;
  ownerName?: string;
  vertical: string;
  city: string;
}

const SCRIPT_TEMPLATE = `PART 1 — The Problem (60 seconds)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Open Loom — screen + face cam]
"Hey [Owner Name], I'm [Your Name] and I'm going to show you
something that happened today."

→ Dial prospect's number live on camera
→ Let it ring through to voicemail
→ Hang up

"That call you just missed? That was a homeowner who needed
help. They called because they have a problem right now —
an emergency. And when they hit voicemail, 73% of them don't
leave a message. They just call the next number."


PART 2 — The Solution (90 seconds)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"Here's what should have happened instead."

→ Call your demo Vapi number
→ Simulate: "Hi, I have a burst pipe, water everywhere"
→ AI detects emergency → "connecting you now" → transfers
→ Call back, simulate routine booking
→ AI books appointment, confirms, thanks caller

"Same call. Different outcome. This is always on —
evenings, weekends, whenever you're busy."


THE CLOSE (30 seconds)
━━━━━━━━━━━━━━━━━━━━━
"Reply 'demo' and I'll set this up on your business number
in 48 hours. No contract, 30-day trial. One emergency call
you would have missed covers 6 months of the service.

[Your Name] — [Your Number]"`;

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [modal, setModal] = useState<"add" | "edit" | "script" | null>(null);
  const [form, setForm] = useState<Partial<Video>>({});
  const [saving, setSaving] = useState(false);

  function load() {
    fetch("/api/videos").then((r) => r.json()).then(setVideos);
    fetch("/api/prospects").then((r) => r.json()).then(setProspects);
  }

  useEffect(load, []);

  async function save() {
    setSaving(true);
    const method = form.id ? "PATCH" : "POST";
    const url = form.id ? `/api/videos/${form.id}` : "/api/videos";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false);
    setModal(null);
    setForm({});
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this video entry?")) return;
    await fetch(`/api/videos/${id}`, { method: "DELETE" });
    load();
  }

  const statusColor: Record<string, string> = {
    draft: "badge-slate",
    recorded: "badge-cyan",
    sent: "badge-green",
  };

  const stats = {
    total: videos.length,
    sent: videos.filter((v) => v.status === "sent").length,
    totalViews: videos.reduce((a, v) => a + v.viewCount, 0),
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Proof Videos</h1>
          <p className="page-sub">Loom outreach videos. The problem on camera, then the solution.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-ghost" onClick={() => setModal("script")}>📋 Script</button>
          <button className="btn btn-primary" onClick={() => { setForm({ status: "draft", viewCount: 0 }); setModal("add"); }}>
            + Add Video
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <StatCard num={stats.total} label="Total Videos" />
        <StatCard num={stats.sent} label="Sent to Prospects" />
        <StatCard num={stats.totalViews} label="Total Views" />
      </div>

      {/* Video list */}
      {videos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎥</div>
          <div className="font-semibold">No videos yet</div>
          <div className="text-sm">Record your first Loom proof video, then add it here to track sends and views.</div>
          <button className="btn btn-ghost mt-2" onClick={() => setModal("script")}>View Recording Script →</button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {videos.map((video) => (
            <div key={video.id} className="card p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: video.status === "draft" ? "rgba(100,116,139,0.1)" : "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.12)" }}
                  >
                    {video.status === "draft" ? "📝" : "🎥"}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{video.title}</div>
                    {video.prospect && (
                      <div className="text-xs mt-0.5" style={{ color: "var(--slate2)" }}>
                        → {video.prospect.businessName} ({video.prospect.ownerName ?? video.prospect.vertical})
                      </div>
                    )}
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className={`badge ${statusColor[video.status] ?? "badge-slate"}`}>{video.status}</span>
                      {video.duration && (
                        <span className="text-xs" style={{ color: "var(--slate2)" }}>
                          ⏱ {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, "0")}
                        </span>
                      )}
                      {video.viewCount > 0 && (
                        <span className="text-xs" style={{ color: video.viewCount >= 2 ? "var(--green)" : "var(--slate2)" }}>
                          👁 {video.viewCount} view{video.viewCount !== 1 ? "s" : ""}
                        </span>
                      )}
                      <span className="text-xs" style={{ color: "var(--slate2)" }}>Added {formatDate(video.createdAt)}</span>
                    </div>
                    {video.loomUrl && (
                      <a
                        href={video.loomUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs mt-1 inline-block"
                        style={{ color: "var(--cyan)" }}
                      >
                        🔗 {video.loomUrl}
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => { setForm(video); setModal("edit"); }}
                  >
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => remove(video.id)}>✕</button>
                </div>
              </div>
              {video.notes && (
                <div className="mt-3 text-xs px-3 py-2 rounded" style={{ background: "rgba(255,255,255,0.03)", color: "var(--slate)" }}>
                  {video.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Script Modal */}
      {modal === "script" && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal" style={{ maxWidth: 640 }}>
            <h2 className="modal-title">📋 Loom Video Script</h2>
            <p className="text-sm mb-4" style={{ color: "var(--slate)" }}>
              Follow this script when recording your proof video. Under 3 minutes total — no exceptions.
            </p>
            <div
              className="rounded-lg p-4 text-xs leading-relaxed"
              style={{
                background: "#080c18",
                border: "1px solid rgba(37,99,235,0.2)",
                fontFamily: "JetBrains Mono, monospace",
                color: "#D1D5DB",
                whiteSpace: "pre-wrap",
                maxHeight: 500,
                overflow: "auto",
              }}
            >
              {SCRIPT_TEMPLATE}
            </div>
            <div className="mt-4 p-3 rounded-lg text-xs" style={{ background: "rgba(249,115,22,0.07)", border: "1px solid rgba(249,115,22,0.2)", color: "var(--orange)" }}>
              <strong>Key rules:</strong> Face cam must be on. Call their real number live. Under 3 minutes total. End with a specific CTA — &quot;reply 'demo'&quot;.
            </div>
            <div className="flex justify-end mt-4">
              <button className="btn btn-ghost" onClick={() => setModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(modal === "add" || modal === "edit") && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <h2 className="modal-title">{modal === "add" ? "Add Video" : "Edit Video"}</h2>
            <div className="flex flex-col gap-3">
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input className="input" value={form.title ?? ""} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Dave Kim — Aloha Electric missed call demo" />
              </div>
              <div className="form-group">
                <label className="form-label">Prospect (optional)</label>
                <select className="select" value={form.prospect?.id ?? form.prospectId ?? ""} onChange={(e) => setForm({ ...form, prospectId: e.target.value || undefined })}>
                  <option value="">— No prospect assigned —</option>
                  {prospects.map((p) => <option key={p.id} value={p.id}>{p.businessName} ({p.vertical})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Loom URL</label>
                <input className="input" value={form.loomUrl ?? ""} onChange={(e) => setForm({ ...form, loomUrl: e.target.value })} placeholder="https://loom.com/share/..." />
              </div>
              <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="select" value={form.status ?? "draft"} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="draft">Draft</option>
                    <option value="recorded">Recorded</option>
                    <option value="sent">Sent</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Duration (sec)</label>
                  <input className="input" type="number" value={form.duration ?? ""} onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) || undefined })} placeholder="167" />
                </div>
                <div className="form-group">
                  <label className="form-label">View Count</label>
                  <input className="input" type="number" value={form.viewCount ?? 0} onChange={(e) => setForm({ ...form, viewCount: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea className="textarea" rows={2} value={form.notes ?? ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Personalization notes, prospect-specific observations..." />
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" disabled={saving || !form.title} onClick={save}>
                {saving ? "Saving..." : modal === "add" ? "Add Video" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ num, label }: { num: number; label: string }) {
  return (
    <div className="stat-card">
      <div className="stat-num">{num}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
