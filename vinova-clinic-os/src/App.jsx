import { useState } from 'react'

// ─── Theme / Brand ────────────────────────────────────────────────────────────
const T = {
  teal: '#1B6B72', tealMid: '#2a8a93', tealLight: '#e8f4f5',
  coral: '#E8725A', coralLight: '#fdf1ee',
  text: '#1a1a2e', muted: '#6b7280', bg: '#f8fafb', surface: '#ffffff',
  border: '#e5e7eb',
}
const S = {
  card: { background: T.surface, borderRadius: 10, boxShadow: '0 1px 4px rgba(0,0,0,.08)', padding: 20, border: `1px solid ${T.border}` },
  btn: { padding: '8px 18px', borderRadius: 8, border: 'none', fontFamily: 'inherit', fontSize: 14, cursor: 'pointer', fontWeight: 500 },
  btnPrimary: { background: T.teal, color: '#fff' },
  btnSecondary: { background: T.tealLight, color: T.teal },
  btnCoral: { background: T.coral, color: '#fff' },
  btnGhost: { background: 'transparent', color: T.muted, border: `1px solid ${T.border}` },
  input: { width: '100%', padding: '8px 12px', border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'inherit' },
  badge: { padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500 },
  label: { fontSize: 12, color: T.muted, marginBottom: 4, display: 'block' },
}

// ─── Seed Data ────────────────────────────────────────────────────────────────
const ROLES = ['Admin', 'Sales Rep', 'Doctor']

const USERS = [
  { id: 1, name: 'Dr. María Rodríguez', role: 'Doctor', email: 'maria@vinova.cr', avatar: 'MR' },
  { id: 2, name: 'Carlos Méndez', role: 'Sales Rep', email: 'carlos@vinova.cr', avatar: 'CM' },
  { id: 3, name: 'Admin User', role: 'Admin', email: 'admin@vinova.cr', avatar: 'AU' },
]

const STAGES = ['New Lead', 'Contacted', 'Consultation', 'Proposal', 'Closed Won', 'Closed Lost']

const LEADS_SEED = [
  { id: 1, name: 'Elena Vargas', age: 45, email: 'elena@email.com', phone: '+506 8888-1234', stage: 'Consultation', assignedTo: 2, doctor: 1, score: 82, bioAge: 38, notes: 'Interested in full longevity program', purchaseTotal: 4200, tags: ['VIP', 'Torus Done'] },
  { id: 2, name: 'Roberto Jiménez', age: 52, email: 'roberto@email.com', phone: '+506 8777-5678', stage: 'Proposal', assignedTo: 2, doctor: 1, score: 74, bioAge: 44, notes: 'Follow up re: IV therapy package', purchaseTotal: 1800, tags: ['Torus Done'] },
  { id: 3, name: 'Sofia Chen', age: 38, email: 'sofia@email.com', phone: '+506 8666-9012', stage: 'New Lead', assignedTo: 2, doctor: null, score: null, bioAge: null, notes: 'Referral from Elena', purchaseTotal: 0, tags: [] },
  { id: 4, name: 'Marcos Alvarado', age: 61, email: 'marcos@email.com', phone: '+506 8555-3456', stage: 'Contacted', assignedTo: 2, doctor: 1, score: 68, bioAge: 55, notes: 'Interested in NAD+ protocol', purchaseTotal: 600, tags: ['High Priority'] },
  { id: 5, name: 'Ana Gutiérrez', age: 33, email: 'ana@email.com', phone: '+506 8444-7890', stage: 'Closed Won', assignedTo: 2, doctor: 1, score: 91, bioAge: 27, notes: 'Full program enrolled', purchaseTotal: 8500, tags: ['VIP', 'Active Client'] },
  { id: 6, name: 'Luis Fernández', age: 48, email: 'luis@email.com', phone: '+506 8333-2345', stage: 'Closed Lost', assignedTo: 2, doctor: null, score: null, bioAge: null, notes: 'Budget constraints', purchaseTotal: 0, tags: [] },
]

const PRODUCTS_SEED = [
  { id: 1, name: 'Longevity Elite Program', category: 'Programs', price: 4800, cost: 1200, status: 'Active', sku: 'LEP-001', description: '12-month comprehensive longevity program with monthly assessments, IV therapy, and personalized protocols.', commissionSalesRep: 15, commissionDoctor: 10, commissionClinic: 75, supplier: 'Internal', purchaseOrders: [{ id: 1, date: '2025-01-10', qty: 5, status: 'Delivered', total: 6000 }] },
  { id: 2, name: 'NAD+ IV Therapy (10 sessions)', category: 'IV Therapy', price: 1200, cost: 320, status: 'Active', sku: 'NAD-010', description: 'Premium NAD+ infusion therapy — 10 session package.', commissionSalesRep: 12, commissionDoctor: 8, commissionClinic: 80, supplier: 'BioInfusion CR', purchaseOrders: [{ id: 1, date: '2025-02-01', qty: 20, status: 'Delivered', total: 6400 }, { id: 2, date: '2025-04-15', qty: 15, status: 'In Transit', total: 4800 }] },
  { id: 3, name: 'Torus Health Assessment', category: 'Diagnostics', price: 650, cost: 180, status: 'Active', sku: 'THA-001', description: 'Full Torus biomarker assessment with biological age score and personalized report.', commissionSalesRep: 10, commissionDoctor: 20, commissionClinic: 70, supplier: 'Torus Health Inc.', purchaseOrders: [] },
  { id: 4, name: 'Peptide Protocol — 3 months', category: 'Protocols', price: 980, cost: 290, status: 'Out of Stock', sku: 'PEP-003', description: 'Custom peptide protocol — 3-month supply tailored to individual biomarkers.', commissionSalesRep: 14, commissionDoctor: 12, commissionClinic: 74, supplier: 'PeptidePure Lab', purchaseOrders: [] },
]

const TEAM_SEED = [
  { id: 1, name: 'Dr. María Rodríguez', role: 'Doctor', status: 'Active', clients: 18, revenue: 32400, joinDate: '2023-06-01', email: 'maria@vinova.cr', phone: '+506 8900-0001' },
  { id: 2, name: 'Carlos Méndez', role: 'Sales Rep', status: 'Active', clients: 24, revenue: 47200, joinDate: '2023-09-15', email: 'carlos@vinova.cr', phone: '+506 8900-0002' },
  { id: 3, name: 'Valeria Torres', role: 'Sales Rep', status: 'Active', clients: 19, revenue: 38900, joinDate: '2024-01-10', email: 'valeria@vinova.cr', phone: '+506 8900-0003' },
  { id: 4, name: 'Dr. Esteban Mora', role: 'Doctor', status: 'Inactive', clients: 5, revenue: 8200, joinDate: '2024-03-01', email: 'esteban@vinova.cr', phone: '+506 8900-0004' },
]

