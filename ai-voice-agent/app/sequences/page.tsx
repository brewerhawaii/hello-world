"use client";
import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";

interface Touch {
  id: string;
  day: number;
  channel: string;
  status: string;
  sentAt?: string;
  videoUrl?: string;
  content?: string;
  subject?: string;
}

interface Sequence {
  id: string;
  status: string;
  currentStep: number;
  startedAt: string;
  completedAt?: string;
  prospect: {
    id: string;
    businessName: string;
    ownerName?: string;
    phone: string;
    city: string;
    vertical: string;
  };
  touches: Touch[];
}

interface Prospect {
  id: string;
  businessName: string;
  ownerName?: string;
  vertical: string;
  city: string;
  status: string;
}

const CHANNEL_ICONS: Record<string, string> = {
  email: "✉️",
  sms: "💬",
  gbm: "📍",
  voicemail: "📞",
};

const TOUCH_TEMPLATES: Record<number, Record<string, { subject?: string; content: string }>> = {
  1: {
    gbm: { content: "Hi [Name] — I called your number today and it went to voicemail. I recorded exactly what happened (and what should happen instead). Worth 3 minutes: [LOOM_URL]" },
    email: { subject: "I called you today, [Business]...", content: "Hi [Owner],\n\nI tried calling [Business] today — it went to voicemail.\n\nI recorded what that call sounded like for a homeowner in an emergency, and what it should sound like instead.\n\nWatch it here (under 3 min): [LOOM_URL]\n\nReply with 'demo' and I'll set this up on your number in 48 hours.\n\n— [Your Name]" },
  },
  3: {
    email: { subject: "Quick follow-up — [Business]", content: "Hi [Owner],\n\nDid you get a chance to watch that video?\n\nSolo service businesses lose $10K–$15K/month in missed calls. 73% of callers never leave a voicemail — they just call your competitor.\n\nOne recovered emergency call covers 6 months of the service.\n\nReply 'yes' and I'll show you the full setup.\n\n— [Your Name]" },
  },
  6: {
    sms: { content: "Hi [Owner], following up on the video I sent about [Business]'s missed calls. Still interested in seeing the demo? — [Your Name]" },
    voicemail: { content: "Hey [Owner], it's [Your Name] — just following up on that video I sent you earlier this week about the calls you might be missing at [Business]. No pitch, just want to show you the demo. Call me back at [Your Number] whenever works. Thanks!" },
  },
  10: {
    email: { subject: "Closing your file — [Business]", content: "Hi [Owner],\n\nI wanted to close your file since I haven't heard back.\n\nIf the timing isn't right, no worries at all — I'll check back in a few months.\n\nIf you'd still like to see the demo, just reply and I'll carve out 15 minutes this week.\n\nEither way, hope the business is going well.\n\n— [Your Name]" },
  },
};

