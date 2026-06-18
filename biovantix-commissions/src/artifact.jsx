import { useState, useMemo } from "react";

// ─── Colors ───────────────────────────────────────────────────────────────────
const C = {
  blue: "#1a56db", blueLight: "#e8f0fe", blueMid: "#2563eb",
  green: "#059669", greenLight: "#d1fae5",
  red: "#dc2626", redLight: "#fee2e2",
  amber: "#d97706", amberLight: "#fef3c7",
  purple: "#7c3aed", purpleLight: "#ede9fe",
  text: "#111827", muted: "#6b7280", bg: "#f3f4f6",
  surface: "#ffffff", border: "#e5e7eb",
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = {
  card: { background: C.surface, borderRadius: 10, border: `1px solid ${C.border}`, boxShadow: "0 1px 3px rgba(0,0,0,.07)", padding: 20 },
  btn: { padding: "8px 16px", borderRadius: 7, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  input: { padding: "8px 12px", border: `1px solid ${C.border}`, borderRadius: 7, fontSize: 13, width: "100%", fontFamily: "inherit", outline: "none", background: C.surface },
  badge: { padding: "2px 9px", borderRadius: 20, fontSize: 11, fontWeight: 700, display: "inline-block" },
  label: { fontSize: 11, color: C.muted, marginBottom: 4, display: "block", textTransform: "uppercase", letterSpacing: 0.5 },
  th: { textAlign: "left", padding: "8px 12px", fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: `2px solid ${C.border}`, whiteSpace: "nowrap" },
  td: { padding: "10px 12px", borderBottom: `1px solid ${C.border}`, fontSize: 13 },
};

// ─── Rep Config ───────────────────────────────────────────────────────────────
const REPS_DEFAULT = [
  { id: 1, name: "Anna Rodríguez",  coupon: "ANNA20",   email: "anna@biovantixlab.com",   splitRep: 20, splitDoctor: 10, splitClinic: 70 },
  { id: 2, name: "Marco Salinas",   coupon: "MARCO15",  email: "marco@biovantixlab.com",  splitRep: 15, splitDoctor: 10, splitClinic: 75 },
  { id: 3, name: "Lucia Vargas",    coupon: "LUCIA25",  email: "lucia@biovantixlab.com",  splitRep: 25, splitDoctor:  8, splitClinic: 67 },
  { id: 4, name: "Daniel Méndez",   coupon: "DANIEL18", email: "daniel@biovantixlab.com", splitRep: 18, splitDoctor: 12, splitClinic: 70 },
];

// ─── Mock Orders ──────────────────────────────────────────────────────────────
const MOCK_ORDERS = [
  { id: 1001, number: "1001", date: "2025-04-03", status: "completed", total: 149, coupon: "ANNA20",   customer: "Sofia Chen" },
  { id: 1002, number: "1002", date: "2025-04-07", status: "completed", total: 299, coupon: "MARCO15",  customer: "Roberto Jiménez" },
  { id: 1003, number: "1003", date: "2025-04-10", status: "completed", total: 149, coupon: "ANNA20",   customer: "Elena Vargas" },
  { id: 1004, number: "1004", date: "2025-04-12", status: "refunded",  total: 299, coupon: "LUCIA25",  customer: "James Tran" },
  { id: 1005, number: "1005", date: "2025-04-15", status: "completed", total: 449, coupon: "ANNA20",   customer: "Patricia Lima" },
  { id: 1006, number: "1006", date: "2025-04-18", status: "completed", total: 149, coupon: "DANIEL18", customer: "Carlos Méndez" },
  { id: 1007, number: "1007", date: "2025-04-20", status: "completed", total: 299, coupon: "LUCIA25",  customer: "Maria Santos" },
  { id: 1008, number: "1008", date: "2025-04-22", status: "completed", total: 149, coupon: "MARCO15",  customer: "David Park" },
  { id: 1009, number: "1009", date: "2025-05-01", status: "completed", total: 599, coupon: "ANNA20",   customer: "Ana Gutiérrez" },
  { id: 1010, number: "1010", date: "2025-05-03", status: "completed", total: 299, coupon: "DANIEL18", customer: "Lucas Ferrari" },
  { id: 1011, number: "1011", date: "2025-05-05", status: "refunded",  total: 149, coupon: "MARCO15",  customer: "Isabel Mora" },
  { id: 1012, number: "1012", date: "2025-05-08", status: "completed", total: 449, coupon: "LUCIA25",  customer: "Tomás Ríos" },
  { id: 1013, number: "1013", date: "2025-05-10", status: "completed", total: 149, coupon: "ANNA20",   customer: "Camila Bravo" },
  { id: 1014, number: "1014", date: "2025-05-12", status: "processing",total: 299, coupon: "MARCO15",  customer: "Felipe Vega" },
  { id: 1015, number: "1015", date: "2025-05-15", status: "completed", total: 599, coupon: "DANIEL18", customer: "Valentina Cruz" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt  = n  => "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtD = s  => new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const pctStr = (a, b) => b ? (a / b * 100).toFixed(1) + "%" : "0%";

function Badge({ label, color, bg }) {
  return <span style={{ ...S.badge, color, background: bg }}>{label}</span>;
}

function statusBadge(status) {
  const m = {
    completed:  [C.green,  C.greenLight],
    refunded:   [C.red,    C.redLight],
    processing: [C.amber,  C.amberLight],
    pending:    [C.muted,  "#f3f4f6"],
    "on-hold":  [C.amber,  C.amberLight],
  };
  const [color, bg] = m[status] || [C.muted, "#f3f4f6"];
  return <Badge label={status} color={color} bg={bg} />;
}

function calc(order, reps) {
  const rep = reps.find(r => r.coupon.toUpperCase() === order.coupon.toUpperCase());
  if (!rep) return null;
  const t = order.total;
  return {
    rep,
    total: t,
    repAmt:    +(t * rep.splitRep    / 100).toFixed(2),
    doctorAmt: +(t * rep.splitDoctor / 100).toFixed(2),
    clinicAmt: +(t * rep.splitClinic / 100).toFixed(2),
    isRefund: ["refunded", "partially-refunded"].includes(order.status),
  };
}

function Modal({ title, onClose, children, wide }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: C.surface, borderRadius: 12, padding: 24, width: "100%", maxWidth: wide ? 700 : 500, maxHeight: "88vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,.18)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ fontSize: 17, fontWeight: 700 }}>{title}</div>
          <button onClick={onClose} style={{ ...S.btn, background: "transparent", color: C.muted, border: `1px solid ${C.border}`, padding: "3px 10px" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const TABS = [
  { key: "dashboard", label: "Dashboard",    icon: "▦" },
  { key: "reps",      label: "Reps",          icon: "◎" },
  { key: "orders",    label: "Orders",        icon: "≡" },
  { key: "refunds",   label: "Refund Recap",  icon: "⚠" },
  { key: "export",    label: "Payroll Export",icon: "⬇" },
];

function Sidebar({ page, setPage, refundCount }) {
  return (
    <div style={{ width: 200, background: C.surface, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", flexShrink: 0, minHeight: "100vh" }}>
      <div style={{ padding: "20px 18px 14px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontWeight: 800, fontSize: 16, color: C.blue, letterSpacing: -0.3 }}>BioVantix</div>
        <div style={{ fontSize: 10, color: C.muted, marginTop: 1, textTransform: "uppercase", letterSpacing: 1 }}>Commission Tracker</div>
      </div>
      <nav style={{ flex: 1, padding: "8px 0" }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setPage(t.key)} style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "9px 18px", border: "none", background: page === t.key ? C.blueLight : "transparent", color: page === t.key ? C.blue : C.muted, fontWeight: page === t.key ? 700 : 400, fontSize: 13, cursor: "pointer", textAlign: "left" }}>
            <span style={{ fontSize: 14 }}>{t.icon}</span>
            {t.label}
            {t.key === "refunds" && refundCount > 0 && (
              <span style={{ marginLeft: "auto", background: C.red, color: "#fff", borderRadius: 10, fontSize: 10, padding: "1px 6px", fontWeight: 800 }}>{refundCount}</span>
            )}
          </button>
        ))}
      </nav>
      <div style={{ padding: "12px 18px", borderTop: `1px solid ${C.border}`, fontSize: 11, color: C.muted }}>biovantixlab.com</div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ orders, reps, setPage }) {
  const enriched = orders.map(o => ({ ...o, c: calc(o, reps) })).filter(o => o.c);
  const done    = enriched.filter(o => o.status === "completed");
  const refunds = enriched.filter(o => o.c.isRefund);

  const rev    = done.reduce((s, o) => s + o.c.total,     0);
  const repC   = done.reduce((s, o) => s + o.c.repAmt,    0);
  const docC   = done.reduce((s, o) => s + o.c.doctorAmt, 0);
  const cliC   = done.reduce((s, o) => s + o.c.clinicAmt, 0);
  const atRisk = refunds.reduce((s, o) => s + o.c.repAmt, 0);

  const byRep = reps.map(r => {
    const ro = done.filter(o => o.c.rep.id === r.id);
    return { r, cnt: ro.length, rev: ro.reduce((s, o) => s + o.c.total, 0), comm: ro.reduce((s, o) => s + o.c.repAmt, 0) };
  }).sort((a, b) => b.comm - a.comm);
  const maxComm = byRep[0]?.comm || 1;

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 22, fontWeight: 800 }}>Dashboard</div>
        <div style={{ color: C.muted, fontSize: 13, marginTop: 3 }}>{done.length} completed orders · {refunds.length} refund{refunds.length !== 1 ? "s" : ""} pending review</div>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 22 }}>
        {[
          ["Revenue",          fmt(rev),    C.blue,   C.blueLight],
          ["Rep Commissions",  fmt(repC),   C.green,  C.greenLight],
          ["Doctor Comms",     fmt(docC),   C.purple, C.purpleLight],
          ["Clinic Retained",  fmt(cliC),   C.muted,  "#f3f4f6"],
          ["Refund at Risk",   fmt(atRisk), C.red,    C.redLight],
        ].map(([l, v, col, bg]) => (
          <div key={l} style={{ ...S.card, background: bg, border: "none", padding: "14px 16px" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: col }}>{v}</div>
            <div style={{ fontSize: 11, color: col, opacity: 0.7, marginTop: 3, fontWeight: 600 }}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        {/* Bar chart */}
        <div style={S.card}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Commission by Rep</div>
          {byRep.map(({ r, cnt, rev: rv, comm }) => (
            <div key={r.id} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{r.name.split(" ")[0]}</span>
                <span style={{ color: C.green, fontWeight: 800, fontSize: 13 }}>{fmt(comm)}</span>
              </div>
              <div style={{ height: 7, borderRadius: 4, background: C.border, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(comm / maxComm) * 100}%`, background: C.blue, borderRadius: 4 }} />
              </div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{cnt} orders · {fmt(rv)} rev · <span style={{ fontFamily: "monospace", color: C.blue }}>{r.coupon}</span></div>
            </div>
          ))}
        </div>

        {/* Split */}
        <div style={S.card}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Overall Split</div>
          <div style={{ display: "flex", height: 28, borderRadius: 8, overflow: "hidden", marginBottom: 14 }}>
            {[
              [repC, C.blue,   "Reps"],
              [docC, C.purple, "Doctors"],
              [cliC, "#9ca3af","Clinic"],
            ].map(([v, col, lbl]) => (
              <div key={lbl} style={{ flex: v || 0, background: col, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 10, fontWeight: 700, minWidth: v > 0 ? 40 : 0 }}>
                {v > 0 ? pctStr(v, rev) : ""}
              </div>
            ))}
          </div>
          {[["Sales Reps", repC, C.blue], ["Doctors", docC, C.purple], ["Clinic", cliC, C.muted]].map(([l, v, c]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
              <span style={{ color: C.muted, fontSize: 13 }}>{l}</span>
              <span style={{ fontWeight: 700, color: c }}>{fmt(v)}</span>
            </div>
          ))}
          {atRisk > 0 && (
            <div onClick={() => setPage("refunds")} style={{ marginTop: 12, padding: "10px 12px", background: C.redLight, borderRadius: 8, display: "flex", justifyContent: "space-between", cursor: "pointer" }}>
              <span style={{ color: C.red, fontWeight: 700, fontSize: 13 }}>⚠ Refund at Risk</span>
              <span style={{ color: C.red, fontWeight: 800 }}>{fmt(atRisk)}</span>
            </div>
          )}
        </div>

        {/* Recent orders */}
        <div style={{ ...S.card, gridColumn: "1/-1" }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Recent Orders</div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 580 }}>
              <thead><tr>{["#", "Date", "Customer", "Coupon", "Rep", "Total", "Rep Comm", "Status"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
              <tbody>
                {[...enriched].reverse().slice(0, 8).map(o => (
                  <tr key={o.id}>
                    <td style={{ ...S.td, fontFamily: "monospace", fontSize: 11 }}>#{o.number}</td>
                    <td style={{ ...S.td, color: C.muted, whiteSpace: "nowrap" }}>{fmtD(o.date)}</td>
                    <td style={S.td}>{o.customer}</td>
                    <td style={{ ...S.td, fontFamily: "monospace", fontSize: 11, color: C.blue, fontWeight: 700 }}>{o.coupon}</td>
                    <td style={{ ...S.td, fontWeight: 600 }}>{o.c.rep.name.split(" ")[0]}</td>
                    <td style={{ ...S.td, fontWeight: 700 }}>{fmt(o.c.total)}</td>
                    <td style={{ ...S.td, color: o.c.isRefund ? C.muted : C.green, fontWeight: 700 }}>{o.c.isRefund ? "—" : fmt(o.c.repAmt)}</td>
                    <td style={S.td}>{statusBadge(o.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Reps ─────────────────────────────────────────────────────────────────────
function Reps({ orders, reps, setReps }) {
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [newForm, setNewForm] = useState({ name: "", coupon: "", email: "", splitRep: 15, splitDoctor: 10, splitClinic: 75 });

  const editRep = reps.find(r => r.id === editId);

  const stats = rep => {
    const ro = orders.filter(o => o.coupon.toUpperCase() === rep.coupon.toUpperCase() && o.status === "completed");
    const rev = ro.reduce((s, o) => s + o.total, 0);
    return { cnt: ro.length, rev, comm: +(rev * rep.splitRep / 100).toFixed(2) };
  };

  const sumOk = f => +f.splitRep + +f.splitDoctor + +f.splitClinic === 100;

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <div style={{ fontSize: 22, fontWeight: 800 }}>Sales Representatives</div>
        <button onClick={() => setAddModal(true)} style={{ ...S.btn, background: C.blue, color: "#fff" }}>+ Add Rep</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
        {reps.map(rep => {
          const { cnt, rev, comm } = stats(rep);
          const refCnt = orders.filter(o => o.coupon.toUpperCase() === rep.coupon.toUpperCase() && ["refunded", "partially-refunded"].includes(o.status)).length;
          return (
            <div key={rep.id} style={S.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{rep.name}</div>
                  <div style={{ fontFamily: "monospace", fontSize: 12, color: C.blue, fontWeight: 700, marginTop: 2 }}>{rep.coupon}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>{rep.email}</div>
                </div>
                <button onClick={() => { setEditId(rep.id); setEditForm({ ...rep }); }} style={{ ...S.btn, background: C.blueLight, color: C.blue, padding: "4px 10px", fontSize: 12 }}>Edit</button>
              </div>

              <div style={{ display: "flex", height: 7, borderRadius: 4, overflow: "hidden", marginBottom: 6 }}>
                <div style={{ width: `${rep.splitRep}%`, background: C.blue }} />
                <div style={{ width: `${rep.splitDoctor}%`, background: C.purple }} />
                <div style={{ width: `${rep.splitClinic}%`, background: "#d1d5db" }} />
              </div>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 14 }}>Rep {rep.splitRep}% · Doctor {rep.splitDoctor}% · Clinic {rep.splitClinic}%</div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {[["Orders", cnt], ["Revenue", fmt(rev)], ["Earned", fmt(comm)]].map(([l, v]) => (
                  <div key={l} style={{ background: C.bg, borderRadius: 7, padding: "7px 8px", textAlign: "center" }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{v}</div>
                    <div style={{ fontSize: 10, color: C.muted }}>{l}</div>
                  </div>
                ))}
              </div>

              {refCnt > 0 && <div style={{ marginTop: 10, padding: "6px 10px", background: C.redLight, borderRadius: 6, fontSize: 12, color: C.red, fontWeight: 600 }}>⚠ {refCnt} refund{refCnt > 1 ? "s" : ""} pending</div>}
            </div>
          );
        })}
      </div>

      {/* Edit */}
      {editForm && (
        <Modal title={`Edit — ${editRep?.name}`} onClose={() => { setEditId(null); setEditForm(null); }}>
          {[["Full Name", "name", "text"], ["Coupon Code", "coupon", "text"], ["Email", "email", "email"]].map(([l, k, t]) => (
            <div key={k} style={{ marginBottom: 12 }}>
              <label style={S.label}>{l}</label>
              <input type={t} value={editForm[k]} onChange={e => setEditForm(p => ({ ...p, [k]: e.target.value }))} style={S.input} />
            </div>
          ))}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
            {[["Rep %", "splitRep"], ["Doctor %", "splitDoctor"], ["Clinic %", "splitClinic"]].map(([l, k]) => (
              <div key={k}><label style={S.label}>{l}</label><input type="number" min={0} max={100} value={editForm[k]} onChange={e => setEditForm(p => ({ ...p, [k]: +e.target.value }))} style={S.input} /></div>
            ))}
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: sumOk(editForm) ? C.green : C.red, marginBottom: 14 }}>
            Total: {+editForm.splitRep + +editForm.splitDoctor + +editForm.splitClinic}% {sumOk(editForm) ? "✓" : "— must equal 100"}
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button onClick={() => { setEditId(null); setEditForm(null); }} style={{ ...S.btn, background: "transparent", color: C.muted, border: `1px solid ${C.border}` }}>Cancel</button>
            <button disabled={!sumOk(editForm)} onClick={() => { setReps(p => p.map(r => r.id === editId ? { ...editForm } : r)); setEditId(null); setEditForm(null); }} style={{ ...S.btn, background: C.blue, color: "#fff", opacity: sumOk(editForm) ? 1 : 0.4 }}>Save</button>
          </div>
        </Modal>
      )}

      {/* Add */}
      {addModal && (
        <Modal title="Add New Rep" onClose={() => setAddModal(false)}>
          {[["Full Name", "name", "text"], ["Coupon Code", "coupon", "text"], ["Email", "email", "email"]].map(([l, k, t]) => (
            <div key={k} style={{ marginBottom: 12 }}>
              <label style={S.label}>{l}</label>
              <input type={t} value={newForm[k]} onChange={e => setNewForm(p => ({ ...p, [k]: e.target.value }))} style={S.input} />
            </div>
          ))}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
            {[["Rep %", "splitRep"], ["Doctor %", "splitDoctor"], ["Clinic %", "splitClinic"]].map(([l, k]) => (
              <div key={k}><label style={S.label}>{l}</label><input type="number" min={0} max={100} value={newForm[k]} onChange={e => setNewForm(p => ({ ...p, [k]: +e.target.value }))} style={S.input} /></div>
            ))}
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: sumOk(newForm) ? C.green : C.red, marginBottom: 14 }}>Total: {+newForm.splitRep + +newForm.splitDoctor + +newForm.splitClinic}%</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button onClick={() => setAddModal(false)} style={{ ...S.btn, background: "transparent", color: C.muted, border: `1px solid ${C.border}` }}>Cancel</button>
            <button onClick={() => { setReps(p => [...p, { id: Date.now(), ...newForm, splitRep: +newForm.splitRep, splitDoctor: +newForm.splitDoctor, splitClinic: +newForm.splitClinic }]); setAddModal(false); }} style={{ ...S.btn, background: C.blue, color: "#fff" }}>Add Rep</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Orders ───────────────────────────────────────────────────────────────────
function Orders({ orders, reps }) {
  const [search, setSearch] = useState("");
  const [filterRep, setFilterRep] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState(null);

  const enriched = orders.map(o => ({ ...o, c: calc(o, reps) })).filter(o => o.c);

  const filtered = useMemo(() => enriched.filter(o => {
    if (filterRep !== "all" && o.c.rep.id !== +filterRep) return false;
    if (filterStatus !== "all" && o.status !== filterStatus) return false;
    if (search && !`${o.number} ${o.customer} ${o.coupon}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [enriched, filterRep, filterStatus, search]);

  const totRevenue = filtered.filter(o => o.status === "completed").reduce((s, o) => s + o.c.total, 0);
  const totRepC    = filtered.filter(o => o.status === "completed").reduce((s, o) => s + o.c.repAmt, 0);

  function exportCSV() {
    const rows = [["Order","Date","Customer","Coupon","Rep","Total","Rep Comm","Doctor Comm","Clinic","Status"]];
    filtered.forEach(o => rows.push([o.number, o.date, o.customer, o.coupon, o.c.rep.name, o.c.total, o.c.repAmt, o.c.doctorAmt, o.c.clinicAmt, o.status]));
    const csv = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const a = document.createElement("a"); a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv); a.download = "commissions.csv"; a.click();
  }

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div style={{ fontSize: 22, fontWeight: 800 }}>Orders</div>
        <button onClick={exportCSV} style={{ ...S.btn, background: C.greenLight, color: C.green }}>⬇ Export CSV</button>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search order, customer, coupon…" style={{ ...S.input, maxWidth: 260 }} />
        <select value={filterRep} onChange={e => setFilterRep(e.target.value)} style={{ ...S.input, width: "auto" }}>
          <option value="all">All Reps</option>
          {reps.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ ...S.input, width: "auto" }}>
          <option value="all">All Statuses</option>
          {["completed","processing","refunded","on-hold","pending"].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        {[["Filtered Revenue", fmt(totRevenue), C.blue, C.blueLight], ["Rep Commissions", fmt(totRepC), C.green, C.greenLight], ["Orders Shown", filtered.length, C.muted, "#f3f4f6"]].map(([l, v, c, bg]) => (
          <div key={l} style={{ ...S.card, background: bg, border: "none", padding: "10px 14px", flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 18, color: c }}>{v}</div>
            <div style={{ fontSize: 11, color: c, opacity: 0.7, marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>

      <div style={S.card}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
            <thead><tr>{["#","Date","Customer","Coupon","Rep","Total","Rep Comm","Dr Comm","Status",""].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} style={{ cursor: "pointer" }} onClick={() => setSelected(o)} onMouseEnter={e => e.currentTarget.style.background = C.bg} onMouseLeave={e => e.currentTarget.style.background = ""}>
                  <td style={{ ...S.td, fontFamily: "monospace", fontSize: 11 }}>#{o.number}</td>
                  <td style={{ ...S.td, color: C.muted, whiteSpace: "nowrap" }}>{fmtD(o.date)}</td>
                  <td style={S.td}>{o.customer}</td>
                  <td style={{ ...S.td, fontFamily: "monospace", fontSize: 11, color: C.blue, fontWeight: 700 }}>{o.coupon}</td>
                  <td style={{ ...S.td, fontWeight: 600 }}>{o.c.rep.name.split(" ")[0]}</td>
                  <td style={{ ...S.td, fontWeight: 700 }}>{fmt(o.c.total)}</td>
                  <td style={{ ...S.td, color: o.c.isRefund ? C.muted : C.green, fontWeight: 700 }}>{o.c.isRefund ? "—" : fmt(o.c.repAmt)}</td>
                  <td style={{ ...S.td, color: o.c.isRefund ? C.muted : C.purple, fontWeight: 700 }}>{o.c.isRefund ? "—" : fmt(o.c.doctorAmt)}</td>
                  <td style={S.td}>{statusBadge(o.status)}</td>
                  <td style={{ ...S.td, color: C.blue, fontWeight: 600, fontSize: 12 }}>→</td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={10} style={{ ...S.td, textAlign: "center", color: C.muted, fontStyle: "italic", padding: 32 }}>No orders match filters</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <Modal title={`Order #${selected.number}`} onClose={() => setSelected(null)} wide>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
            {[["Date", fmtD(selected.date)], ["Status", statusBadge(selected.status)], ["Customer", selected.customer], ["Coupon", selected.coupon], ["Rep", selected.c.rep.name], ["Split", `${selected.c.rep.splitRep}% / ${selected.c.rep.splitDoctor}% / ${selected.c.rep.splitClinic}%`]].map(([l, v]) => (
              <div key={l} style={{ background: C.bg, borderRadius: 7, padding: "9px 12px" }}>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 2 }}>{l}</div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", padding: 14, background: C.blueLight, borderRadius: 10, marginBottom: 18 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: C.blue }}>{fmt(selected.c.total)}</div>
            <div style={{ fontSize: 12, color: C.muted }}>Order Total</div>
          </div>
          <div style={{ display: "flex", height: 24, borderRadius: 6, overflow: "hidden", marginBottom: 14 }}>
            <div style={{ width: `${selected.c.rep.splitRep}%`, background: C.blue, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 10, fontWeight: 700 }}>{selected.c.rep.splitRep}%</div>
            <div style={{ width: `${selected.c.rep.splitDoctor}%`, background: C.purple, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 10, fontWeight: 700 }}>{selected.c.rep.splitDoctor}%</div>
            <div style={{ width: `${selected.c.rep.splitClinic}%`, background: "#9ca3af", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 10, fontWeight: 700 }}>Clinic {selected.c.rep.splitClinic}%</div>
          </div>
          {[["Sales Rep", selected.c.rep.name, selected.c.repAmt, C.blue], ["Doctor", "Clinical team", selected.c.doctorAmt, C.purple], ["Clinic", "BioVantix", selected.c.clinicAmt, C.muted]].map(([role, name, amt, col]) => (
            <div key={role} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: `1px solid ${C.border}` }}>
              <div><div style={{ fontWeight: 600, fontSize: 13 }}>{role}</div><div style={{ fontSize: 11, color: C.muted }}>{name}</div></div>
              <div style={{ fontWeight: 800, color: selected.c.isRefund ? C.muted : col, textDecoration: selected.c.isRefund ? "line-through" : "none" }}>{fmt(amt)}</div>
            </div>
          ))}
          {selected.c.isRefund && <div style={{ marginTop: 12, padding: "9px 12px", background: C.redLight, borderRadius: 8, color: C.red, fontWeight: 600, fontSize: 13 }}>⚠ Refunded — commissions at risk of clawback</div>}
        </Modal>
      )}
    </div>
  );
}

// ─── Refund Recap ─────────────────────────────────────────────────────────────
function RefundRecap({ orders, reps }) {
  const [status, setStatus] = useState({});

  const refunded = orders.map(o => ({ ...o, c: calc(o, reps) })).filter(o => o.c && o.c.isRefund);
  const atRisk   = refunded.reduce((s, o) => s + o.c.repAmt, 0);
  const deducted = refunded.filter(o => status[o.id] === "deducted").reduce((s, o) => s + o.c.repAmt, 0);
  const waived   = refunded.filter(o => status[o.id] === "waived").reduce((s, o) => s + o.c.repAmt, 0);
  const pending  = refunded.filter(o => !status[o.id]);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 22, fontWeight: 800 }}>Refund Recap</div>
        <div style={{ color: C.muted, fontSize: 13, marginTop: 3 }}>Pre-refund commissions shown gross. Resolve all before running payroll.</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 22 }}>
        {[["At Risk", fmt(atRisk), C.red, C.redLight], ["Deducted", fmt(deducted), C.green, C.greenLight], ["Waived", fmt(waived), C.amber, C.amberLight], ["Pending", pending.length, C.red, C.redLight]].map(([l, v, c, bg]) => (
          <div key={l} style={{ ...S.card, background: bg, border: "none", padding: "14px 16px" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: c }}>{v}</div>
            <div style={{ fontSize: 11, color: c, opacity: 0.7, marginTop: 3, fontWeight: 600 }}>{l}</div>
          </div>
        ))}
      </div>

      {refunded.length === 0 ? (
        <div style={{ ...S.card, textAlign: "center", padding: 48, color: C.muted }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>✓</div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>No refunded orders</div>
          <div style={{ fontSize: 13, marginTop: 6 }}>All clear for payroll.</div>
        </div>
      ) : (
        <div style={S.card}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
              <thead><tr>{["Order","Date","Rep","Order Total","Rep at Risk","Dr at Risk","Decision","Actions"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
              <tbody>
                {refunded.map(o => {
                  const st = status[o.id];
                  return (
                    <tr key={o.id}>
                      <td style={{ ...S.td, fontFamily: "monospace", fontSize: 11 }}>#{o.number}</td>
                      <td style={{ ...S.td, color: C.muted, whiteSpace: "nowrap" }}>{fmtD(o.date)}</td>
                      <td style={{ ...S.td, fontWeight: 600 }}>{o.c.rep.name.split(" ")[0]}</td>
                      <td style={{ ...S.td, textDecoration: "line-through", color: C.muted }}>{fmt(o.c.total)}</td>
                      <td style={{ ...S.td, color: C.red, fontWeight: 700 }}>{fmt(o.c.repAmt)}</td>
                      <td style={{ ...S.td, color: C.purple, fontWeight: 700 }}>{fmt(o.c.doctorAmt)}</td>
                      <td style={S.td}>
                        {st === "deducted" && <Badge label="Deducted" color={C.green} bg={C.greenLight} />}
                        {st === "waived"   && <Badge label="Waived"   color={C.amber}  bg={C.amberLight} />}
                        {!st               && <Badge label="Pending"  color={C.red}    bg={C.redLight} />}
                      </td>
                      <td style={S.td}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button onClick={() => setStatus(p => ({ ...p, [o.id]: "deducted" }))} style={{ ...S.btn, background: st === "deducted" ? C.green : C.greenLight, color: st === "deducted" ? "#fff" : C.green, padding: "4px 9px", fontSize: 11 }}>Deduct</button>
                          <button onClick={() => setStatus(p => ({ ...p, [o.id]: "waived"   }))} style={{ ...S.btn, background: st === "waived"   ? C.amber : C.amberLight, color: st === "waived"   ? "#fff" : C.amber,  padding: "4px 9px", fontSize: 11 }}>Waive</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {pending.length > 0 && (
            <div style={{ marginTop: 14, padding: "10px 14px", background: C.redLight, borderRadius: 8, color: C.red, fontWeight: 700, fontSize: 13 }}>
              ⚠ {pending.length} order{pending.length > 1 ? "s" : ""} still pending — resolve before payroll export.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Payroll Export ───────────────────────────────────────────────────────────
function Export({ orders, reps }) {
  const [period, setPeriod] = useState("2025-05");

  const enriched = orders
    .filter(o => o.date.startsWith(period) && o.status === "completed")
    .map(o => ({ ...o, c: calc(o, reps) }))
    .filter(o => o.c);

  const byRep = reps.map(rep => {
    const ro = enriched.filter(o => o.c.rep.id === rep.id);
    const rev  = ro.reduce((s, o) => s + o.c.total, 0);
    const comm = ro.reduce((s, o) => s + o.c.repAmt, 0);
    const docC = ro.reduce((s, o) => s + o.c.doctorAmt, 0);
    return { rep, orders: ro.length, revenue: rev, repComm: comm, doctorComm: docC };
  });

  const refunded = orders.filter(o => o.date.startsWith(period) && o.c?.isRefund);

  function downloadPayroll() {
    const rows = [["Rep Name","Coupon","Orders","Revenue","Rep Commission","Doctor Commission","Period"]];
    byRep.forEach(b => rows.push([b.rep.name, b.rep.coupon, b.orders, b.revenue.toFixed(2), b.repComm.toFixed(2), b.doctorComm.toFixed(2), period]));
    const csv = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const a = document.createElement("a"); a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv); a.download = `payroll-${period}.csv`; a.click();
  }

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>Payroll Export</div>
          <div style={{ color: C.muted, fontSize: 13, marginTop: 3 }}>Pre-refund gross commissions. Resolve refunds first.</div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input type="month" value={period} onChange={e => setPeriod(e.target.value)} style={{ ...S.input, width: "auto" }} />
          <button onClick={downloadPayroll} style={{ ...S.btn, background: C.blue, color: "#fff" }}>⬇ Download CSV</button>
        </div>
      </div>

      <div style={S.card}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>{["Rep","Coupon","Orders","Revenue","Rep Commission","Doctor Commission","Rep %","Dr %"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>
              {byRep.map(({ rep, orders: cnt, revenue, repComm, doctorComm }) => (
                <tr key={rep.id}>
                  <td style={{ ...S.td, fontWeight: 700 }}>{rep.name}</td>
                  <td style={{ ...S.td, fontFamily: "monospace", fontSize: 11, color: C.blue, fontWeight: 700 }}>{rep.coupon}</td>
                  <td style={S.td}>{cnt}</td>
                  <td style={{ ...S.td, fontWeight: 600 }}>{fmt(revenue)}</td>
                  <td style={{ ...S.td, fontWeight: 800, color: C.green }}>{fmt(repComm)}</td>
                  <td style={{ ...S.td, fontWeight: 800, color: C.purple }}>{fmt(doctorComm)}</td>
                  <td style={S.td}>{rep.splitRep}%</td>
                  <td style={S.td}>{rep.splitDoctor}%</td>
                </tr>
              ))}
              <tr style={{ background: C.bg }}>
                <td style={{ ...S.td, fontWeight: 800 }} colSpan={2}>TOTAL</td>
                <td style={{ ...S.td, fontWeight: 800 }}>{byRep.reduce((s, b) => s + b.orders, 0)}</td>
                <td style={{ ...S.td, fontWeight: 800 }}>{fmt(byRep.reduce((s, b) => s + b.revenue, 0))}</td>
                <td style={{ ...S.td, fontWeight: 800, color: C.green }}>{fmt(byRep.reduce((s, b) => s + b.repComm, 0))}</td>
                <td style={{ ...S.td, fontWeight: 800, color: C.purple }}>{fmt(byRep.reduce((s, b) => s + b.doctorComm, 0))}</td>
                <td style={S.td} colSpan={2} />
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {refunded.length > 0 && (
        <div style={{ marginTop: 16, padding: "12px 16px", background: C.redLight, borderRadius: 8, color: C.red, fontWeight: 700 }}>
          ⚠ {refunded.length} refund{refunded.length > 1 ? "s" : ""} in this period not yet resolved — go to Refund Recap before paying out.
        </div>
      )}
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [reps, setReps]   = useState(REPS_DEFAULT);
  const orders = useMemo(() => MOCK_ORDERS.map(o => ({ ...o, c: calc(o, reps) })), [reps]);
  const refundCount = orders.filter(o => o.c?.isRefund).length;

  const props = { orders, reps, setReps, setPage };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: "Inter, system-ui, sans-serif", background: C.bg }}>
      <Sidebar page={page} setPage={setPage} refundCount={refundCount} />
      {page === "dashboard" && <Dashboard {...props} />}
      {page === "reps"      && <Reps      {...props} />}
      {page === "orders"    && <Orders    orders={orders} reps={reps} />}
      {page === "refunds"   && <RefundRecap orders={orders} reps={reps} />}
      {page === "export"    && <Export    orders={orders} reps={reps} />}
    </div>
  );
}