const TIMELINE_SEED = [
  { id: 1, leadId: 1, type: 'call', text: 'Initial consultation call — 45 mins. Discussed longevity goals.', date: '2025-04-28', author: 'Carlos Méndez' },
  { id: 2, leadId: 1, type: 'note', text: 'Sent Torus assessment brochure via WhatsApp.', date: '2025-04-30', author: 'Carlos Méndez' },
  { id: 3, leadId: 1, type: 'assessment', text: 'Torus assessment completed. BioAge: 38. Score: 82.', date: '2025-05-05', author: 'Dr. María Rodríguez' },
  { id: 4, leadId: 1, type: 'purchase', text: 'Enrolled in Longevity Elite Program — $4,200.', date: '2025-05-10', author: 'Carlos Méndez' },
]

// ─── Utility helpers ──────────────────────────────────────────────────────────
function Avatar({ initials, size = 36, color = T.teal }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: size * 0.35, flexShrink: 0 }}>
      {initials}
    </div>
  )
}

function Badge({ label, color = T.teal, bg }) {
  return <span style={{ ...S.badge, background: bg || color + '18', color }}>{label}</span>
}

function Tab({ tabs, active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4, borderBottom: `1px solid ${T.border}`, marginBottom: 20 }}>
      {tabs.map(t => (
        <button key={t} onClick={() => onChange(t)} style={{ ...S.btn, borderRadius: '8px 8px 0 0', padding: '8px 16px', background: active === t ? T.teal : 'transparent', color: active === t ? '#fff' : T.muted, fontWeight: active === t ? 600 : 400 }}>{t}</button>
      ))}
    </div>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
      <div style={{ background: T.surface, borderRadius: 12, padding: 28, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 600, color: T.text }}>{title}</h3>
          <button onClick={onClose} style={{ ...S.btn, ...S.btnGhost, padding: '4px 10px' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

function stageColor(stage) {
  const m = { 'New Lead': [T.muted, '#f3f4f6'], 'Contacted': ['#7c3aed', '#ede9fe'], 'Consultation': [T.teal, T.tealLight], 'Proposal': ['#d97706', '#fef3c7'], 'Closed Won': ['#059669', '#d1fae5'], 'Closed Lost': [T.coral, T.coralLight] }
  return m[stage] || [T.muted, '#f3f4f6']
}

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [sel, setSel] = useState(null)
  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(135deg, ${T.teal} 0%, ${T.tealMid} 50%, #0d4a52 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: T.surface, borderRadius: 16, padding: 40, width: '100%', maxWidth: 420, textAlign: 'center', boxShadow: '0 24px 80px rgba(0,0,0,.25)' }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 600, color: T.teal, marginBottom: 4 }}>VINOVA</div>
        <div style={{ fontSize: 13, color: T.muted, marginBottom: 32, letterSpacing: 2, textTransform: 'uppercase' }}>Longevity Experts · Clinic OS</div>
        <div style={{ marginBottom: 24, textAlign: 'left' }}>
          <label style={S.label}>Select your role to continue</label>
          {USERS.map(u => (
            <div key={u.id} onClick={() => setSel(u)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 10, border: `2px solid ${sel?.id === u.id ? T.teal : T.border}`, marginBottom: 10, cursor: 'pointer', background: sel?.id === u.id ? T.tealLight : T.surface, transition: 'all .15s' }}>
              <Avatar initials={u.avatar} size={38} color={u.role === 'Doctor' ? T.coral : T.teal} />
              <div>
                <div style={{ fontWeight: 600, color: T.text }}>{u.name}</div>
                <div style={{ fontSize: 12, color: T.muted }}>{u.role} · {u.email}</div>
              </div>
            </div>
          ))}
        </div>
        <button disabled={!sel} onClick={() => sel && onLogin(sel)} style={{ ...S.btn, ...S.btnPrimary, width: '100%', padding: '12px', fontSize: 15, opacity: sel ? 1 : .45 }}>
          Enter Clinic OS →
        </button>
        <div style={{ marginTop: 16, fontSize: 12, color: T.muted }}>vinovacr.com · Secure access</div>
      </div>
    </div>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const NAV = [
  { key: 'pipeline', label: 'Pipeline', icon: '◈' },
  { key: 'products', label: 'Products', icon: '◉' },
  { key: 'reports', label: 'Reports', icon: '◇' },
  { key: 'team', label: 'Team', icon: '◎' },
  { key: 'api', label: 'API / HDT', icon: '⊕' },
]

function Sidebar({ current, onChange, user, onLogout }) {
  return (
    <div style={{ width: 220, background: T.surface, borderRight: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      <div style={{ padding: '24px 20px 16px', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 600, color: T.teal }}>VINOVA</div>
        <div style={{ fontSize: 10, color: T.muted, letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 2 }}>Clinic OS</div>
      </div>
      <nav style={{ flex: 1, padding: '12px 0' }}>
        {NAV.map(n => (
          <button key={n.key} onClick={() => onChange(n.key)} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 20px', border: 'none', background: current === n.key ? T.tealLight : 'transparent', color: current === n.key ? T.teal : T.muted, fontWeight: current === n.key ? 600 : 400, fontSize: 14, cursor: 'pointer', textAlign: 'left' }}>
            <span style={{ fontSize: 16 }}>{n.icon}</span>{n.label}
          </button>
        ))}
      </nav>
      <div style={{ padding: 16, borderTop: `1px solid ${T.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <Avatar initials={user.avatar} size={34} color={user.role === 'Doctor' ? T.coral : T.teal} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{user.name.split(' ')[0]}</div>
            <div style={{ fontSize: 11, color: T.muted }}>{user.role}</div>
          </div>
        </div>
        <button onClick={onLogout} style={{ ...S.btn, ...S.btnGhost, width: '100%', fontSize: 12 }}>Sign out</button>
      </div>
    </div>
  )
}

// ─── Lead Detail ──────────────────────────────────────────────────────────────
function LeadDetail({ lead, onBack, allLeads, setLeads }) {
  const [tab, setTab] = useState('Overview')
  const [noteText, setNoteText] = useState('')
  const [timeline, setTimeline] = useState(TIMELINE_SEED.filter(t => t.leadId === lead.id))

  const doctor = USERS.find(u => u.id === lead.doctor)
  const salesRep = USERS.find(u => u.id === lead.assignedTo)
  const [stageColor_, stageBg] = stageColor(lead.stage)

  function addNote() {
    if (!noteText.trim()) return
    setTimeline(prev => [...prev, { id: Date.now(), leadId: lead.id, type: 'note', text: noteText, date: new Date().toISOString().slice(0, 10), author: 'Admin User' }])
    setNoteText('')
  }

  const timelineIcons = { call: '📞', note: '📝', assessment: '🧬', purchase: '💳', email: '✉️' }

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: 28 }}>
      <button onClick={onBack} style={{ ...S.btn, ...S.btnGhost, marginBottom: 20 }}>← Back to Pipeline</button>

      {/* Header */}
      <div style={{ ...S.card, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <Avatar initials={lead.name.split(' ').map(w => w[0]).join('').slice(0, 2)} size={56} />
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 600, color: T.text, marginBottom: 6 }}>{lead.name}</h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <Badge label={lead.stage} color={stageColor_} bg={stageBg} />
              {lead.tags.map(tag => <Badge key={tag} label={tag} color={T.coral} bg={T.coralLight} />)}
              <span style={{ fontSize: 13, color: T.muted }}>{lead.age} yrs · {lead.email}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <a href={`tel:${lead.phone}`} title="Call" style={{ ...S.btn, ...S.btnSecondary, textDecoration: 'none', fontSize: 18 }}>📞</a>
            <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" title="WhatsApp" style={{ ...S.btn, background: '#25d366', color: '#fff', textDecoration: 'none', fontSize: 18 }}>💬</a>
            <a href={`https://m.me/`} target="_blank" rel="noreferrer" title="Messenger" style={{ ...S.btn, background: '#0084ff', color: '#fff', textDecoration: 'none', fontSize: 18 }}>📨</a>
            <a href={`mailto:${lead.email}`} title="Email" style={{ ...S.btn, ...S.btnCoral, textDecoration: 'none', fontSize: 18 }}>✉️</a>
          </div>
        </div>
      </div>

      <Tab tabs={['Overview', 'Torus Report', 'Documents', 'Timeline', 'Sales']} active={tab} onChange={setTab} />

      {tab === 'Overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={S.card}>
            <h4 style={{ marginBottom: 12, color: T.teal, fontFamily: "'Cormorant Garamond',serif", fontSize: 18 }}>Notes</h4>
            <p style={{ color: T.text, lineHeight: 1.6 }}>{lead.notes}</p>
            <div style={{ marginTop: 16 }}>
              <textarea value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Add a note…" style={{ ...S.input, height: 80, resize: 'vertical' }} />
              <button onClick={addNote} style={{ ...S.btn, ...S.btnPrimary, marginTop: 8 }}>Save Note</button>
            </div>
          </div>
          <div style={S.card}>
            <h4 style={{ marginBottom: 12, color: T.teal, fontFamily: "'Cormorant Garamond',serif", fontSize: 18 }}>Purchase Summary</h4>
            <div style={{ fontSize: 32, fontWeight: 700, color: T.teal, marginBottom: 4 }}>${lead.purchaseTotal.toLocaleString()}</div>
            <div style={{ color: T.muted, marginBottom: 16 }}>Total lifetime value</div>
            <hr style={{ border: 'none', borderTop: `1px solid ${T.border}`, marginBottom: 12 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: T.muted }}>Assigned Rep</span>
              <span style={{ fontWeight: 500 }}>{salesRep?.name || '—'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: T.muted }}>Doctor</span>
              <span style={{ fontWeight: 500 }}>{doctor?.name || '—'}</span>
            </div>
          </div>
          <div style={S.card}>
            <h4 style={{ marginBottom: 12, color: T.teal, fontFamily: "'Cormorant Garamond',serif", fontSize: 18 }}>Torus Snapshot</h4>
            {lead.score ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 100, height: 100, borderRadius: '50%', background: `conic-gradient(${T.teal} ${lead.score * 3.6}deg, ${T.tealLight} 0deg)`, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <div style={{ width: 72, height: 72, borderRadius: '50%', background: T.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 24, color: T.teal }}>{lead.score}</div>
                </div>
                <div style={{ color: T.muted, fontSize: 13 }}>BioAge: <strong style={{ color: T.teal }}>{lead.bioAge} yrs</strong> (Chron: {lead.age})</div>
              </div>
            ) : <div style={{ color: T.muted, fontStyle: 'italic' }}>No assessment yet</div>}
          </div>
          <div style={S.card}>
            <h4 style={{ marginBottom: 12, color: T.teal, fontFamily: "'Cormorant Garamond',serif", fontSize: 18 }}>Stage Management</h4>
            {STAGES.map(s => {
              const [sc, sbg] = stageColor(s)
              return (
                <button key={s} onClick={() => setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, stage: s } : l))} style={{ ...S.btn, background: lead.stage === s ? sc : sbg, color: lead.stage === s ? '#fff' : sc, marginRight: 6, marginBottom: 6, fontSize: 12 }}>{s}</button>
              )
            })}
          </div>
        </div>
      )}

      {tab === 'Torus Report' && (
        <div style={S.card}>
          {lead.score ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 48, fontWeight: 700, color: T.teal }}>{lead.score}</div>
                  <div style={{ color: T.muted, fontSize: 13 }}>Torus Score</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 48, fontWeight: 700, color: T.coral }}>{lead.bioAge}</div>
                  <div style={{ color: T.muted, fontSize: 13 }}>Biological Age</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 48, fontWeight: 700, color: T.tealMid }}>{lead.age - lead.bioAge}</div>
                  <div style={{ color: T.muted, fontSize: 13 }}>Years Younger</div>
                </div>
              </div>
              <h4 style={{ marginBottom: 16, color: T.text }}>Biomarker Breakdown</h4>
              {[['Cardiovascular', 88], ['Metabolic', 74], ['Inflammation', 81], ['Hormonal', 69], ['Cognitive', 85], ['Structural', 78]].map(([label, val]) => (
                <div key={label} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ color: T.text }}>{label}</span>
                    <span style={{ fontWeight: 600, color: val > 79 ? T.teal : val > 59 ? '#d97706' : T.coral }}>{val}</span>
                  </div>
                  <div style={{ height: 8, background: T.tealLight, borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${val}%`, background: val > 79 ? T.teal : val > 59 ? '#d97706' : T.coral, borderRadius: 4 }} />
                  </div>
                </div>
              ))}
              <h4 style={{ marginTop: 24, marginBottom: 12, color: T.text }}>Recommended Protocols</h4>
              {['NAD+ IV Therapy (10 sessions)', 'Peptide Protocol — 3 months', 'Metabolic Reset Program'].map(p => (
                <div key={p} style={{ padding: '8px 12px', background: T.tealLight, borderRadius: 8, marginBottom: 8, color: T.teal, fontSize: 13, fontWeight: 500 }}>→ {p}</div>
              ))}
            </>
          ) : <div style={{ textAlign: 'center', padding: 40, color: T.muted }}>No Torus assessment on file for this client.</div>}
        </div>
      )}

      {tab === 'Documents' && (
        <div style={S.card}>
          <h4 style={{ marginBottom: 16, fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: T.teal }}>Client Documents</h4>
          {[['Lab Results — Apr 2025', 'PDF', '2025-04-28'], ['Intake Form', 'PDF', '2025-04-20'], ['Consent — Torus Assessment', 'PDF', '2025-05-01']].map(([name, type, date]) => (
            <div key={name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', border: `1px solid ${T.border}`, borderRadius: 8, marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20 }}>📄</span>
                <div><div style={{ fontWeight: 500 }}>{name}</div><div style={{ fontSize: 12, color: T.muted }}>{type} · {date}</div></div>
              </div>
              <button style={{ ...S.btn, ...S.btnSecondary, fontSize: 12 }}>Download</button>
            </div>
          ))}
          <div style={{ marginTop: 16, padding: 24, border: `2px dashed ${T.border}`, borderRadius: 10, textAlign: 'center', color: T.muted }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>⬆️</div>
            <div style={{ marginBottom: 8 }}>Drop files here or click to upload</div>
            <button style={{ ...S.btn, ...S.btnPrimary, fontSize: 12 }}>Upload Document</button>
          </div>
        </div>
      )}

      {tab === 'Timeline' && (
        <div style={S.card}>
          <h4 style={{ marginBottom: 20, fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: T.teal }}>Activity Timeline</h4>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <input value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Add a timeline entry…" style={{ ...S.input }} />
            <button onClick={addNote} style={{ ...S.btn, ...S.btnPrimary, whiteSpace: 'nowrap' }}>Add Entry</button>
          </div>
          <div style={{ position: 'relative', paddingLeft: 24 }}>
            <div style={{ position: 'absolute', left: 8, top: 0, bottom: 0, width: 2, background: T.tealLight }} />
            {[...timeline].reverse().map(entry => (
              <div key={entry.id} style={{ position: 'relative', marginBottom: 20 }}>
                <div style={{ position: 'absolute', left: -20, top: 4, width: 12, height: 12, borderRadius: '50%', background: T.teal, border: `2px solid ${T.surface}` }} />
                <div style={{ fontSize: 12, color: T.muted, marginBottom: 4 }}>{entry.date} · {entry.author}</div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span>{timelineIcons[entry.type] || '📌'}</span>
                  <span style={{ color: T.text }}>{entry.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'Sales' && (
        <div style={S.card}>
          <h4 style={{ marginBottom: 16, fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: T.teal }}>Purchase History</h4>
          <div style={{ marginBottom: 16, padding: 16, background: T.tealLight, borderRadius: 10, display: 'flex', gap: 24 }}>
            <div><div style={{ fontSize: 24, fontWeight: 700, color: T.teal }}>${lead.purchaseTotal.toLocaleString()}</div><div style={{ fontSize: 12, color: T.muted }}>Lifetime Value</div></div>
          </div>
          {[
            { product: 'Longevity Elite Program', date: '2025-05-10', amount: 4200, status: 'Paid' },
            { product: 'Torus Assessment', date: '2025-05-01', amount: 650, status: 'Paid' },
          ].filter(() => lead.purchaseTotal > 0).map((row, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${T.border}` }}>
              <div><div style={{ fontWeight: 500 }}>{row.product}</div><div style={{ fontSize: 12, color: T.muted }}>{row.date}</div></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Badge label={row.status} color='#059669' bg='#d1fae5' />
                <span style={{ fontWeight: 600, color: T.teal }}>${row.amount.toLocaleString()}</span>
              </div>
            </div>
          ))}
          {lead.purchaseTotal === 0 && <div style={{ color: T.muted, fontStyle: 'italic', textAlign: 'center', padding: 24 }}>No purchases yet.</div>}
        </div>
      )}
    </div>
  )
}