export default function SequencesPage() {
  const [sequences, setSequences] = useState<Sequence[]>([]);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [addModal, setAddModal] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState("");
  const [touchModal, setTouchModal] = useState<Touch | null>(null);
  const [touchForm, setTouchForm] = useState<Partial<Touch>>({});
  const [saving, setSaving] = useState(false);

  function load() {
    const q = filter !== "all" ? `?status=${filter}` : "";
    fetch(`/api/sequences${q}`).then((r) => r.json()).then(setSequences);
    fetch("/api/prospects?status=new,contacted,demo_sent,interested").then((r) => r.json()).then(setProspects);
  }

  useEffect(load, [filter]);

  async function startSequence() {
    if (!selectedProspect) return;
    setSaving(true);
    await fetch("/api/sequences", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prospectId: selectedProspect }) });
    setSaving(false);
    setAddModal(false);
    setSelectedProspect("");
    load();
  }

  async function updateTouchStatus(touchId: string, status: string, extra: Partial<Touch> = {}) {
    setSaving(true);
    await fetch("/api/sequences/touch", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ touchId, status, ...extra }) });
    setSaving(false);
    setTouchModal(null);
    load();
  }

  async function updateSeqStatus(id: string, status: string) {
    await fetch(`/api/sequences/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    load();
  }

  function openTouchModal(touch: Touch) {
    const template = TOUCH_TEMPLATES[touch.day]?.[touch.channel];
    setTouchForm({ ...touch, content: touch.content ?? template?.content ?? "", subject: touch.subject ?? template?.subject ?? "", videoUrl: touch.videoUrl ?? "" });
    setTouchModal(touch);
  }

  const touchStatusColor: Record<string, string> = {
    pending: "badge-slate",
    sent: "badge-cyan",
    opened: "badge-blue",
    clicked: "badge-purple",
    replied: "badge-green",
    bounced: "badge-red",
  };

  const seqStatusColor: Record<string, string> = {
    active: "badge-cyan",
    paused: "badge-yellow",
    completed: "badge-blue",
    replied: "badge-green",
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Outreach Sequences</h1>
          <p className="page-sub">4-touch sequences per prospect. Track every touchpoint.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setAddModal(true)}>
          + Start Sequence
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-3 mb-5">
        {["all", "active", "replied", "paused", "completed"].map((s) => (
          <button
            key={s}
            className="btn btn-ghost btn-sm"
            style={filter === s ? { background: "rgba(0,212,255,0.1)", color: "var(--cyan)", borderColor: "rgba(0,212,255,0.3)" } : {}}
            onClick={() => setFilter(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
        <div className="ml-auto text-sm" style={{ color: "var(--slate2)" }}>
          {sequences.length} sequence{sequences.length !== 1 ? "s" : ""}
        </div>
      </div>

      {sequences.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📬</div>
          <div className="font-semibold">No sequences yet</div>
          <div className="text-sm">Start a sequence for a prospect to begin the 4-touch outreach.</div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sequences.map((seq) => {
            const isOpen = expanded === seq.id;
            const sentCount = seq.touches.filter((t) => t.status !== "pending").length;
            const totalCount = seq.touches.length;

            return (
              <div key={seq.id} className="card overflow-hidden">
                <div
                  className="flex items-center gap-4 p-4 cursor-pointer"
                  onClick={() => setExpanded(isOpen ? null : seq.id)}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-sm">{seq.prospect.businessName}</span>
                      <span className={`badge ${seqStatusColor[seq.status] ?? "badge-slate"}`}>{seq.status}</span>
                    </div>
                    <div className="text-xs" style={{ color: "var(--slate2)" }}>
                      {seq.prospect.ownerName && `${seq.prospect.ownerName} · `}
                      {seq.prospect.vertical} · {seq.prospect.city} · Started {formatDate(seq.startedAt)}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="flex-1 mx-4">
                    <div className="flex gap-1">
                      {seq.touches.filter((t, i, arr) => arr.findIndex(x => x.day === t.day) === i).map((t) => (
                        <div key={t.day} className="flex-1 relative">
                          <div
                            className="h-1.5 rounded-full transition-all"
                            style={{
                              background: seq.touches.filter(x => x.day === t.day).some(x => x.status !== "pending")
                                ? "var(--cyan)"
                                : "rgba(255,255,255,0.08)",
                            }}
                          />
                          <div className="text-center text-xs mt-0.5" style={{ color: "var(--slate2)", fontSize: 10 }}>D{t.day}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: "var(--slate2)" }}>{sentCount}/{totalCount}</span>
                    <select
                      className="select text-xs py-1 px-2"
                      value={seq.status}
                      style={{ minWidth: 90 }}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => { e.stopPropagation(); updateSeqStatus(seq.id, e.target.value); }}
                    >
                      {["active","paused","completed","replied"].map((s) => <option key={s}>{s}</option>)}
                    </select>
                    <span style={{ color: "var(--slate2)" }}>{isOpen ? "▲" : "▼"}</span>
                  </div>
                </div>

                {isOpen && (
                  <div className="border-t px-4 pb-4 pt-3" style={{ borderColor: "var(--border)" }}>
                    <div className="flex flex-col gap-2">
                      {seq.touches.map((touch) => (
                        <div
                          key={touch.id}
                          className="flex items-center gap-3 p-3 rounded-lg"
                          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                        >
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                            style={{ background: "var(--navy3)" }}
                          >
                            {CHANNEL_ICONS[touch.channel] ?? "📤"}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold" style={{ color: "#93C5FD" }}>Day {touch.day}</span>
                              <span className="badge badge-slate text-xs" style={{ fontSize: 10 }}>{touch.channel.toUpperCase()}</span>
                              <span className={`badge ${touchStatusColor[touch.status] ?? "badge-slate"} text-xs`} style={{ fontSize: 10 }}>{touch.status}</span>
                            </div>
                            {touch.sentAt && (
                              <div className="text-xs" style={{ color: "var(--slate2)", fontSize: 10 }}>
                                Sent {formatDate(touch.sentAt)}
                              </div>
                            )}
                            {touch.videoUrl && (
                              <div className="text-xs mt-0.5" style={{ color: "var(--cyan)", fontSize: 10 }}>
                                🎥 {touch.videoUrl}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-1">
                            {touch.status === "pending" && (
                              <button className="btn btn-primary btn-sm" onClick={() => openTouchModal(touch)}>
                                Mark Sent
                              </button>
                            )}
                            {touch.status === "sent" && (
                              <>
                                <button className="btn btn-ghost btn-sm" onClick={() => updateTouchStatus(touch.id, "opened")}>Opened</button>
                                <button className="btn btn-ghost btn-sm" onClick={() => updateTouchStatus(touch.id, "replied")}>Replied ✓</button>
                              </>
                            )}
                            {touch.status === "opened" && (
                              <button className="btn btn-ghost btn-sm" onClick={() => updateTouchStatus(touch.id, "replied")}>Replied ✓</button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add sequence modal */}
      {addModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setAddModal(false)}>
          <div className="modal">
            <h2 className="modal-title">Start Outreach Sequence</h2>
            <p className="text-sm mb-4" style={{ color: "var(--slate)" }}>
              This will create a 4-touch sequence (Day 1, 3, 6, 10) for the selected prospect and move them to &quot;Contacted&quot; status.
            </p>
            <div className="form-group mb-4">
              <label className="form-label">Select Prospect</label>
              <select className="select" value={selectedProspect} onChange={(e) => setSelectedProspect(e.target.value)}>
                <option value="">— Choose a prospect —</option>
                {prospects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.businessName} — {p.vertical} — {p.city}
                  </option>
                ))}
              </select>
            </div>
            {selectedProspect && (
              <div className="card p-3 mb-4 text-sm" style={{ background: "rgba(0,212,255,0.04)" }}>
                <div className="text-xs font-bold mb-2" style={{ color: "var(--cyan)" }}>SEQUENCE WILL CREATE:</div>
                <div className="flex flex-col gap-1.5">
                  {[
                    { day: 1, channels: "GBM + Email", content: "Loom video — 'I called you today...'" },
                    { day: 3, channels: "Email", content: "Follow-up — '$10K/mo stat'" },
                    { day: 6, channels: "SMS + Voicemail drop", content: "20-sec casual audio follow-up" },
                    { day: 10, channels: "Email", content: "'Closing your file' urgency" },
                  ].map((t) => (
                    <div key={t.day} className="flex gap-3 items-center">
                      <span className="badge badge-blue" style={{ minWidth: 50, justifyContent: "center" }}>Day {t.day}</span>
                      <span className="badge badge-cyan text-xs">{t.channels}</span>
                      <span className="text-xs" style={{ color: "var(--slate)" }}>{t.content}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-2 justify-end">
              <button className="btn btn-ghost" onClick={() => setAddModal(false)}>Cancel</button>
              <button className="btn btn-primary" disabled={!selectedProspect || saving} onClick={startSequence}>
                {saving ? "Starting..." : "Start Sequence"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Touch detail modal */}
      {touchModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setTouchModal(null)}>
          <div className="modal">
            <h2 className="modal-title">
              {CHANNEL_ICONS[touchModal.channel]} Day {touchModal.day} — {touchModal.channel.toUpperCase()}
            </h2>
            <p className="text-sm mb-4" style={{ color: "var(--slate)" }}>
              Edit the message, add video URL, then mark as sent.
            </p>
            <div className="flex flex-col gap-3">
              {(touchModal.channel === "email" || touchModal.channel === "gbm") && (
                <div className="form-group">
                  <label className="form-label">Subject Line</label>
                  <input className="input" value={touchForm.subject ?? ""} onChange={(e) => setTouchForm({ ...touchForm, subject: e.target.value })} />
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Message Body</label>
                <textarea
                  className="textarea"
                  rows={6}
                  value={touchForm.content ?? ""}
                  onChange={(e) => setTouchForm({ ...touchForm, content: e.target.value })}
                  placeholder="Personalize the message for this prospect..."
                />
              </div>
              {(touchModal.day === 1) && (
                <div className="form-group">
                  <label className="form-label">Loom Video URL</label>
                  <input
                    className="input"
                    value={touchForm.videoUrl ?? ""}
                    onChange={(e) => setTouchForm({ ...touchForm, videoUrl: e.target.value })}
                    placeholder="https://loom.com/share/..."
                  />
                </div>
              )}
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <button className="btn btn-ghost" onClick={() => setTouchModal(null)}>Cancel</button>
              <button
                className="btn btn-primary"
                disabled={saving}
                onClick={() => updateTouchStatus(touchModal.id, "sent", { videoUrl: touchForm.videoUrl, content: touchForm.content, subject: touchForm.subject })}
              >
                {saving ? "Saving..." : "Mark as Sent"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
