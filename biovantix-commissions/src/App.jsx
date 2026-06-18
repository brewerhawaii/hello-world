import { useState, useMemo } from 'react'

// ─── Theme ────────────────────────────────────────────────────────────────────
const C = {
  blue: '#1a56db', blueLight: '#e8f0fe', blueMid: '#2563eb',
  green: '#059669', greenLight: '#d1fae5',
  red: '#dc2626', redLight: '#fee2e2',
  amber: '#d97706', amberLight: '#fef3c7',
  purple: '#7c3aed', purpleLight: '#ede9fe',
  text: '#111827', muted: '#6b7280', bg: '#f3f4f6',
  surface: '#ffffff', border: '#e5e7eb',
}
const S = {
  card: { background: C.surface, borderRadius: 10, border: `1px solid ${C.border}`, boxShadow: '0 1px 3px rgba(0,0,0,.07)', padding: 20 },
  btn: { padding: '8px 16px', borderRadius: 7, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  input: { padding: '8px 12px', border: `1px solid ${C.border}`, borderRadius: 7, fontSize: 13, width: '100%', fontFamily: 'inherit', outline: 'none', background: C.surface },
  badge: { padding: '2px 9px', borderRadius: 20, fontSize: 12, fontWeight: 600, display: 'inline-block' },
  label: { fontSize: 11, color: C.muted, marginBottom: 4, display: 'block', textTransform: 'uppercase', letterSpacing: .5 },
  th: { textAlign: 'left', padding: '8px 12px', fontSize: 11, color: C.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .5, borderBottom: `2px solid ${C.border}` },
  td: { padding: '11px 12px', borderBottom: `1px solid ${C.border}`, fontSize: 13 },
}

// ─── WooCommerce API ──────────────────────────────────────────────────────────
// Replace these with real credentials when available.
// All API calls are CORS-proxied via the same domain in production.
const WC_CONFIG = {
  url: 'https://biovantixlab.com',
  ck: 'ck_REPLACE_WITH_CONSUMER_KEY',
  cs: 'cs_REPLACE_WITH_CONSUMER_SECRET',
}

async function wcFetch(endpoint, params = {}) {
  const url = new URL(`${WC_CONFIG.url}/wp-json/wc/v3/${endpoint}`)
  url.searchParams.set('consumer_key', WC_CONFIG.ck)
  url.searchParams.set('consumer_secret', WC_CONFIG.cs)
  url.searchParams.set('per_page', '100')
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`WC API ${res.status}: ${await res.text()}`)
  return res.json()
}

// ─── Rep Config ───────────────────────────────────────────────────────────────
// Defines coupon → rep → commission splits.
// Split: { rep, doctor, clinic } must sum to 100.
const REP_CONFIG_DEFAULT = [
  { id: 1, name: 'Anna Rodríguez',  coupon: 'ANNA20',  email: 'anna@biovantixlab.com',  splitRep: 20, splitDoctor: 10, splitClinic: 70 },
  { id: 2, name: 'Marco Salinas',   coupon: 'MARCO15', email: 'marco@biovantixlab.com', splitRep: 15, splitDoctor: 10, splitClinic: 75 },
  { id: 3, name: 'Lucia Vargas',    coupon: 'LUCIA25', email: 'lucia@biovantixlab.com', splitRep: 25, splitDoctor:  8, splitClinic: 67 },
  { id: 4, name: 'Daniel Méndez',   coupon: 'DANIEL18',email: 'daniel@biovantixlab.com',splitRep: 18, splitDoctor: 12, splitClinic: 70 },
]