// ─── Pipeline (Kanban) ────────────────────────────────────────────────────────
function Pipeline({ leads, setLeads, onSelectLead }) {
  const [addModal, setAddModal] = useState(false)
  const [newLead, setNewLead] = useState({ name: '', email: '', phone: '', age: '', stage: 'New Lead', notes: '' })

  function createLead() {
    setLeads(prev => [...prev, { id: Date.now(), ...newLead, age: Number(newLead.age) || 0, assignedTo: 2, doctor: null, score: null, bioAge: null, purchaseTotal: 0, tags: [] }])
    setAddModal(false)
    setNewLead({ name: '', email: '', phone: '', age: '', stage: 'New Lead', notes: '' })
  }

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 600, color: T.text }}>Sales Pipeline</h1>
        <button onClick={() => setAddModal(true)} style={{ ...S.btn, ...S.btnPrimary }}>+ Add Lead</button>
      </div>

      <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 12 }}>
        {STAGES.map(stage => {
          const stageLeads = leads.filter(l => l.stage === stage)
          const [sc, sbg] = stageColor(stage)
          return (
            <div key={stage} style={{ minWidth: 220, maxWidth: 240, flexShrink: 0 }}>
              <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ ...S.badge, background: sbg, color: sc }}>{stage}</span>
                <span style={{ fontSize: 12, color: T.muted }}>{stageLeads.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {stageLeads.map(lead => {
                  const rep = USERS.find(u => u.id === lead.assignedTo)
                  return (
                    <div key={lead.id} onClick={() => onSelectLead(lead)} style={{ ...S.card, cursor: 'pointer', padding: 14, transition: 'box-shadow .15s' }}
                      onMouseEnter={e => e.currentTarget.style.boxShadow = `0 4px 16px rgba(27,107,114,.2)`}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = S.card.boxShadow}>
                      <div style={{ fontWeight: 600, color: T.text, marginBottom: 4 }}>{lead.name}</div>
                      <div style={{ fontSize: 12, color: T.muted, marginBottom: 8 }}>{lead.age} yrs · {lead.email}</div>
                      {lead.score && <div style={{ fontSize: 12, color: T.teal, marginBottom: 6 }}>🧬 BioAge {lead.bioAge} · Score {lead.score}</div>}
                      {lead.purchaseTotal > 0 && <div style={{ fontSize: 12, color: '#059669', marginBottom: 6 }}>💰 ${lead.purchaseTotal.toLocaleString()}</div>}
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {lead.tags.map(t => <Badge key={t} label={t} color={T.coral} bg={T.coralLight} />)}
                      </div>
                      {rep && <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: T.muted }}>
                        <Avatar initials={rep.avatar} size={18} color={T.teal} /> {rep.name.split(' ')[0]}
                      </div>}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {addModal && (
        <Modal title="Add New Lead" onClose={() => setAddModal(false)}>
          {[['Name', 'name', 'text'], ['Email', 'email', 'email'], ['Phone', 'phone', 'tel'], ['Age', 'age', 'number']].map(([label, key, type]) => (
            <div key={key} style={{ marginBottom: 14 }}>
              <label style={S.label}>{label}</label>
              <input type={type} value={newLead[key]} onChange={e => setNewLead(p => ({ ...p, [key]: e.target.value }))} style={S.input} />
            </div>
          ))}
          <div style={{ marginBottom: 14 }}>
            <label style={S.label}>Stage</label>
            <select value={newLead.stage} onChange={e => setNewLead(p => ({ ...p, stage: e.target.value }))} style={S.input}>
              {STAGES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={S.label}>Notes</label>
            <textarea value={newLead.notes} onChange={e => setNewLead(p => ({ ...p, notes: e.target.value }))} style={{ ...S.input, height: 80, resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={() => setAddModal(false)} style={{ ...S.btn, ...S.btnGhost }}>Cancel</button>
            <button onClick={createLead} style={{ ...S.btn, ...S.btnPrimary }}>Create Lead</button>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ─── Product Detail ───────────────────────────────────────────────────────────
function ProductDetail({ product, onBack, setProducts }) {
  const [tab, setTab] = useState('Overview')
  const [products2, setProducts2] = [null, null] // local alias
  const margin = ((product.price - product.cost) / product.price * 100).toFixed(1)
  const [newPO, setNewPO] = useState({ date: '', qty: '', status: 'Ordered' })
  const [showPOForm, setShowPOForm] = useState(false)
  const statusColors = { Active: [T.teal, T.tealLight], 'Out of Stock': [T.coral, T.coralLight], Discontinued: [T.muted, '#f3f4f6'] }
  const [sc, sbg] = statusColors[product.status] || [T.muted, '#f3f4f6']

  function addPO() {
    const po = { id: Date.now(), ...newPO, qty: Number(newPO.qty), total: Number(newPO.qty) * product.cost }
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, purchaseOrders: [...p.purchaseOrders, po] } : p))
    setShowPOForm(false)
    setNewPO({ date: '', qty: '', status: 'Ordered' })
  }

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: 28 }}>
      <button onClick={onBack} style={{ ...S.btn, ...S.btnGhost, marginBottom: 20 }}>← Back to Products</button>
      <div style={{ ...S.card, marginBottom: 20, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 600, marginBottom: 8 }}>{product.name}</h2>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Badge label={product.status} color={sc} bg={sbg} />
            <Badge label={product.category} color={T.muted} bg='#f3f4f6' />
            <span style={{ fontSize: 13, color: T.muted }}>SKU: {product.sku}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: T.teal }}>${product.price.toLocaleString()}</div>
          <div style={{ fontSize: 13, color: '#059669' }}>Margin: {margin}%</div>
        </div>
      </div>

      <Tab tabs={['Overview', 'Commission Config', 'Purchase Orders', 'Supplier']} active={tab} onChange={setTab} />

      {tab === 'Overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={{ ...S.card, gridColumn: '1/-1' }}>
            <h4 style={{ marginBottom: 10, color: T.teal, fontFamily: "'Cormorant Garamond',serif", fontSize: 18 }}>Description</h4>
            <p style={{ color: T.text, lineHeight: 1.7 }}>{product.description}</p>
          </div>
          {[['Price', `$${product.price.toLocaleString()}`], ['Cost', `$${product.cost.toLocaleString()}`], ['Gross Margin', `$${(product.price - product.cost).toLocaleString()} (${margin}%)`], ['Category', product.category]].map(([label, val]) => (
            <div key={label} style={S.card}>
              <div style={{ fontSize: 12, color: T.muted, marginBottom: 6 }}>{label}</div>
              <div style={{ fontSize: 20, fontWeight: 600, color: T.teal }}>{val}</div>
            </div>
          ))}
          <div style={{ ...S.card, display: 'flex', gap: 10 }}>
            {['Active', 'Out of Stock', 'Discontinued'].map(s => {
              const [ssc, ssbg] = statusColors[s] || [T.muted, '#f3f4f6']
              return <button key={s} onClick={() => setProducts(prev => prev.map(p => p.id === product.id ? { ...p, status: s } : p))} style={{ ...S.btn, background: product.status === s ? ssc : ssbg, color: product.status === s ? '#fff' : ssc, fontSize: 12 }}>{s}</button>
            })}
          </div>
        </div>
      )}

      {tab === 'Commission Config' && (
        <div style={S.card}>
          <h4 style={{ marginBottom: 20, fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: T.teal }}>Commission Split</h4>
          <div style={{ display: 'flex', height: 40, borderRadius: 10, overflow: 'hidden', marginBottom: 20 }}>
            <div style={{ width: `${product.commissionSalesRep}%`, background: T.teal, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 600 }}>Rep {product.commissionSalesRep}%</div>
            <div style={{ width: `${product.commissionDoctor}%`, background: T.coral, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 600 }}>Dr {product.commissionDoctor}%</div>
            <div style={{ width: `${product.commissionClinic}%`, background: T.tealMid, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 600 }}>Clinic {product.commissionClinic}%</div>
          </div>
          {[['Sales Representative', product.commissionSalesRep, T.teal], ['Doctor', product.commissionDoctor, T.coral], ['Clinic', product.commissionClinic, T.tealMid]].map(([label, pct, color]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${T.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: color }} />
                <span style={{ fontWeight: 500 }}>{label}</span>
              </div>
              <div>
                <span style={{ fontWeight: 700, color, fontSize: 18 }}>{pct}%</span>
                <span style={{ color: T.muted, fontSize: 13, marginLeft: 8 }}>(${(product.price * pct / 100).toFixed(0)} per sale)</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'Purchase Orders' && (
        <div style={S.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h4 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: T.teal }}>Purchase Orders</h4>
            <button onClick={() => setShowPOForm(true)} style={{ ...S.btn, ...S.btnPrimary, fontSize: 12 }}>+ New PO</button>
          </div>
          {product.purchaseOrders.length === 0 ? <div style={{ color: T.muted, fontStyle: 'italic', textAlign: 'center', padding: 24 }}>No purchase orders yet.</div> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ borderBottom: `2px solid ${T.border}` }}>
                {['PO #', 'Date', 'Qty', 'Total', 'Status'].map(h => <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 12, color: T.muted, fontWeight: 500 }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {product.purchaseOrders.map(po => {
                  const poSc = po.status === 'Delivered' ? '#059669' : po.status === 'In Transit' ? '#d97706' : T.teal
                  const poBg = po.status === 'Delivered' ? '#d1fae5' : po.status === 'In Transit' ? '#fef3c7' : T.tealLight
                  return (
                    <tr key={po.id} style={{ borderBottom: `1px solid ${T.border}` }}>
                      <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontSize: 12 }}>PO-{po.id.toString().slice(-4)}</td>
                      <td style={{ padding: '10px 12px', color: T.muted, fontSize: 13 }}>{po.date}</td>
                      <td style={{ padding: '10px 12px' }}>{po.qty}</td>
                      <td style={{ padding: '10px 12px', fontWeight: 600, color: T.teal }}>${po.total.toLocaleString()}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <select value={po.status} onChange={e => setProducts(prev => prev.map(p => p.id === product.id ? { ...p, purchaseOrders: p.purchaseOrders.map(o => o.id === po.id ? { ...o, status: e.target.value } : o) } : p))} style={{ ...S.btn, background: poBg, color: poSc, padding: '4px 8px', fontSize: 12 }}>
                          {['Ordered', 'In Transit', 'Delivered', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
          {showPOForm && (
            <div style={{ marginTop: 20, padding: 16, background: T.tealLight, borderRadius: 10 }}>
              <h5 style={{ marginBottom: 12, color: T.teal }}>New Purchase Order</h5>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                <div><label style={S.label}>Date</label><input type="date" value={newPO.date} onChange={e => setNewPO(p => ({ ...p, date: e.target.value }))} style={S.input} /></div>
                <div><label style={S.label}>Quantity</label><input type="number" value={newPO.qty} onChange={e => setNewPO(p => ({ ...p, qty: e.target.value }))} style={S.input} /></div>
                <div><label style={S.label}>Status</label><select value={newPO.status} onChange={e => setNewPO(p => ({ ...p, status: e.target.value }))} style={S.input}>{['Ordered', 'In Transit', 'Delivered'].map(s => <option key={s}>{s}</option>)}</select></div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 12, justifyContent: 'flex-end' }}>
                <button onClick={() => setShowPOForm(false)} style={{ ...S.btn, ...S.btnGhost }}>Cancel</button>
                <button onClick={addPO} style={{ ...S.btn, ...S.btnPrimary }}>Create PO</button>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'Supplier' && (
        <div style={S.card}>
          <h4 style={{ marginBottom: 16, fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: T.teal }}>Supplier Information</h4>
          {[['Supplier Name', product.supplier], ['SKU / Product Code', product.sku], ['Category', product.category], ['Lead Time', '14–21 business days'], ['Payment Terms', 'Net 30']].map(([label, val]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${T.border}` }}>
              <span style={{ color: T.muted }}>{label}</span><span style={{ fontWeight: 500 }}>{val}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Products List ─────────────────────────────────────────────────────────────
function Products({ products, setProducts, onSelectProduct }) {
  const statusColors = { Active: [T.teal, T.tealLight], 'Out of Stock': [T.coral, T.coralLight], Discontinued: [T.muted, '#f3f4f6'] }
  return (
    <div style={{ flex: 1, overflow: 'auto', padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 600 }}>Products &amp; Services</h1>
        <button style={{ ...S.btn, ...S.btnPrimary }}>+ Add Product</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {products.map(p => {
          const margin = ((p.price - p.cost) / p.price * 100).toFixed(0)
          const [sc, sbg] = statusColors[p.status] || [T.muted, '#f3f4f6']
          return (
            <div key={p.id} onClick={() => onSelectProduct(p)} style={{ ...S.card, cursor: 'pointer', transition: 'box-shadow .15s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = `0 4px 16px rgba(27,107,114,.2)`}
              onMouseLeave={e => e.currentTarget.style.boxShadow = S.card.boxShadow}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <Badge label={p.status} color={sc} bg={sbg} />
                <Badge label={p.category} color={T.muted} bg='#f3f4f6' />
              </div>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 600, marginBottom: 8, color: T.text }}>{p.name}</h3>
              <p style={{ fontSize: 13, color: T.muted, marginBottom: 16, lineHeight: 1.5 }}>{p.description.slice(0, 80)}…</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: T.teal }}>${p.price.toLocaleString()}</div>
                  <div style={{ fontSize: 12, color: '#059669' }}>Margin: {margin}%</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: 12, color: T.muted }}>
                  <div>Rep: {p.commissionSalesRep}% · Dr: {p.commissionDoctor}%</div>
                  <div>SKU: {p.sku}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Reports ──────────────────────────────────────────────────────────────────
function Reports({ leads }) {
  const totalRevenue = leads.reduce((s, l) => s + l.purchaseTotal, 0)
  const wonLeads = leads.filter(l => l.stage === 'Closed Won')
  const activeClients = leads.filter(l => !['Closed Lost', 'New Lead'].includes(l.stage))
  const avgDeal = wonLeads.length ? Math.round(wonLeads.reduce((s, l) => s + l.purchaseTotal, 0) / wonLeads.length) : 0
  const convRate = leads.length ? ((wonLeads.length / leads.length) * 100).toFixed(0) : 0

  const stageData = STAGES.map(s => ({ stage: s, count: leads.filter(l => l.stage === s).length, revenue: leads.filter(l => l.stage === s).reduce((sum, l) => sum + l.purchaseTotal, 0) }))
  const maxCount = Math.max(...stageData.map(d => d.count), 1)

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: 28 }}>
      <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 600, marginBottom: 24 }}>Reports &amp; Analytics</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[['Total Revenue', `$${totalRevenue.toLocaleString()}`, '💰', T.teal], ['Active Clients', activeClients.length, '👥', T.tealMid], ['Avg Deal Size', `$${avgDeal.toLocaleString()}`, '📊', T.coral], ['Conv. Rate', `${convRate}%`, '🎯', '#7c3aed']].map(([label, val, icon, color]) => (
          <div key={label} style={{ ...S.card, textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 700, color }}>{val}</div>
            <div style={{ fontSize: 13, color: T.muted, marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={S.card}>
          <h4 style={{ marginBottom: 16, fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: T.teal }}>Pipeline by Stage</h4>
          {stageData.map(({ stage, count, revenue }) => {
            const [sc] = stageColor(stage)
            return (
              <div key={stage} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{stage}</span>
                  <span style={{ fontSize: 13, color: T.muted }}>{count} lead{count !== 1 ? 's' : ''} · ${revenue.toLocaleString()}</span>
                </div>
                <div style={{ height: 8, background: T.tealLight, borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(count / maxCount) * 100}%`, background: sc, borderRadius: 4, transition: 'width .4s' }} />
                </div>
              </div>
            )
          })}
        </div>

        <div style={S.card}>
          <h4 style={{ marginBottom: 16, fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: T.teal }}>Top Clients by Value</h4>
          {[...leads].sort((a, b) => b.purchaseTotal - a.purchaseTotal).slice(0, 5).map((lead, i) => (
            <div key={lead.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: T.tealLight, color: T.teal, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12 }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 14 }}>{lead.name}</div>
                <div style={{ fontSize: 12, color: T.muted }}>{lead.stage}</div>
              </div>
              <div style={{ fontWeight: 700, color: T.teal }}>${lead.purchaseTotal.toLocaleString()}</div>
            </div>
          ))}
        </div>

        <div style={S.card}>
          <h4 style={{ marginBottom: 16, fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: T.teal }}>Monthly Revenue Trend</h4>
          {[['Jan', 8200], ['Feb', 12400], ['Mar', 9800], ['Apr', 15600], ['May', 11200]].map(([month, val]) => {
            const maxVal = 16000
            return (
              <div key={month} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <span style={{ width: 36, fontSize: 12, color: T.muted }}>{month}</span>
                <div style={{ flex: 1, height: 20, background: T.tealLight, borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(val / maxVal) * 100}%`, background: T.teal, borderRadius: 4 }} />
                </div>
                <span style={{ width: 60, fontSize: 12, fontWeight: 600, color: T.teal, textAlign: 'right' }}>${(val / 1000).toFixed(1)}k</span>
              </div>
            )
          })}
        </div>

        <div style={S.card}>
          <h4 style={{ marginBottom: 16, fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: T.teal }}>Torus Assessment Summary</h4>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 700, color: T.teal }}>{leads.filter(l => l.score).length}</div>
              <div style={{ fontSize: 12, color: T.muted }}>Assessments Done</div>
            </div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 700, color: T.coral }}>
                {leads.filter(l => l.bioAge).length ? Math.round(leads.filter(l => l.bioAge).reduce((s, l) => s + l.bioAge, 0) / leads.filter(l => l.bioAge).length) : '—'}
              </div>
              <div style={{ fontSize: 12, color: T.muted }}>Avg BioAge</div>
            </div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 700, color: T.tealMid }}>
                {leads.filter(l => l.score).length ? Math.round(leads.filter(l => l.score).reduce((s, l) => s + l.score, 0) / leads.filter(l => l.score).length) : '—'}
              </div>
              <div style={{ fontSize: 12, color: T.muted }}>Avg Score</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Team ─────────────────────────────────────────────────────────────────────
function Team() {
  const [team, setTeam] = useState(TEAM_SEED)
  const [showAdd, setShowAdd] = useState(false)
  const [newMember, setNewMember] = useState({ name: '', role: 'Sales Rep', email: '', phone: '', status: 'Active' })

  function addMember() {
    setTeam(prev => [...prev, { id: Date.now(), ...newMember, clients: 0, revenue: 0, joinDate: new Date().toISOString().slice(0, 10) }])
    setShowAdd(false)
    setNewMember({ name: '', role: 'Sales Rep', email: '', phone: '', status: 'Active' })
  }

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 600 }}>Team Management</h1>
        <button onClick={() => setShowAdd(true)} style={{ ...S.btn, ...S.btnPrimary }}>+ Add Member</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {team.map(m => {
          const initials = m.name.split(' ').map(w => w[0]).join('').slice(0, 2)
          const color = m.role === 'Doctor' ? T.coral : T.teal
          return (
            <div key={m.id} style={S.card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <Avatar initials={initials} size={48} color={color} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 16, color: T.text }}>{m.name}</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                    <Badge label={m.role} color={color} bg={color + '18'} />
                    <Badge label={m.status} color={m.status === 'Active' ? '#059669' : T.muted} bg={m.status === 'Active' ? '#d1fae5' : '#f3f4f6'} />
                  </div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                {[['Clients', m.clients], ['Revenue', `$${(m.revenue / 1000).toFixed(1)}k`]].map(([label, val]) => (
                  <div key={label} style={{ background: T.bg, borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: T.teal }}>{val}</div>
                    <div style={{ fontSize: 11, color: T.muted }}>{label}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 13, color: T.muted }}>
                <div>📧 {m.email}</div>
                <div style={{ marginTop: 4 }}>📞 {m.phone}</div>
                <div style={{ marginTop: 4 }}>📅 Joined {m.joinDate}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                <button onClick={() => setTeam(prev => prev.map(t => t.id === m.id ? { ...t, status: t.status === 'Active' ? 'Inactive' : 'Active' } : t))} style={{ ...S.btn, background: m.status === 'Active' ? T.coralLight : T.tealLight, color: m.status === 'Active' ? T.coral : T.teal, flex: 1, fontSize: 12 }}>
                  {m.status === 'Active' ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {showAdd && (
        <Modal title="Add Team Member" onClose={() => setShowAdd(false)}>
          {[['Full Name', 'name', 'text'], ['Email', 'email', 'email'], ['Phone', 'phone', 'tel']].map(([label, key, type]) => (
            <div key={key} style={{ marginBottom: 14 }}>
              <label style={S.label}>{label}</label>
              <input type={type} value={newMember[key]} onChange={e => setNewMember(p => ({ ...p, [key]: e.target.value }))} style={S.input} />
            </div>
          ))}
          <div style={{ marginBottom: 14 }}>
            <label style={S.label}>Role</label>
            <select value={newMember.role} onChange={e => setNewMember(p => ({ ...p, role: e.target.value }))} style={S.input}>
              {ROLES.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button onClick={() => setShowAdd(false)} style={{ ...S.btn, ...S.btnGhost }}>Cancel</button>
            <button onClick={addMember} style={{ ...S.btn, ...S.btnPrimary }}>Add Member</button>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ─── API / HDT Docs ───────────────────────────────────────────────────────────
function ApiDocs() {
  const [simResult, setSimResult] = useState(null)
  const samplePayload = `{
  "source": "HDT",
  "lead": {
    "name": "Elena Vargas",
    "email": "elena@email.com",
    "phone": "+506 8888-1234",
    "age": 45,
    "interest": "longevity_program",
    "torus_score": 82,
    "bio_age": 38
  }
}`
  function simulate() {
    setSimResult({ success: true, lead_id: 'VNV-' + Math.floor(Math.random() * 9000 + 1000), stage: 'New Lead', message: 'Lead created successfully and added to pipeline.' })
  }
  return (
    <div style={{ flex: 1, overflow: 'auto', padding: 28 }}>
      <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 600, marginBottom: 8 }}>API &amp; HDT Integration</h1>
      <p style={{ color: T.muted, marginBottom: 24 }}>Connect external lead sources (HDT, web forms, partners) to VINOVA Clinic OS via webhook.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div style={S.card}>
          <h4 style={{ marginBottom: 12, color: T.teal, fontFamily: "'Cormorant Garamond',serif", fontSize: 18 }}>Webhook Endpoint</h4>
          <div style={{ background: T.bg, borderRadius: 8, padding: 12, fontFamily: 'monospace', fontSize: 13, color: T.text, marginBottom: 12 }}>
            POST https://vinova.cr/api/leads/ingest
          </div>
          <div style={{ marginBottom: 8 }}>
            {[['Method', 'POST'], ['Auth', 'Bearer Token (header)'], ['Content-Type', 'application/json'], ['Rate Limit', '100 req / min']].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${T.border}`, fontSize: 13 }}>
                <span style={{ color: T.muted }}>{label}</span><span style={{ fontFamily: 'monospace', color: T.text }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={S.card}>
          <h4 style={{ marginBottom: 12, color: T.teal, fontFamily: "'Cormorant Garamond',serif", fontSize: 18 }}>Torus Score Sync</h4>
          <div style={{ background: T.bg, borderRadius: 8, padding: 12, fontFamily: 'monospace', fontSize: 13, color: T.text, marginBottom: 12 }}>
            POST https://vinova.cr/api/torus/sync
          </div>
          <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6 }}>Receives Torus assessment results and automatically updates the client's BioAge, score, and biomarker breakdown in Clinic OS.</p>
          <div style={{ marginTop: 12 }}>
            <Badge label="Torus Health Inc. Partner" color={T.teal} />
          </div>
        </div>
      </div>

      <div style={S.card}>
        <h4 style={{ marginBottom: 12, color: T.teal, fontFamily: "'Cormorant Garamond',serif", fontSize: 18 }}>Request Payload (HDT Lead)</h4>
        <pre style={{ background: T.bg, borderRadius: 8, padding: 16, fontSize: 13, overflowX: 'auto', color: T.text, lineHeight: 1.6 }}>{samplePayload}</pre>
        <div style={{ marginTop: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={simulate} style={{ ...S.btn, ...S.btnPrimary }}>▶ Simulate Ingest</button>
          {simResult && (
            <div style={{ padding: '8px 16px', background: '#d1fae5', borderRadius: 8, color: '#059669', fontSize: 13, fontWeight: 500 }}>
              ✓ {simResult.message} · ID: {simResult.lead_id}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null)
  const [page, setPage] = useState('pipeline')
  const [leads, setLeads] = useState(LEADS_SEED)
  const [products, setProducts] = useState(PRODUCTS_SEED)
  const [selectedLead, setSelectedLead] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)

  if (!user) return <LoginScreen onLogin={setUser} />

  function handleSelectLead(lead) { setSelectedLead(lead); setPage('lead-detail') }
  function handleBackFromLead() { setSelectedLead(null); setPage('pipeline') }
  function handleSelectProduct(product) { setSelectedProduct(product); setPage('product-detail') }
  function handleBackFromProduct() { setSelectedProduct(null); setPage('products') }

  const liveProduct = selectedProduct ? products.find(p => p.id === selectedProduct.id) || selectedProduct : null
  const liveLead = selectedLead ? leads.find(l => l.id === selectedLead.id) || selectedLead : null

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: T.bg }}>
      <Sidebar current={['pipeline', 'lead-detail'].includes(page) ? 'pipeline' : ['products', 'product-detail'].includes(page) ? 'products' : page} onChange={key => { setPage(key); setSelectedLead(null); setSelectedProduct(null) }} user={user} onLogout={() => setUser(null)} />
      {page === 'pipeline' && <Pipeline leads={leads} setLeads={setLeads} onSelectLead={handleSelectLead} />}
      {page === 'lead-detail' && liveLead && <LeadDetail lead={liveLead} onBack={handleBackFromLead} allLeads={leads} setLeads={setLeads} />}
      {page === 'products' && <Products products={products} setProducts={setProducts} onSelectProduct={handleSelectProduct} />}
      {page === 'product-detail' && liveProduct && <ProductDetail product={liveProduct} onBack={handleBackFromProduct} setProducts={setProducts} />}
      {page === 'reports' && <Reports leads={leads} />}
      {page === 'team' && <Team />}
      {page === 'api' && <ApiDocs />}
    </div>
  )
}