// ─── Mock Order Data ──────────────────────────────────────────────────────────
// Used when WooCommerce credentials are not yet set.
// Each order mirrors the WooCommerce REST API shape we need.
function buildMockOrders() {
  const raw = [
    { id: 1001, number: '1001', date: '2025-05-03', status: 'completed', total: '149.00', coupon: 'ANNA20',   discount: '37.25' },
    { id: 1002, number: '1002', date: '2025-05-07', status: 'completed', total: '299.00', coupon: 'MARCO15',  discount: '52.33' },
    { id: 1003, number: '1003', date: '2025-05-10', status: 'completed', total: '149.00', coupon: 'ANNA20',   discount: '37.25' },
    { id: 1004, number: '1004', date: '2025-05-12', status: 'refunded',  total: '299.00', coupon: 'LUCIA25',  discount: '74.75' },
    { id: 1005, number: '1005', date: '2025-05-15', status: 'completed', total: '449.00', coupon: 'ANNA20',   discount: '112.25' },
    { id: 1006, number: '1006', date: '2025-05-18', status: 'completed', total: '149.00', coupon: 'DANIEL18', discount: '26.82' },
    { id: 1007, number: '1007', date: '2025-05-20', status: 'completed', total: '299.00', coupon: 'LUCIA25',  discount: '74.75' },
    { id: 1008, number: '1008', date: '2025-05-22', status: 'completed', total: '149.00', coupon: 'MARCO15',  discount: '26.18' },
    { id: 1009, number: '1009', date: '2025-06-01', status: 'completed', total: '599.00', coupon: 'ANNA20',   discount: '149.75' },
    { id: 1010, number: '1010', date: '2025-06-03', status: 'completed', total: '299.00', coupon: 'DANIEL18', discount: '53.82' },
    { id: 1011, number: '1011', date: '2025-06-05', status: 'refunded',  total: '149.00', coupon: 'MARCO15',  discount: '26.18' },
    { id: 1012, number: '1012', date: '2025-06-08', status: 'completed', total: '449.00', coupon: 'LUCIA25',  discount: '112.25' },
  ]
  return raw.map(o => ({
    id: o.id,
    number: o.number,
    date_created: o.date + 'T10:00:00',
    status: o.status,
    total: o.total,
    coupon_lines: [{ code: o.coupon, discount: o.discount }],
    billing: { first_name: 'Customer', last_name: `#${o.id}`, email: `customer${o.id}@example.com` },
    _isMock: true,
  }))
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(n) { return '$' + parseFloat(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
function fmtDate(s) { return new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
function pct(n) { return (parseFloat(n) * 100).toFixed(1) + '%' }

function Badge({ label, color, bg }) {
  return <span style={{ ...S.badge, color, background: bg }}>{label}</span>
}

function statusBadge(status) {
  const m = { completed: [C.green, C.greenLight], refunded: [C.red, C.redLight], processing: [C.amber, C.amberLight], pending: [C.muted, '#f3f4f6'], 'on-hold': [C.amber, C.amberLight] }
  const [color, bg] = m[status] || [C.muted, '#f3f4f6']
  return <Badge label={status} color={color} bg={bg} />
}

function Modal({ title, onClose, children, wide }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: C.surface, borderRadius: 12, padding: 28, width: '100%', maxWidth: wide ? 760 : 520, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,.18)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} style={{ ...S.btn, background: 'transparent', color: C.muted, border: `1px solid ${C.border}`, padding: '4px 10px' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ─── Commission calculator ────────────────────────────────────────────────────
function calcCommission(order, repConfig) {
  const couponCode = (order.coupon_lines?.[0]?.code || '').toUpperCase()
  const rep = repConfig.find(r => r.coupon.toUpperCase() === couponCode)
  if (!rep) return null
  const total = parseFloat(order.total)
  return {
    rep,
    orderTotal: total,
    repAmt:    +(total * rep.splitRep    / 100).toFixed(2),
    doctorAmt: +(total * rep.splitDoctor / 100).toFixed(2),
    clinicAmt: +(total * rep.splitClinic / 100).toFixed(2),
    couponCode,
    isRefund: ['refunded', 'partially-refunded'].includes(order.status),
  }
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const NAV = [
  { key: 'dashboard',  label: 'Dashboard',   icon: '◈' },
  { key: 'reps',       label: 'Reps',         icon: '◎' },
  { key: 'orders',     label: 'Orders',       icon: '◉' },
  { key: 'refunds',    label: 'Refund Recap', icon: '⚠' },
  { key: 'coupons',    label: 'Coupons',      icon: '⊛' },
  { key: 'settings',   label: 'Settings',     icon: '⊕' },
]

function Sidebar({ page, setPage, isMock }) {
  return (
    <div style={{ width: 210, background: C.surface, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      <div style={{ padding: '22px 20px 14px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontWeight: 800, fontSize: 17, color: C.blue, letterSpacing: -.3 }}>BioVantix</div>
        <div style={{ fontSize: 11, color: C.muted, marginTop: 2, textTransform: 'uppercase', letterSpacing: 1 }}>Commission Tracker</div>
      </div>
      <nav style={{ flex: 1, padding: '10px 0' }}>
        {NAV.map(n => (
          <button key={n.key} onClick={() => setPage(n.key)} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 20px', border: 'none', background: page === n.key ? C.blueLight : 'transparent', color: page === n.key ? C.blue : C.muted, fontWeight: page === n.key ? 700 : 400, fontSize: 13, cursor: 'pointer', textAlign: 'left' }}>
            <span style={{ fontSize: 15 }}>{n.icon}</span>{n.label}
            {n.key === 'refunds' && <span style={{ marginLeft: 'auto', background: C.red, color: '#fff', borderRadius: 10, fontSize: 10, padding: '1px 6px', fontWeight: 700 }}>!</span>}
          </button>
        ))}
      </nav>
      {isMock && (
        <div style={{ margin: '0 12px 12px', padding: '8px 12px', background: C.amberLight, borderRadius: 8, fontSize: 11, color: C.amber, fontWeight: 600 }}>
          ⚠ Demo data — connect WooCommerce in Settings
        </div>
      )}
      <div style={{ padding: '12px 20px', borderTop: `1px solid ${C.border}`, fontSize: 12, color: C.muted }}>
        biovantixlab.com · Admin
      </div>
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ orders, repConfig, setPage }) {
  const enriched = orders.map(o => ({ ...o, _comm: calcCommission(o, repConfig) })).filter(o => o._comm)
  const completed = enriched.filter(o => o.status === 'completed')
  const refunded  = enriched.filter(o => o._comm.isRefund)

  const totalRevenue    = completed.reduce((s, o) => s + o._comm.orderTotal, 0)
  const totalRepComm    = completed.reduce((s, o) => s + o._comm.repAmt, 0)
  const totalDoctorComm = completed.reduce((s, o) => s + o._comm.doctorAmt, 0)
  const totalClinicRev  = completed.reduce((s, o) => s + o._comm.clinicAmt, 0)
  const refundAtRisk    = refunded.reduce((s, o) => s + o._comm.repAmt, 0)

  const byRep = repConfig.map(rep => {
    const repOrders = completed.filter(o => o._comm.rep.id === rep.id)
    return { rep, count: repOrders.length, revenue: repOrders.reduce((s, o) => s + o._comm.orderTotal, 0), commission: repOrders.reduce((s, o) => s + o._comm.repAmt, 0) }
  }).sort((a, b) => b.commission - a.commission)

  const KPIs = [
    ['Total Revenue', fmt(totalRevenue), C.blue, C.blueLight],
    ['Rep Commissions', fmt(totalRepComm), C.green, C.greenLight],
    ['Doctor Commissions', fmt(totalDoctorComm), C.purple, C.purpleLight],
    ['Clinic Retained', fmt(totalClinicRev), C.muted, '#f3f4f6'],
    ['Refund At Risk', fmt(refundAtRisk), C.red, C.redLight],
  ]

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: 28 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>Dashboard</h1>
      <p style={{ color: C.muted, marginBottom: 24 }}>All-time · {completed.length} completed orders · {refunded.length} refunds pending review</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14, marginBottom: 28 }}>
        {KPIs.map(([label, val, color, bg]) => (
          <div key={label} style={{ ...S.card, background: bg, border: 'none' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color }}>{val}</div>
            <div style={{ fontSize: 12, color, opacity: .75, marginTop: 4, fontWeight: 500 }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={S.card}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Commission by Rep</h3>
          {byRep.map(({ rep, count, revenue, commission }) => {
            const maxC = byRep[0]?.commission || 1
            return (
              <div key={rep.id} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontWeight: 600 }}>{rep.name}</span>
                  <span style={{ color: C.green, fontWeight: 700 }}>{fmt(commission)}</span>
                </div>
                <div style={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', background: C.border }}>
                  <div style={{ width: `${(commission / maxC) * 100}%`, background: C.blue, borderRadius: 3 }} />
                </div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>{count} orders · {fmt(revenue)} revenue · {rep.coupon}</div>
              </div>
            )
          })}
        </div>

        <div style={S.card}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Commission Split (all orders)</h3>
          <div style={{ display: 'flex', height: 32, borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ flex: totalRepComm, background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700 }}>Reps {pct(totalRepComm / totalRevenue)}</div>
            <div style={{ flex: totalDoctorComm, background: C.purple, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700 }}>Dr {pct(totalDoctorComm / totalRevenue)}</div>
            <div style={{ flex: totalClinicRev, background: '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700 }}>Clinic {pct(totalClinicRev / totalRevenue)}</div>
          </div>
          {[['Sales Reps', totalRepComm, C.blue], ['Doctors', totalDoctorComm, C.purple], ['Clinic', totalClinicRev, C.muted]].map(([l, v, col]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
              <span style={{ color: C.muted }}>{l}</span>
              <span style={{ fontWeight: 700, color: col }}>{fmt(v)}</span>
            </div>
          ))}
          {refundAtRisk > 0 && (
            <div style={{ marginTop: 14, padding: '10px 14px', background: C.redLight, borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: C.red, fontWeight: 600 }}>⚠ Refund at Risk</span>
              <span style={{ color: C.red, fontWeight: 800 }}>{fmt(refundAtRisk)}</span>
            </div>
          )}
          <button onClick={() => setPage('refunds')} style={{ ...S.btn, background: C.redLight, color: C.red, marginTop: 14, width: '100%' }}>Review Refund Recap →</button>
        </div>

        <div style={{ ...S.card, gridColumn: '1/-1' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Recent Orders</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>{['Order', 'Date', 'Customer', 'Coupon', 'Rep', 'Total', 'Rep Comm.', 'Status'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>
              {enriched.slice(-8).reverse().map(o => (
                <tr key={o.id}>
                  <td style={{ ...S.td, fontFamily: 'var(--mono)', fontSize: 12 }}>#{o.number}</td>
                  <td style={{ ...S.td, color: C.muted }}>{fmtDate(o.date_created)}</td>
                  <td style={S.td}>{o.billing.first_name} {o.billing.last_name}</td>
                  <td style={{ ...S.td, fontFamily: 'var(--mono)', fontSize: 12, color: C.blue }}>{o._comm.couponCode}</td>
                  <td style={{ ...S.td, fontWeight: 600 }}>{o._comm.rep.name.split(' ')[0]}</td>
                  <td style={{ ...S.td, fontWeight: 600 }}>{fmt(o._comm.orderTotal)}</td>
                  <td style={{ ...S.td, color: C.green, fontWeight: 700 }}>{o._comm.isRefund ? '—' : fmt(o._comm.repAmt)}</td>
                  <td style={S.td}>{statusBadge(o.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── Reps ─────────────────────────────────────────────────────────────────────
function Reps({ orders, repConfig, setRepConfig }) {
  const [editRep, setEditRep] = useState(null)
  const [addModal, setAddModal] = useState(false)
  const [form, setForm] = useState({ name: '', coupon: '', email: '', splitRep: 15, splitDoctor: 10, splitClinic: 75 })
  function saveEdit() {
    setRepConfig(prev => prev.map(r => r.id === editRep.id ? { ...editRep } : r))
    setEditRep(null)
  }

  function addRep() {
    setRepConfig(prev => [...prev, { id: Date.now(), ...form, splitRep: +form.splitRep, splitDoctor: +form.splitDoctor, splitClinic: +form.splitClinic }])
    setAddModal(false)
    setForm({ name: '', coupon: '', email: '', splitRep: 15, splitDoctor: 10, splitClinic: 75 })
  }

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Sales Representatives</h1>
        <button onClick={() => setAddModal(true)} style={{ ...S.btn, background: C.blue, color: '#fff' }}>+ Add Rep</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {repConfig.map(rep => {
          const repOrders = orders.filter(o => (o.coupon_lines?.[0]?.code || '').toUpperCase() === rep.coupon.toUpperCase())
          const completed = repOrders.filter(o => o.status === 'completed')
          const refunded  = repOrders.filter(o => ['refunded', 'partially-refunded'].includes(o.status))
          const revenue   = completed.reduce((s, o) => s + parseFloat(o.total), 0)
          const actual = completed.reduce((s, o) => s + parseFloat(o.total) * rep.splitRep / 100, 0)
          return (
            <div key={rep.id} style={S.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{rep.name}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: C.blue, marginTop: 3 }}>{rep.coupon}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{rep.email}</div>
                </div>
                <button onClick={e => { e.stopPropagation(); setEditRep({ ...rep }) }} style={{ ...S.btn, background: C.blueLight, color: C.blue, padding: '4px 10px', fontSize: 12 }}>Edit</button>
              </div>

              <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 10 }}>
                <div style={{ width: `${rep.splitRep}%`, background: C.blue }} />
                <div style={{ width: `${rep.splitDoctor}%`, background: C.purple }} />
                <div style={{ width: `${rep.splitClinic}%`, background: '#d1d5db' }} />
              </div>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 14 }}>
                Rep {rep.splitRep}% · Doctor {rep.splitDoctor}% · Clinic {rep.splitClinic}%
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                {[['Orders', completed.length], ['Revenue', fmt(revenue)], ['Earned', fmt(actual)]].map(([l, v]) => (
                  <div key={l} style={{ background: C.bg, borderRadius: 7, padding: '8px 10px', textAlign: 'center' }}>
                    <div style={{ fontWeight: 700, color: C.text, fontSize: 15 }}>{v}</div>
                    <div style={{ fontSize: 10, color: C.muted, marginTop: 1 }}>{l}</div>
                  </div>
                ))}
              </div>
              {refunded.length > 0 && (
                <div style={{ marginTop: 10, padding: '6px 10px', background: C.redLight, borderRadius: 6, fontSize: 12, color: C.red, fontWeight: 600 }}>
                  ⚠ {refunded.length} refund{refunded.length > 1 ? 's' : ''} pending review
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Edit Rep Modal */}
      {editRep && (
        <Modal title={`Edit — ${editRep.name}`} onClose={() => setEditRep(null)}>
          {[['Name', 'name', 'text'], ['Coupon Code', 'coupon', 'text'], ['Email', 'email', 'email']].map(([l, k, t]) => (
            <div key={k} style={{ marginBottom: 14 }}>
              <label style={S.label}>{l}</label>
              <input type={t} value={editRep[k]} onChange={e => setEditRep(p => ({ ...p, [k]: e.target.value }))} style={S.input} />
            </div>
          ))}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
            {[['Rep %', 'splitRep'], ['Doctor %', 'splitDoctor'], ['Clinic %', 'splitClinic']].map(([l, k]) => (
              <div key={k}>
                <label style={S.label}>{l}</label>
                <input type="number" min={0} max={100} value={editRep[k]} onChange={e => setEditRep(p => ({ ...p, [k]: +e.target.value }))} style={S.input} />
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: editRep.splitRep + editRep.splitDoctor + editRep.splitClinic === 100 ? C.green : C.red, marginBottom: 16, fontWeight: 600 }}>
            Total: {editRep.splitRep + editRep.splitDoctor + editRep.splitClinic}% {editRep.splitRep + editRep.splitDoctor + editRep.splitClinic === 100 ? '✓' : '— must equal 100'}
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={() => setEditRep(null)} style={{ ...S.btn, background: 'transparent', color: C.muted, border: `1px solid ${C.border}` }}>Cancel</button>
            <button onClick={saveEdit} disabled={editRep.splitRep + editRep.splitDoctor + editRep.splitClinic !== 100} style={{ ...S.btn, background: C.blue, color: '#fff', opacity: editRep.splitRep + editRep.splitDoctor + editRep.splitClinic !== 100 ? .4 : 1 }}>Save Changes</button>
          </div>
        </Modal>
      )}

      {/* Add Rep Modal */}
      {addModal && (
        <Modal title="Add New Rep" onClose={() => setAddModal(false)}>
          {[['Full Name', 'name', 'text'], ['Coupon Code', 'coupon', 'text'], ['Email', 'email', 'email']].map(([l, k, t]) => (
            <div key={k} style={{ marginBottom: 14 }}>
              <label style={S.label}>{l}</label>
              <input type={t} value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} style={S.input} />
            </div>
          ))}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
            {[['Rep %', 'splitRep'], ['Doctor %', 'splitDoctor'], ['Clinic %', 'splitClinic']].map(([l, k]) => (
              <div key={k}>
                <label style={S.label}>{l}</label>
                <input type="number" min={0} max={100} value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: +e.target.value }))} style={S.input} />
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: +form.splitRep + +form.splitDoctor + +form.splitClinic === 100 ? C.green : C.red, fontWeight: 600, marginBottom: 16 }}>
            Total: {+form.splitRep + +form.splitDoctor + +form.splitClinic}%
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={() => setAddModal(false)} style={{ ...S.btn, background: 'transparent', color: C.muted, border: `1px solid ${C.border}` }}>Cancel</button>
            <button onClick={addRep} style={{ ...S.btn, background: C.blue, color: '#fff' }}>Add Rep</button>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ─── Orders ───────────────────────────────────────────────────────────────────
function Orders({ orders, repConfig }) {
  const [search, setSearch] = useState('')
  const [filterRep, setFilterRep] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)

  const enriched = orders.map(o => ({ ...o, _comm: calcCommission(o, repConfig) })).filter(o => o._comm)

  const filtered = useMemo(() => enriched.filter(o => {
    if (filterRep !== 'all' && o._comm.rep.id !== +filterRep) return false
    if (filterStatus !== 'all' && o.status !== filterStatus) return false
    if (search && !`${o.number} ${o.billing.first_name} ${o.billing.last_name} ${o.billing.email} ${o._comm.couponCode}`.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }), [enriched, filterRep, filterStatus, search])

  function exportCSV() {
    const rows = [['Order', 'Date', 'Customer', 'Email', 'Coupon', 'Rep', 'Total', 'Rep Comm', 'Doctor Comm', 'Clinic', 'Status']]
    filtered.forEach(o => rows.push([o.number, fmtDate(o.date_created), `${o.billing.first_name} ${o.billing.last_name}`, o.billing.email, o._comm.couponCode, o._comm.rep.name, o._comm.orderTotal, o._comm.repAmt, o._comm.doctorAmt, o._comm.clinicAmt, o.status]))
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'biovantix-commissions.csv'; a.click()
  }

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Orders</h1>
        <button onClick={exportCSV} style={{ ...S.btn, background: C.greenLight, color: C.green }}>⬇ Export CSV</button>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search order, customer, coupon…" style={{ ...S.input, maxWidth: 280 }} />
        <select value={filterRep} onChange={e => setFilterRep(e.target.value)} style={{ ...S.input, width: 'auto' }}>
          <option value="all">All Reps</option>
          {repConfig.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ ...S.input, width: 'auto' }}>
          <option value="all">All Statuses</option>
          {['completed', 'processing', 'refunded', 'on-hold', 'pending'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div style={S.card}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
            <thead><tr>
              {['Order', 'Date', 'Customer', 'Coupon', 'Rep', 'Total', 'Rep Comm', 'Doctor Comm', 'Status', ''].map(h => <th key={h} style={S.th}>{h}</th>)}
            </tr></thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedOrder(o)} onMouseEnter={e => (e.currentTarget.style.background = C.bg)} onMouseLeave={e => (e.currentTarget.style.background = '')}>
                  <td style={{ ...S.td, fontFamily: 'var(--mono)', fontSize: 12 }}>#{o.number}</td>
                  <td style={{ ...S.td, color: C.muted }}>{fmtDate(o.date_created)}</td>
                  <td style={S.td}>{o.billing.first_name} {o.billing.last_name}</td>
                  <td style={{ ...S.td, fontFamily: 'var(--mono)', fontSize: 12, color: C.blue, fontWeight: 600 }}>{o._comm.couponCode}</td>
                  <td style={{ ...S.td, fontWeight: 600 }}>{o._comm.rep.name.split(' ')[0]}</td>
                  <td style={{ ...S.td, fontWeight: 700 }}>{fmt(o._comm.orderTotal)}</td>
                  <td style={{ ...S.td, color: o._comm.isRefund ? C.muted : C.green, fontWeight: 700 }}>{o._comm.isRefund ? '—' : fmt(o._comm.repAmt)}</td>
                  <td style={{ ...S.td, color: o._comm.isRefund ? C.muted : C.purple, fontWeight: 700 }}>{o._comm.isRefund ? '—' : fmt(o._comm.doctorAmt)}</td>
                  <td style={S.td}>{statusBadge(o.status)}</td>
                  <td style={S.td}><span style={{ color: C.blue, fontWeight: 600, fontSize: 12 }}>Details →</span></td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={10} style={{ ...S.td, textAlign: 'center', color: C.muted, fontStyle: 'italic', padding: 32 }}>No orders match</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <Modal title={`Order #${selectedOrder.number}`} onClose={() => setSelectedOrder(null)} wide>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            {[
              ['Date', fmtDate(selectedOrder.date_created)],
              ['Status', statusBadge(selectedOrder.status)],
              ['Customer', `${selectedOrder.billing.first_name} ${selectedOrder.billing.last_name}`],
              ['Email', selectedOrder.billing.email],
              ['Coupon', selectedOrder._comm.couponCode],
              ['Assigned Rep', selectedOrder._comm.rep.name],
            ].map(([l, v]) => (
              <div key={l} style={{ background: C.bg, borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 2 }}>{l}</div>
                <div style={{ fontWeight: 600 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', padding: 16, background: C.blueLight, borderRadius: 10, marginBottom: 20 }}>
            <div style={{ fontSize: 30, fontWeight: 800, color: C.blue }}>{fmt(selectedOrder._comm.orderTotal)}</div>
            <div style={{ fontSize: 12, color: C.muted }}>Order Total</div>
          </div>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: .5, fontWeight: 600 }}>Commission Breakdown</div>
          <div style={{ display: 'flex', height: 28, borderRadius: 7, overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ width: `${selectedOrder._comm.rep.splitRep}%`, background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 700 }}>{selectedOrder._comm.rep.splitRep}%</div>
            <div style={{ width: `${selectedOrder._comm.rep.splitDoctor}%`, background: C.purple, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 700 }}>{selectedOrder._comm.rep.splitDoctor}%</div>
            <div style={{ width: `${selectedOrder._comm.rep.splitClinic}%`, background: '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 700 }}>Clinic {selectedOrder._comm.rep.splitClinic}%</div>
          </div>
          {[['Sales Rep', selectedOrder._comm.rep.name, selectedOrder._comm.repAmt, C.blue], ['Doctor', 'Clinical team', selectedOrder._comm.doctorAmt, C.purple], ['Clinic', 'BioVantix', selectedOrder._comm.clinicAmt, C.muted]].map(([role, name, amt, col]) => (
            <div key={role} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
              <div><div style={{ fontWeight: 600 }}>{role}</div><div style={{ fontSize: 12, color: C.muted }}>{name}</div></div>
              <div style={{ fontWeight: 800, color: selectedOrder._comm.isRefund ? C.muted : col, textDecoration: selectedOrder._comm.isRefund ? 'line-through' : 'none' }}>{fmt(amt)}</div>
            </div>
          ))}
          {selectedOrder._comm.isRefund && (
            <div style={{ marginTop: 14, padding: '10px 14px', background: C.redLight, borderRadius: 8, color: C.red, fontWeight: 600 }}>
              ⚠ This order is refunded — commissions are at risk of clawback. Review in Refund Recap.
            </div>
          )}
        </Modal>
      )}
    </div>
  )
}

// ─── Refund Recap ─────────────────────────────────────────────────────────────
function RefundRecap({ orders, repConfig }) {
  const [clawbackStatus, setClawbackStatus] = useState({})

  const refunded = orders
    .map(o => ({ ...o, _comm: calcCommission(o, repConfig) }))
    .filter(o => o._comm && o._comm.isRefund)

  const totalAtRisk = refunded.reduce((s, o) => s + o._comm.repAmt, 0)
  const deducted = refunded.filter(o => clawbackStatus[o.id] === 'deducted').reduce((s, o) => s + o._comm.repAmt, 0)
  const waived = refunded.filter(o => clawbackStatus[o.id] === 'waived').reduce((s, o) => s + o._comm.repAmt, 0)
  const pending = refunded.filter(o => !clawbackStatus[o.id])

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: 28 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>Refund Recap</h1>
      <p style={{ color: C.muted, marginBottom: 24 }}>Pre-refund commissions are shown in gross. Mark each as Deducted or Waived before running payroll.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
        {[['Total at Risk', fmt(totalAtRisk), C.red, C.redLight], ['Deducted', fmt(deducted), C.green, C.greenLight], ['Waived', fmt(waived), C.amber, C.amberLight], ['Pending Review', pending.length, C.red, C.redLight]].map(([l, v, col, bg]) => (
          <div key={l} style={{ ...S.card, background: bg, border: 'none' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: col }}>{v}</div>
            <div style={{ fontSize: 12, color: col, opacity: .75, marginTop: 4, fontWeight: 500 }}>{l}</div>
          </div>
        ))}
      </div>

      {refunded.length === 0 ? (
        <div style={{ ...S.card, textAlign: 'center', padding: 48, color: C.muted }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
          <div style={{ fontWeight: 600 }}>No refunded orders — all clear for payroll.</div>
        </div>
      ) : (
        <div style={S.card}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
              <thead><tr>
                {['Order', 'Date', 'Rep', 'Order Total', 'Rep Comm at Risk', 'Dr Comm at Risk', 'Clawback Status', 'Actions'].map(h => <th key={h} style={S.th}>{h}</th>)}
              </tr></thead>
              <tbody>
                {refunded.map(o => {
                  const status = clawbackStatus[o.id]
                  return (
                    <tr key={o.id}>
                      <td style={{ ...S.td, fontFamily: 'var(--mono)', fontSize: 12 }}>#{o.number}</td>
                      <td style={{ ...S.td, color: C.muted }}>{fmtDate(o.date_created)}</td>
                      <td style={{ ...S.td, fontWeight: 600 }}>{o._comm.rep.name.split(' ')[0]}</td>
                      <td style={{ ...S.td, textDecoration: 'line-through', color: C.muted }}>{fmt(o._comm.orderTotal)}</td>
                      <td style={{ ...S.td, color: C.red, fontWeight: 700 }}>{fmt(o._comm.repAmt)}</td>
                      <td style={{ ...S.td, color: C.purple, fontWeight: 700 }}>{fmt(o._comm.doctorAmt)}</td>
                      <td style={S.td}>
                        {status === 'deducted' && <Badge label="Deducted" color={C.green} bg={C.greenLight} />}
                        {status === 'waived'   && <Badge label="Waived"   color={C.amber}  bg={C.amberLight} />}
                        {!status               && <Badge label="Pending"  color={C.red}    bg={C.redLight} />}
                      </td>
                      <td style={S.td}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => setClawbackStatus(p => ({ ...p, [o.id]: 'deducted' }))} style={{ ...S.btn, background: status === 'deducted' ? C.green : C.greenLight, color: status === 'deducted' ? '#fff' : C.green, padding: '4px 10px', fontSize: 11 }}>Deduct</button>
                          <button onClick={() => setClawbackStatus(p => ({ ...p, [o.id]: 'waived' }))}   style={{ ...S.btn, background: status === 'waived'   ? C.amber : C.amberLight, color: status === 'waived'   ? '#fff' : C.amber,  padding: '4px 10px', fontSize: 11 }}>Waive</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {pending.length > 0 && (
            <div style={{ marginTop: 16, padding: '10px 16px', background: C.redLight, borderRadius: 8, color: C.red, fontWeight: 600, fontSize: 13 }}>
              ⚠ {pending.length} order{pending.length > 1 ? 's' : ''} still pending — resolve before running payroll export.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Coupons ──────────────────────────────────────────────────────────────────
function Coupons({ repConfig }) {
  return (
    <div style={{ flex: 1, overflow: 'auto', padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Coupons</h1>
          <p style={{ color: C.muted }}>Create and manage coupon codes in WooCommerce. Connect your API keys in Settings to enable write access.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        {repConfig.map(rep => (
          <div key={rep.id} style={{ ...S.card, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 18, fontWeight: 700, color: C.blue, background: C.blueLight, padding: '6px 16px', borderRadius: 8, letterSpacing: 1 }}>{rep.coupon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{rep.name}</div>
              <div style={{ fontSize: 12, color: C.muted }}>Rep {rep.splitRep}% · Doctor {rep.splitDoctor}% · Clinic {rep.splitClinic}%</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button disabled style={{ ...S.btn, background: C.bg, color: C.muted, fontSize: 12, cursor: 'not-allowed', opacity: .6 }}>Edit in WooCommerce ↗</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ ...S.card, marginTop: 20, padding: 24, border: `2px dashed ${C.border}`, background: 'transparent', textAlign: 'center' }}>
        <div style={{ fontSize: 24, marginBottom: 8 }}>🔗</div>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>Connect WooCommerce to manage coupons</div>
        <div style={{ color: C.muted, fontSize: 13, marginBottom: 12 }}>Add your Consumer Key + Secret in Settings to create, edit, and deactivate coupons directly from here.</div>
        <Badge label="Coming in Phase 2" color={C.blue} bg={C.blueLight} />
      </div>
    </div>
  )
}

// ─── Settings ─────────────────────────────────────────────────────────────────
function Settings({ wcConfig, setWcConfig, onConnect, isConnected, isLoading }) {
  const [local, setLocal] = useState({ ...wcConfig })
  const [saved, setSaved] = useState(false)

  function save() {
    setWcConfig(local)
    onConnect(local)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: 28 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Settings</h1>

      <div style={{ maxWidth: 560 }}>
        <div style={{ ...S.card, marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>WooCommerce API</h3>
          <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>
            Generate keys at: WordPress Admin → WooCommerce → Settings → Advanced → REST API → Add key (Read permission).
          </p>

          <div style={{ marginBottom: 14 }}>
            <label style={S.label}>Store URL</label>
            <input value={local.url} onChange={e => setLocal(p => ({ ...p, url: e.target.value }))} style={S.input} placeholder="https://biovantixlab.com" />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={S.label}>Consumer Key</label>
            <input value={local.ck} onChange={e => setLocal(p => ({ ...p, ck: e.target.value }))} style={{ ...S.input, fontFamily: 'var(--mono)', fontSize: 12 }} placeholder="ck_…" />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={S.label}>Consumer Secret</label>
            <input type="password" value={local.cs} onChange={e => setLocal(p => ({ ...p, cs: e.target.value }))} style={{ ...S.input, fontFamily: 'var(--mono)', fontSize: 12 }} placeholder="cs_…" />
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button onClick={save} style={{ ...S.btn, background: C.blue, color: '#fff' }}>
              {isLoading ? 'Connecting…' : 'Save & Connect'}
            </button>
            {isConnected && <Badge label="✓ Connected" color={C.green} bg={C.greenLight} />}
            {saved && !isConnected && <span style={{ fontSize: 13, color: C.muted }}>Saved — check credentials if no data loads</span>}
          </div>
        </div>

        <div style={{ ...S.card, background: C.blueLight, border: 'none' }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: C.blue, marginBottom: 8 }}>Phase 2 — coming soon</h4>
          <ul style={{ paddingLeft: 16, color: C.blue, fontSize: 13, lineHeight: 2 }}>
            <li>Create / edit coupons directly in WooCommerce</li>
            <li>Tiered commission rates and bonus thresholds</li>
            <li>Rep self-service login (view own commissions only)</li>
            <li>Automatic refund clawback</li>
            <li>Payroll CSV with deductions built in</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState('dashboard')
  const [repConfig, setRepConfig] = useState(REP_CONFIG_DEFAULT)
  const [wcConfig, setWcConfig] = useState({ ...WC_CONFIG })
  const [orders, setOrders] = useState(buildMockOrders())
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const isMock = orders[0]?._isMock ?? false

  async function connectWC(cfg) {
    const isReal = cfg.ck !== WC_CONFIG.ck && cfg.ck.startsWith('ck_')
    if (!isReal) return
    setIsLoading(true)
    try {
      const data = await wcFetch('orders', { status: 'any', orderby: 'date', order: 'desc' })
      if (Array.isArray(data) && data.length > 0) {
        setOrders(data.map(o => ({ ...o, _isMock: false })))
        setIsConnected(true)
      }
    } catch (e) {
      console.error('WooCommerce connection failed:', e.message)
    } finally {
      setIsLoading(false)
    }
  }

  const props = { orders, repConfig, setRepConfig, setPage }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: C.bg }}>
      <Sidebar page={page} setPage={setPage} isMock={isMock} />
      {page === 'dashboard' && <Dashboard {...props} />}
      {page === 'reps'      && <Reps      {...props} />}
      {page === 'orders'    && <Orders    orders={orders} repConfig={repConfig} />}
      {page === 'refunds'   && <RefundRecap orders={orders} repConfig={repConfig} />}
      {page === 'coupons'   && <Coupons   repConfig={repConfig} />}
      {page === 'settings'  && <Settings  wcConfig={wcConfig} setWcConfig={setWcConfig} onConnect={connectWC} isConnected={isConnected} isLoading={isLoading} />}
    </div>
  )
}
