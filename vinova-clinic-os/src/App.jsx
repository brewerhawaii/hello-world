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
  serif: { fontFamily: "'Cormorant Garamond',serif" },
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
  { id: 1, name: 'Elena Vargas', age: 45, email: 'elena@email.com', phone: '+506 8888-1234', stage: 'Consultation', assignedTo: 2, doctor: 1, score: 82, bioAge: 38, notes: 'Interested in full longevity program. High engagement, responds quickly on WhatsApp.', purchaseTotal: 4850, tags: ['VIP', 'Torus Done'] },
  { id: 2, name: 'Roberto Jiménez', age: 52, email: 'roberto@email.com', phone: '+506 8777-5678', stage: 'Proposal', assignedTo: 2, doctor: 1, score: 74, bioAge: 44, notes: 'Follow up re: IV therapy package. Price-sensitive, comparing options.', purchaseTotal: 1200, tags: ['Torus Done'] },
  { id: 3, name: 'Sofia Chen', age: 38, email: 'sofia@email.com', phone: '+506 8666-9012', stage: 'New Lead', assignedTo: 2, doctor: null, score: null, bioAge: null, notes: 'Referral from Elena Vargas. Has not booked assessment yet.', purchaseTotal: 0, tags: [] },
  { id: 4, name: 'Marcos Alvarado', age: 61, email: 'marcos@email.com', phone: '+506 8555-3456', stage: 'Contacted', assignedTo: 2, doctor: 1, score: 68, bioAge: 55, notes: 'Interested in NAD+ protocol for energy and recovery.', purchaseTotal: 650, tags: ['High Priority'] },
  { id: 5, name: 'Ana Gutiérrez', age: 33, email: 'ana@email.com', phone: '+506 8444-7890', stage: 'Closed Won', assignedTo: 2, doctor: 1, score: 91, bioAge: 27, notes: 'Full program enrolled. Excellent results, potential case study.', purchaseTotal: 6000, tags: ['VIP', 'Active Client'] },
  { id: 6, name: 'Luis Fernández', age: 48, email: 'luis@email.com', phone: '+506 8333-2345', stage: 'Closed Lost', assignedTo: 2, doctor: null, score: null, bioAge: null, notes: 'Budget constraints. Revisit Q4.', purchaseTotal: 0, tags: [] },
]

const PRODUCTS_SEED = [
  {
    id: 1, name: 'Longevity Elite Program', category: 'Programs', price: 4800, cost: 1200, status: 'Active', sku: 'LEP-001',
    description: '12-month comprehensive longevity program with monthly assessments, IV therapy, and personalized protocols.',
    protocol: 'A flagship 12-month membership combining quarterly Torus biomarker assessments, monthly physician consultations, a rotating IV therapy schedule (NAD+, glutathione, Myers cocktail), and a personalized peptide + supplement stack adjusted to each cycle of bloodwork.',
    dosage: 'Monthly: 1× physician consult, 1–2× IV infusions. Quarterly: full Torus assessment. Daily: personalized oral supplement stack (provided in 30-day blister packs).',
    productDetails: 'Includes concierge scheduling, WhatsApp clinical support line, and an annual executive health summary report. All consumables and lab fees bundled. Membership auto-renews unless cancelled 30 days before term end.',
    treatmentGuidelines: 'Contraindicated during pregnancy. Baseline ECG and comprehensive metabolic panel required before first IV. Re-assess kidney function before each NAD+ cycle. Not to be combined with concurrent chemotherapy without oncologist sign-off.',
    commissionSalesRep: 15, commissionDoctor: 10, commissionClinic: 75, supplier: 'Internal',
    purchaseOrders: [{ id: 1, date: '2025-01-10', qty: 5, status: 'Delivered', total: 6000 }],
  },
  {
    id: 2, name: 'NAD+ IV Therapy (10 sessions)', category: 'IV Therapy', price: 1200, cost: 320, status: 'Active', sku: 'NAD-010',
    description: 'Premium NAD+ infusion therapy — 10 session package.',
    protocol: 'A 10-session NAD+ infusion course designed to support cellular energy (mitochondrial NAD+ repletion), cognitive clarity, and recovery. Sessions are spaced to allow tolerance build-up, starting low and titrating to target dose.',
    dosage: '500 mg per infusion for sessions 1–2 (slow titration over 2–3 hrs), increasing to 750 mg for sessions 3–10. Recommended cadence: 2× per week for the first 3 weeks, then weekly maintenance.',
    productDetails: 'Administered by a registered nurse in a private suite. Each session includes vitals monitoring and post-infusion electrolytes. Package valid for 6 months from purchase.',
    treatmentGuidelines: 'Common transient effects: chest tightness, flushing, nausea — managed by slowing infusion rate. Screen for cardiovascular disease. Ensure hydration pre-session. Avoid in patients with active infection or uncontrolled hypertension.',
    commissionSalesRep: 12, commissionDoctor: 8, commissionClinic: 80, supplier: 'BioInfusion CR',
    purchaseOrders: [{ id: 1, date: '2025-02-01', qty: 20, status: 'Delivered', total: 6400 }, { id: 2, date: '2025-04-15', qty: 15, status: 'In Transit', total: 4800 }],
  },
  {
    id: 3, name: 'Torus Health Assessment', category: 'Diagnostics', price: 650, cost: 180, status: 'Active', sku: 'THA-001',
    description: 'Full Torus biomarker assessment with biological age score and personalized report.',
    protocol: 'A comprehensive diagnostic combining a venous blood draw (80+ biomarkers), body composition scan, and the proprietary Torus biological-age algorithm. Produces a biological age, an overall longevity score, and a 6-domain biomarker breakdown driving downstream protocol recommendations.',
    dosage: 'N/A — single visit. Fasting blood draw + 30-minute bio-scan. Repeat every 3–6 months to track trajectory.',
    productDetails: 'Results delivered within 5–7 business days via the client portal, followed by a 45-minute physician review consult. Raw lab data exportable as PDF.',
    treatmentGuidelines: 'Requires 10–12 hour fast before the blood draw. Avoid intense exercise and alcohol for 48 hours prior to avoid skewing inflammation markers. Hydrate normally.',
    commissionSalesRep: 10, commissionDoctor: 20, commissionClinic: 70, supplier: 'Torus Health Inc.',
    purchaseOrders: [],
  },
  {
    id: 4, name: 'Peptide Protocol — 3 months', category: 'Protocols', price: 980, cost: 290, status: 'Out of Stock', sku: 'PEP-003',
    description: 'Custom peptide protocol — 3-month supply tailored to individual biomarkers.',
    protocol: 'A physician-directed 3-month regenerative peptide protocol, most commonly a BPC-157 + TB-500 stack for tissue repair and recovery, customized based on the client\'s Torus inflammation and structural domain scores.',
    dosage: 'BPC-157 250 mcg + TB-500 2 mg, subcutaneous. Typical: BPC-157 daily; TB-500 2× per week (loading), tapering to weekly maintenance after week 4. Exact dosing individualized by the prescribing physician.',
    productDetails: 'Supplied as lyophilized vials with bacteriostatic water, insulin syringes, and an injection guide. Cold-chain shipped. Requires an active physician prescription on file.',
    treatmentGuidelines: 'Research/compounded peptides — informed consent required. Rotate injection sites. Contraindicated in active malignancy. Monitor for injection-site reactions. Not for use in pregnancy or breastfeeding.',
    commissionSalesRep: 14, commissionDoctor: 12, commissionClinic: 74, supplier: 'PeptidePure Lab',
    purchaseOrders: [],
  },
]

const TEAM_SEED = [
  { id: 1, name: 'Dr. María Rodríguez', role: 'Doctor', status: 'Active', clients: 18, revenue: 32400, joinDate: '2023-06-01', email: 'maria@vinova.cr', phone: '+506 8900-0001', avatar: 'MR', bio: 'Lead physician, longevity & regenerative medicine. Oversees all Torus assessments and clinical protocols.' },
  { id: 2, name: 'Carlos Méndez', role: 'Sales Rep', status: 'Active', clients: 24, revenue: 47200, joinDate: '2023-09-15', email: 'carlos@vinova.cr', phone: '+506 8900-0002', avatar: 'CM', bio: 'Senior sales representative. Primary owner of the VIP and referral pipeline.' },
  { id: 3, name: 'Valeria Torres', role: 'Sales Rep', status: 'Active', clients: 19, revenue: 38900, joinDate: '2024-01-10', email: 'valeria@vinova.cr', phone: '+506 8900-0003', avatar: 'VT', bio: 'Sales representative focused on IV therapy and diagnostics packages.' },
  { id: 4, name: 'Dr. Esteban Mora', role: 'Doctor', status: 'Inactive', clients: 5, revenue: 8200, joinDate: '2024-03-01', email: 'esteban@vinova.cr', phone: '+506 8900-0004', avatar: 'EM', bio: 'Consulting physician (part-time). Peptide and hormone protocols.' },
]

// Sales records — each ties a lead → product → rep → doctor, with status & date.
const SALES_SEED = [
  { id: 1, leadId: 1, productId: 1, date: '2025-05-10', amount: 4200, repId: 2, doctorId: 1, status: 'Paid' },
  { id: 2, leadId: 1, productId: 3, date: '2025-05-01', amount: 650, repId: 2, doctorId: 1, status: 'Paid' },
  { id: 3, leadId: 2, productId: 2, date: '2025-04-20', amount: 1200, repId: 2, doctorId: 1, status: 'Pending' },
  { id: 4, leadId: 4, productId: 3, date: '2025-05-02', amount: 650, repId: 2, doctorId: 1, status: 'Paid' },
  { id: 5, leadId: 5, productId: 1, date: '2025-03-15', amount: 4800, repId: 2, doctorId: 1, status: 'Paid' },
  { id: 6, leadId: 5, productId: 2, date: '2025-04-02', amount: 1200, repId: 2, doctorId: 1, status: 'Paid' },
]

// Documents — real, openable content (rendered + downloadable as a file).
const DOCUMENTS_SEED = [
  { id: 1, leadId: 1, name: 'Lab Results — Apr 2025', type: 'PDF', category: 'Lab Results', date: '2025-04-28', author: 'Dr. María Rodríguez', content: 'VINOVA LONGEVITY EXPERTS\nLABORATORY RESULTS\n\nPatient: Elena Vargas\nDate of Collection: 2025-04-26\nOrdering Physician: Dr. María Rodríguez\n\n— COMPLETE BLOOD COUNT —\nWBC: 5.4 x10^9/L (normal)\nRBC: 4.6 x10^12/L (normal)\nHemoglobin: 13.8 g/dL (normal)\n\n— METABOLIC —\nFasting Glucose: 88 mg/dL (optimal)\nHbA1c: 5.1% (optimal)\nFasting Insulin: 4.2 µIU/mL (optimal)\n\n— LIPIDS —\nTotal Cholesterol: 182 mg/dL\nLDL: 98 mg/dL\nHDL: 68 mg/dL\nTriglycerides: 74 mg/dL\n\n— INFLAMMATION —\nhs-CRP: 0.4 mg/L (low — excellent)\n\nINTERPRETATION: Metabolic and inflammatory markers are excellent.\nLipid profile favorable. Continue current protocol.' },
  { id: 2, leadId: 1, name: 'Intake Form', type: 'PDF', category: 'Intake', date: '2025-04-20', author: 'Elena Vargas', content: 'VINOVA — NEW CLIENT INTAKE FORM\n\nName: Elena Vargas\nAge: 45\nPrimary Goals: Longevity optimization, energy, skin health\nKnown Conditions: None\nMedications: Vitamin D, Omega-3\nAllergies: None reported\nFamily History: Mother — hypertension\nExercise: 4x/week (strength + pilates)\nSleep: 7 hrs avg\n\nConsent to assessment: YES\nSignature on file: Elena Vargas (2025-04-20)' },
  { id: 3, leadId: 1, name: 'Consent — Torus Assessment', type: 'PDF', category: 'Consent', date: '2025-05-01', author: 'Elena Vargas', content: 'INFORMED CONSENT — TORUS HEALTH ASSESSMENT\n\nI, Elena Vargas, consent to the collection of a venous blood sample and body composition scan for the purpose of the Torus biological-age assessment.\n\nI understand results are for wellness optimization and not a substitute for diagnostic medical care.\n\nSigned: Elena Vargas\nWitness: Carlos Méndez\nDate: 2025-05-01' },
  { id: 4, leadId: 5, name: 'Program Agreement', type: 'PDF', category: 'Contract', date: '2025-03-15', author: 'Ana Gutiérrez', content: 'LONGEVITY ELITE PROGRAM — MEMBERSHIP AGREEMENT\n\nMember: Ana Gutiérrez\nProgram: Longevity Elite (12 months)\nStart Date: 2025-03-15\nFee: $4,800 (paid in full)\n\nIncluded: Quarterly Torus assessments, monthly consults, IV schedule, supplement stack.\n\nSigned: Ana Gutiérrez\nClinic Rep: Carlos Méndez' },
]

// Timeline — rich events with full details for drill-down.
const TIMELINE_SEED = [
  { id: 1, leadId: 1, type: 'consultation', title: 'Initial Consultation', text: 'Initial consultation call — 45 mins. Discussed longevity goals.', date: '2025-04-28', time: '10:00', duration: '45 min', author: 'Carlos Méndez', location: 'Video call', participants: ['Elena Vargas', 'Carlos Méndez'], details: 'Reviewed Elena\'s goals: sustained energy, skin health, and long-term metabolic optimization. She is highly motivated and already exercises 4x/week. Walked through the Longevity Elite Program structure and the Torus assessment. She expressed strong interest and asked about IV therapy add-ons. Next step: book Torus assessment.', outcome: 'Booked Torus assessment for May 1.' },
  { id: 2, leadId: 1, type: 'whatsapp', title: 'WhatsApp — Brochure Sent', text: 'Sent Torus assessment brochure via WhatsApp.', date: '2025-04-30', time: '14:20', duration: '—', author: 'Carlos Méndez', location: 'WhatsApp', participants: ['Elena Vargas', 'Carlos Méndez'], details: 'Sent the Torus assessment PDF brochure and pre-assessment fasting instructions. Elena confirmed receipt and asked about parking — provided details. Confirmed 10–12hr fast before the draw.', outcome: 'Client confirmed and prepared for assessment.' },
  { id: 3, leadId: 1, type: 'assessment', title: 'Torus Assessment Completed', text: 'Torus assessment completed. BioAge: 38. Score: 82.', date: '2025-05-05', time: '09:00', duration: '60 min', author: 'Dr. María Rodríguez', location: 'Clinic — Suite 2', participants: ['Elena Vargas', 'Dr. María Rodríguez'], details: 'Full Torus assessment performed. Biological age 38 vs chronological 45 (7 years younger). Standout domains: cardiovascular (88) and cognitive (85). Opportunity areas: hormonal (69). Recommended NAD+ therapy and a peptide protocol. Reviewed the full 6-domain breakdown with Elena in a 30-min consult.', outcome: 'BioAge 38, Score 82. Protocols recommended.' },
  { id: 4, leadId: 1, type: 'purchase', title: 'Enrolled — Longevity Elite', text: 'Enrolled in Longevity Elite Program — $4,200.', date: '2025-05-10', time: '11:30', duration: '—', author: 'Carlos Méndez', location: 'Clinic — Front desk', participants: ['Elena Vargas', 'Carlos Méndez'], details: 'Elena enrolled in the Longevity Elite Program at a promotional rate of $4,200. Payment in full via card. Scheduled first monthly consult and initial IV session. Added Torus assessment ($650) already completed to her record.', outcome: 'Closed — $4,200 program + $650 assessment.' },
  { id: 5, leadId: 4, type: 'call', title: 'Follow-up Call', text: 'Discussed NAD+ protocol options and pricing.', date: '2025-05-03', time: '16:00', duration: '20 min', author: 'Carlos Méndez', location: 'Phone', participants: ['Marcos Alvarado', 'Carlos Méndez'], details: 'Marcos is interested in NAD+ for energy and post-exercise recovery. Walked through the 10-session package and titration schedule. He wants to complete a Torus assessment first to establish a baseline. Some price sensitivity — mentioned comparing with another clinic.', outcome: 'Will book assessment; follow up in 1 week.' },
  { id: 6, leadId: 5, type: 'appointment', title: 'Monthly Consult #2', text: 'Monthly physician consult — protocol adjustment.', date: '2025-04-02', time: '10:30', duration: '30 min', author: 'Dr. María Rodríguez', location: 'Clinic — Suite 1', participants: ['Ana Gutiérrez', 'Dr. María Rodríguez'], details: 'Reviewed Ana\'s progress two months into the program. Energy and sleep markedly improved. Adjusted supplement stack — increased magnesium, added CoQ10. Started NAD+ IV course. Excellent adherence; flagged as potential case study (with consent).', outcome: 'Protocol adjusted; NAD+ course started.' },
]

// ─── Navigation context (passed down as props) ────────────────────────────────
// view objects: {type:'pipeline'|'products'|'reports'|'team'|'api'|'lead'|'product'|'person', id?, tab?}

// ─── Utility helpers ──────────────────────────────────────────────────────────
function Avatar({ initials, size = 36, color = T.teal, onClick }) {
  return (
    <div onClick={onClick} style={{ width: size, height: size, borderRadius: '50%', background: color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: size * 0.35, flexShrink: 0, cursor: onClick ? 'pointer' : 'default' }}>
      {initials}
    </div>
  )
}

function Badge({ label, color = T.teal, bg, onClick }) {
  return <span onClick={onClick} style={{ ...S.badge, background: bg || color + '18', color, cursor: onClick ? 'pointer' : 'default' }}>{label}</span>
}

// Clickable inline link used everywhere for drill-down.
function Link({ children, onClick, color = T.teal, bold = true }) {
  return (
    <span
      onClick={e => { e.stopPropagation(); onClick && onClick() }}
      style={{ color, cursor: 'pointer', fontWeight: bold ? 600 : 500, textDecoration: 'underline', textDecorationColor: 'transparent', textUnderlineOffset: 2, transition: 'text-decoration-color .12s' }}
      onMouseEnter={e => (e.currentTarget.style.textDecorationColor = color)}
      onMouseLeave={e => (e.currentTarget.style.textDecorationColor = 'transparent')}
    >{children}</span>
  )
}

function Tab({ tabs, active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4, borderBottom: `1px solid ${T.border}`, marginBottom: 20, flexWrap: 'wrap' }}>
      {tabs.map(t => (
        <button key={t} onClick={() => onChange(t)} style={{ ...S.btn, borderRadius: '8px 8px 0 0', padding: '8px 16px', background: active === t ? T.teal : 'transparent', color: active === t ? '#fff' : T.muted, fontWeight: active === t ? 600 : 400 }}>{t}</button>
      ))}
    </div>
  )
}

function Modal({ title, onClose, children, wide }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.surface, borderRadius: 12, padding: 28, width: '100%', maxWidth: wide ? 720 : 520, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, gap: 12 }}>
          <h3 style={{ ...S.serif, fontSize: 22, fontWeight: 600, color: T.text }}>{title}</h3>
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

function initialsOf(name) { return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() }
function personColor(p) { return p && p.role === 'Doctor' ? T.coral : T.teal }
function commissionFor(sale, product, who) {
  if (!product) return 0
  const pct = who === 'rep' ? product.commissionSalesRep : who === 'doctor' ? product.commissionDoctor : product.commissionClinic
  return Math.round(sale.amount * pct / 100)
}

// ─── Document Viewer ──────────────────────────────────────────────────────────
function DocumentViewer({ doc, onClose }) {
  function openExternally() {
    const blob = new Blob([doc.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
    setTimeout(() => URL.revokeObjectURL(url), 10000)
  }
  function download() {
    const blob = new Blob([doc.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = doc.name.replace(/[^a-z0-9]+/gi, '_') + '.txt'
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 10000)
  }
  return (
    <Modal title={doc.name} onClose={onClose} wide>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <Badge label={doc.type} color={T.coral} bg={T.coralLight} />
        <Badge label={doc.category} color={T.teal} />
        <span style={{ fontSize: 13, color: T.muted, alignSelf: 'center' }}>{doc.date} · {doc.author}</span>
      </div>
      <pre style={{ background: T.bg, borderRadius: 8, padding: 20, fontSize: 13, lineHeight: 1.7, color: T.text, whiteSpace: 'pre-wrap', fontFamily: 'ui-monospace, monospace', border: `1px solid ${T.border}`, maxHeight: '50vh', overflowY: 'auto' }}>{doc.content}</pre>
      <div style={{ display: 'flex', gap: 10, marginTop: 16, justifyContent: 'flex-end' }}>
        <button onClick={openExternally} style={{ ...S.btn, ...S.btnSecondary }}>↗ Open in new tab</button>
        <button onClick={download} style={{ ...S.btn, ...S.btnPrimary }}>⬇ Download</button>
      </div>
    </Modal>
  )
}

// ─── Timeline Event Detail ────────────────────────────────────────────────────
const TIMELINE_ICONS = { consultation: '🩺', call: '📞', appointment: '📅', whatsapp: '💬', email: '✉️', note: '📝', assessment: '🧬', purchase: '💳' }
function TimelineEventDetail({ event, onClose }) {
  return (
    <Modal title={event.title} onClose={onClose} wide>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
        <Badge label={`${TIMELINE_ICONS[event.type] || '📌'} ${event.type}`} color={T.teal} />
        <span style={{ fontSize: 13, color: T.muted }}>{event.date} · {event.time} · {event.duration}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        {[['Logged by', event.author], ['Location', event.location], ['Participants', (event.participants || []).join(', ')], ['Duration', event.duration]].map(([l, v]) => (
          <div key={l} style={{ background: T.bg, borderRadius: 8, padding: '10px 12px' }}>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 2 }}>{l}</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{v || '—'}</div>
          </div>
        ))}
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: T.muted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Notes & Details</div>
        <p style={{ color: T.text, lineHeight: 1.7 }}>{event.details}</p>
      </div>
      {event.outcome && (
        <div style={{ padding: '12px 16px', background: T.tealLight, borderRadius: 8, color: T.teal }}>
          <strong>Outcome:</strong> {event.outcome}
        </div>
      )}
    </Modal>
  )
}

// ─── Sale / Commission Detail ─────────────────────────────────────────────────
function SaleDetail({ sale, products, leads, team, onClose, navigate }) {
  const product = products.find(p => p.id === sale.productId)
  const lead = leads.find(l => l.id === sale.leadId)
  const rep = team.find(t => t.id === sale.repId)
  const doctor = team.find(t => t.id === sale.doctorId)
  const repC = commissionFor(sale, product, 'rep')
  const docC = commissionFor(sale, product, 'doctor')
  const clinicC = commissionFor(sale, product, 'clinic')
  const go = v => { onClose(); navigate(v) }
  return (
    <Modal title="Sale & Commission Detail" onClose={onClose} wide>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        {[
          ['Client', lead && <Link onClick={() => go({ type: 'lead', id: lead.id })}>{lead.name}</Link>],
          ['Product', product && <Link onClick={() => go({ type: 'product', id: product.id })}>{product.name}</Link>],
          ['Date', sale.date],
          ['Status', <Badge label={sale.status} color={sale.status === 'Paid' ? '#059669' : '#d97706'} bg={sale.status === 'Paid' ? '#d1fae5' : '#fef3c7'} />],
          ['Sales Rep', rep && <Link onClick={() => go({ type: 'person', id: rep.id })} color={personColor(rep)}>{rep.name}</Link>],
          ['Doctor', doctor && <Link onClick={() => go({ type: 'person', id: doctor.id })} color={personColor(doctor)}>{doctor.name}</Link>],
        ].map(([l, v]) => (
          <div key={l} style={{ background: T.bg, borderRadius: 8, padding: '10px 12px' }}>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 2 }}>{l}</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: T.text }}>{v || '—'}</div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', padding: 16, background: T.tealLight, borderRadius: 10, marginBottom: 20 }}>
        <div style={{ fontSize: 32, fontWeight: 700, color: T.teal }}>${sale.amount.toLocaleString()}</div>
        <div style={{ fontSize: 12, color: T.muted }}>Total Sale Amount</div>
      </div>
      <div style={{ fontSize: 12, color: T.muted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Commission Breakdown</div>
      <div style={{ display: 'flex', height: 36, borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ width: `${product?.commissionSalesRep || 0}%`, background: T.teal, color: '#fff', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{product?.commissionSalesRep}%</div>
        <div style={{ width: `${product?.commissionDoctor || 0}%`, background: T.coral, color: '#fff', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{product?.commissionDoctor}%</div>
        <div style={{ width: `${product?.commissionClinic || 0}%`, background: T.tealMid, color: '#fff', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{product?.commissionClinic}%</div>
      </div>
      {[['Sales Rep', rep, repC, T.teal, 'rep'], ['Doctor', doctor, docC, T.coral, 'doctor'], ['Clinic', null, clinicC, T.tealMid, 'clinic']].map(([label, person, amt, color]) => (
        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${T.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: color }} />
            <span style={{ fontWeight: 500 }}>{person ? <Link onClick={() => go({ type: 'person', id: person.id })} color={personColor(person)}>{person.name}</Link> : label}</span>
          </div>
          <span style={{ fontWeight: 700, color }}>${amt.toLocaleString()}</span>
        </div>
      ))}
    </Modal>
  )
}

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [sel, setSel] = useState(null)
  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(135deg, ${T.teal} 0%, ${T.tealMid} 50%, #0d4a52 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: T.surface, borderRadius: 16, padding: 40, width: '100%', maxWidth: 420, textAlign: 'center', boxShadow: '0 24px 80px rgba(0,0,0,.25)' }}>
        <div style={{ ...S.serif, fontSize: 32, fontWeight: 600, color: T.teal, marginBottom: 4 }}>VINOVA</div>
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
        <div style={{ ...S.serif, fontSize: 24, fontWeight: 600, color: T.teal }}>VINOVA</div>
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
function LeadDetail({ lead, navigate, goBack, leads, setLeads, products, team, sales, documents, timeline, setTimeline, initialTab }) {
  const [tab, setTab] = useState(initialTab || 'Overview')
  const [noteText, setNoteText] = useState('')
  const [openDoc, setOpenDoc] = useState(null)
  const [openEvent, setOpenEvent] = useState(null)
  const [openSale, setOpenSale] = useState(null)

  const doctor = team.find(u => u.id === lead.doctor)
  const salesRep = team.find(u => u.id === lead.assignedTo)
  const [stageColor_, stageBg] = stageColor(lead.stage)
  const leadDocs = documents.filter(d => d.leadId === lead.id)
  const leadTimeline = timeline.filter(t => t.leadId === lead.id)
  const leadSales = sales.filter(s => s.leadId === lead.id)
  const leadLTV = leadSales.reduce((s, x) => s + x.amount, 0)

  function addNote() {
    if (!noteText.trim()) return
    setTimeline(prev => [...prev, { id: Date.now(), leadId: lead.id, type: 'note', title: 'Note', text: noteText, details: noteText, date: new Date().toISOString().slice(0, 10), time: new Date().toTimeString().slice(0, 5), duration: '—', location: '—', participants: [], author: 'Admin User', outcome: '' }])
    setNoteText('')
  }

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: 28 }}>
      <button onClick={goBack} style={{ ...S.btn, ...S.btnGhost, marginBottom: 20 }}>← Back</button>

      {/* Header */}
      <div style={{ ...S.card, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <Avatar initials={initialsOf(lead.name)} size={56} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <h2 style={{ ...S.serif, fontSize: 28, fontWeight: 600, color: T.text, marginBottom: 6 }}>{lead.name}</h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <Badge label={lead.stage} color={stageColor_} bg={stageBg} />
              {lead.tags.map(tag => <Badge key={tag} label={tag} color={T.coral} bg={T.coralLight} />)}
              <span style={{ fontSize: 13, color: T.muted }}>{lead.age} yrs · {lead.email} · {lead.phone}</span>
            </div>
            <div style={{ marginTop: 10, fontSize: 13, color: T.muted, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <span>Rep: {salesRep ? <Link onClick={() => navigate({ type: 'person', id: salesRep.id })} color={personColor(salesRep)}>{salesRep.name}</Link> : '—'}</span>
              <span>Doctor: {doctor ? <Link onClick={() => navigate({ type: 'person', id: doctor.id })} color={personColor(doctor)}>{doctor.name}</Link> : '—'}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <a href={`tel:${lead.phone}`} title="Call" style={{ ...S.btn, ...S.btnSecondary, textDecoration: 'none', fontSize: 18 }}>📞</a>
            <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" title="WhatsApp" style={{ ...S.btn, background: '#25d366', color: '#fff', textDecoration: 'none', fontSize: 18 }}>💬</a>
            <a href="https://m.me/" target="_blank" rel="noreferrer" title="Messenger" style={{ ...S.btn, background: '#0084ff', color: '#fff', textDecoration: 'none', fontSize: 18 }}>📨</a>
            <a href={`mailto:${lead.email}`} title="Email" style={{ ...S.btn, ...S.btnCoral, textDecoration: 'none', fontSize: 18 }}>✉️</a>
          </div>
        </div>
      </div>

      <Tab tabs={['Overview', 'Treatment Reports', 'Documents', 'Timeline', 'Sales']} active={tab} onChange={setTab} />

      {tab === 'Overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={S.card}>
            <h4 style={{ marginBottom: 12, color: T.teal, ...S.serif, fontSize: 18 }}>Notes</h4>
            <p style={{ color: T.text, lineHeight: 1.6 }}>{lead.notes}</p>
            <div style={{ marginTop: 16 }}>
              <textarea value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Add a note…" style={{ ...S.input, height: 80, resize: 'vertical' }} />
              <button onClick={addNote} style={{ ...S.btn, ...S.btnPrimary, marginTop: 8 }}>Save Note</button>
            </div>
          </div>
          <div style={S.card}>
            <h4 style={{ marginBottom: 12, color: T.teal, ...S.serif, fontSize: 18 }}>Purchase Summary</h4>
            <div style={{ fontSize: 32, fontWeight: 700, color: T.teal, marginBottom: 4 }}>${leadLTV.toLocaleString()}</div>
            <div style={{ color: T.muted, marginBottom: 16 }}>Total lifetime value · {leadSales.length} purchase{leadSales.length !== 1 ? 's' : ''}</div>
            <hr style={{ border: 'none', borderTop: `1px solid ${T.border}`, marginBottom: 12 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: T.muted }}>Assigned Rep</span>
              <span>{salesRep ? <Link onClick={() => navigate({ type: 'person', id: salesRep.id })} color={personColor(salesRep)}>{salesRep.name}</Link> : '—'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: T.muted }}>Doctor</span>
              <span>{doctor ? <Link onClick={() => navigate({ type: 'person', id: doctor.id })} color={personColor(doctor)}>{doctor.name}</Link> : '—'}</span>
            </div>
            <button onClick={() => setTab('Sales')} style={{ ...S.btn, ...S.btnSecondary, marginTop: 16, width: '100%' }}>View Sales & Commissions →</button>
          </div>
          <div style={S.card}>
            <h4 style={{ marginBottom: 12, color: T.teal, ...S.serif, fontSize: 18 }}>Torus Snapshot</h4>
            {lead.score ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 100, height: 100, borderRadius: '50%', background: `conic-gradient(${T.teal} ${lead.score * 3.6}deg, ${T.tealLight} 0deg)`, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 72, height: 72, borderRadius: '50%', background: T.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 24, color: T.teal }}>{lead.score}</div>
                </div>
                <div style={{ color: T.muted, fontSize: 13 }}>BioAge: <strong style={{ color: T.teal }}>{lead.bioAge} yrs</strong> (Chron: {lead.age})</div>
                <button onClick={() => setTab('Treatment Reports')} style={{ ...S.btn, ...S.btnSecondary, marginTop: 14 }}>Open Treatment Report →</button>
              </div>
            ) : <div style={{ color: T.muted, fontStyle: 'italic' }}>No assessment yet</div>}
          </div>
          <div style={S.card}>
            <h4 style={{ marginBottom: 12, color: T.teal, ...S.serif, fontSize: 18 }}>Stage Management</h4>
            {STAGES.map(s => {
              const [sc, sbg] = stageColor(s)
              return (
                <button key={s} onClick={() => setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, stage: s } : l))} style={{ ...S.btn, background: lead.stage === s ? sc : sbg, color: lead.stage === s ? '#fff' : sc, marginRight: 6, marginBottom: 6, fontSize: 12 }}>{s}</button>
              )
            })}
          </div>
        </div>
      )}

      {tab === 'Treatment Reports' && (
        <div style={S.card}>
          {lead.score ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24, flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ ...S.serif, fontSize: 48, fontWeight: 700, color: T.teal }}>{lead.score}</div>
                  <div style={{ color: T.muted, fontSize: 13 }}>Torus Score</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ ...S.serif, fontSize: 48, fontWeight: 700, color: T.coral }}>{lead.bioAge}</div>
                  <div style={{ color: T.muted, fontSize: 13 }}>Biological Age</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ ...S.serif, fontSize: 48, fontWeight: 700, color: T.tealMid }}>{lead.age - lead.bioAge}</div>
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
              <div style={{ fontSize: 12, color: T.muted, marginBottom: 10 }}>Click a protocol to open the full product details, dosage & treatment guidelines.</div>
              {products.filter(p => ['IV Therapy', 'Protocols', 'Programs'].includes(p.category)).map(p => (
                <div key={p.id} onClick={() => navigate({ type: 'product', id: p.id })} style={{ padding: '10px 14px', background: T.tealLight, borderRadius: 8, marginBottom: 8, color: T.teal, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>→ {p.name}</span><span style={{ fontSize: 12 }}>View details ↗</span>
                </div>
              ))}
            </>
          ) : <div style={{ textAlign: 'center', padding: 40, color: T.muted }}>No Torus assessment on file for this client.</div>}
        </div>
      )}

      {tab === 'Documents' && (
        <div style={S.card}>
          <h4 style={{ marginBottom: 16, ...S.serif, fontSize: 18, color: T.teal }}>Client Documents</h4>
          <div style={{ fontSize: 12, color: T.muted, marginBottom: 12 }}>Click any document to open and read it.</div>
          {leadDocs.length === 0 && <div style={{ color: T.muted, fontStyle: 'italic', padding: 16 }}>No documents on file.</div>}
          {leadDocs.map(doc => (
            <div key={doc.id} onClick={() => setOpenDoc(doc)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', border: `1px solid ${T.border}`, borderRadius: 8, marginBottom: 8, cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.background = T.bg)} onMouseLeave={e => (e.currentTarget.style.background = T.surface)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20 }}>📄</span>
                <div><div style={{ fontWeight: 600, color: T.teal }}>{doc.name}</div><div style={{ fontSize: 12, color: T.muted }}>{doc.type} · {doc.category} · {doc.date}</div></div>
              </div>
              <span style={{ ...S.btn, ...S.btnSecondary, fontSize: 12 }}>Open →</span>
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
          <h4 style={{ marginBottom: 20, ...S.serif, fontSize: 18, color: T.teal }}>Activity Timeline</h4>
          <div style={{ fontSize: 12, color: T.muted, marginBottom: 16 }}>Click any event to open its full notes & details.</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <input value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Add a timeline entry…" style={S.input} />
            <button onClick={addNote} style={{ ...S.btn, ...S.btnPrimary, whiteSpace: 'nowrap' }}>Add Entry</button>
          </div>
          <div style={{ position: 'relative', paddingLeft: 24 }}>
            <div style={{ position: 'absolute', left: 8, top: 0, bottom: 0, width: 2, background: T.tealLight }} />
            {[...leadTimeline].reverse().map(entry => (
              <div key={entry.id} onClick={() => setOpenEvent(entry)} style={{ position: 'relative', marginBottom: 16, cursor: 'pointer', padding: '8px 12px', borderRadius: 8, border: `1px solid ${T.border}`, background: T.surface }}
                onMouseEnter={e => (e.currentTarget.style.background = T.bg)} onMouseLeave={e => (e.currentTarget.style.background = T.surface)}>
                <div style={{ position: 'absolute', left: -20, top: 16, width: 12, height: 12, borderRadius: '50%', background: T.teal, border: `2px solid ${T.surface}` }} />
                <div style={{ fontSize: 12, color: T.muted, marginBottom: 4 }}>{entry.date}{entry.time ? ` · ${entry.time}` : ''} · {entry.author}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 600, color: T.text }}>{TIMELINE_ICONS[entry.type] || '📌'} {entry.title || entry.text}</span>
                  <span style={{ fontSize: 12, color: T.teal, fontWeight: 600 }}>Details →</span>
                </div>
                {entry.title && <div style={{ fontSize: 13, color: T.muted, marginTop: 2 }}>{entry.text}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'Sales' && (
        <div style={S.card}>
          <h4 style={{ marginBottom: 16, ...S.serif, fontSize: 18, color: T.teal }}>Sales & Commissions</h4>
          <div style={{ marginBottom: 16, padding: 16, background: T.tealLight, borderRadius: 10 }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: T.teal }}>${leadLTV.toLocaleString()}</div>
            <div style={{ fontSize: 12, color: T.muted }}>Lifetime Value · {leadSales.length} purchase{leadSales.length !== 1 ? 's' : ''}</div>
          </div>
          {leadSales.length === 0 ? <div style={{ color: T.muted, fontStyle: 'italic', textAlign: 'center', padding: 24 }}>No purchases yet.</div> : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
                <thead><tr style={{ borderBottom: `2px solid ${T.border}` }}>
                  {['Product', 'Date', 'Rep', 'Doctor', 'Amount', 'Rep Comm.', 'Status', ''].map(h => <th key={h} style={{ textAlign: 'left', padding: '8px 10px', fontSize: 12, color: T.muted, fontWeight: 500 }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {leadSales.map(sale => {
                    const product = products.find(p => p.id === sale.productId)
                    const rep = team.find(t => t.id === sale.repId)
                    const doc = team.find(t => t.id === sale.doctorId)
                    return (
                      <tr key={sale.id} style={{ borderBottom: `1px solid ${T.border}` }}>
                        <td style={{ padding: '10px' }}>{product ? <Link onClick={() => navigate({ type: 'product', id: product.id })}>{product.name}</Link> : '—'}</td>
                        <td style={{ padding: '10px', color: T.muted, fontSize: 13 }}>{sale.date}</td>
                        <td style={{ padding: '10px' }}>{rep ? <Link onClick={() => navigate({ type: 'person', id: rep.id })} color={personColor(rep)}>{rep.name.split(' ')[0]}</Link> : '—'}</td>
                        <td style={{ padding: '10px' }}>{doc ? <Link onClick={() => navigate({ type: 'person', id: doc.id })} color={personColor(doc)}>{doc.name.split(' ').slice(0, 2).join(' ')}</Link> : '—'}</td>
                        <td style={{ padding: '10px', fontWeight: 600, color: T.teal }}><Link onClick={() => setOpenSale(sale)} color={T.teal}>${sale.amount.toLocaleString()}</Link></td>
                        <td style={{ padding: '10px', color: T.text }}>${commissionFor(sale, product, 'rep').toLocaleString()}</td>
                        <td style={{ padding: '10px' }}><Badge label={sale.status} color={sale.status === 'Paid' ? '#059669' : '#d97706'} bg={sale.status === 'Paid' ? '#d1fae5' : '#fef3c7'} /></td>
                        <td style={{ padding: '10px' }}><button onClick={() => setOpenSale(sale)} style={{ ...S.btn, ...S.btnSecondary, fontSize: 11, padding: '4px 10px' }}>Breakdown</button></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {openDoc && <DocumentViewer doc={openDoc} onClose={() => setOpenDoc(null)} />}
      {openEvent && <TimelineEventDetail event={openEvent} onClose={() => setOpenEvent(null)} />}
      {openSale && <SaleDetail sale={openSale} products={products} leads={leads} team={team} onClose={() => setOpenSale(null)} navigate={navigate} />}
    </div>
  )
}

// ─── Pipeline (Kanban) ────────────────────────────────────────────────────────
function Pipeline({ leads, setLeads, navigate, team }) {
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
        <h1 style={{ ...S.serif, fontSize: 32, fontWeight: 600, color: T.text }}>Sales Pipeline</h1>
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
                  const rep = team.find(u => u.id === lead.assignedTo)
                  return (
                    <div key={lead.id} onClick={() => navigate({ type: 'lead', id: lead.id })} style={{ ...S.card, cursor: 'pointer', padding: 14, transition: 'box-shadow .15s' }}
                      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(27,107,114,.2)')}
                      onMouseLeave={e => (e.currentTarget.style.boxShadow = S.card.boxShadow)}>
                      <div style={{ fontWeight: 600, color: T.text, marginBottom: 4 }}>{lead.name}</div>
                      <div style={{ fontSize: 12, color: T.muted, marginBottom: 8 }}>{lead.age} yrs · {lead.email}</div>
                      {lead.score && <div style={{ fontSize: 12, color: T.teal, marginBottom: 6 }}>🧬 BioAge {lead.bioAge} · Score {lead.score}</div>}
                      {lead.purchaseTotal > 0 && <div style={{ fontSize: 12, color: '#059669', marginBottom: 6 }}>💰 ${lead.purchaseTotal.toLocaleString()}</div>}
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {lead.tags.map(t => <Badge key={t} label={t} color={T.coral} bg={T.coralLight} />)}
                      </div>
                      {rep && <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: T.muted }}>
                        <Avatar initials={rep.avatar} size={18} color={personColor(rep)} onClick={e => { e.stopPropagation(); navigate({ type: 'person', id: rep.id }) }} />
                        <Link onClick={() => navigate({ type: 'person', id: rep.id })} color={T.muted} bold={false}>{rep.name.split(' ')[0]}</Link>
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
function ProductDetail({ product, navigate, goBack, setProducts, sales, leads, team }) {
  const [tab, setTab] = useState('Overview')
  const margin = ((product.price - product.cost) / product.price * 100).toFixed(1)
  const [newPO, setNewPO] = useState({ date: '', qty: '', status: 'Ordered' })
  const [showPOForm, setShowPOForm] = useState(false)
  const statusColors = { Active: [T.teal, T.tealLight], 'Out of Stock': [T.coral, T.coralLight], Discontinued: [T.muted, '#f3f4f6'] }
  const [sc, sbg] = statusColors[product.status] || [T.muted, '#f3f4f6']
  const productSales = sales.filter(s => s.productId === product.id)

  function addPO() {
    const po = { id: Date.now(), ...newPO, qty: Number(newPO.qty), total: Number(newPO.qty) * product.cost }
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, purchaseOrders: [...p.purchaseOrders, po] } : p))
    setShowPOForm(false)
    setNewPO({ date: '', qty: '', status: 'Ordered' })
  }

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: 28 }}>
      <button onClick={goBack} style={{ ...S.btn, ...S.btnGhost, marginBottom: 20 }}>← Back</button>
      <div style={{ ...S.card, marginBottom: 20, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ ...S.serif, fontSize: 28, fontWeight: 600, marginBottom: 8 }}>{product.name}</h2>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
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

      <Tab tabs={['Overview', 'Protocol & Dosage', 'Commission Config', 'Sales', 'Purchase Orders', 'Supplier']} active={tab} onChange={setTab} />

      {tab === 'Overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={{ ...S.card, gridColumn: '1/-1' }}>
            <h4 style={{ marginBottom: 10, color: T.teal, ...S.serif, fontSize: 18 }}>Description</h4>
            <p style={{ color: T.text, lineHeight: 1.7 }}>{product.description}</p>
          </div>
          <div style={{ ...S.card, gridColumn: '1/-1' }}>
            <h4 style={{ marginBottom: 10, color: T.teal, ...S.serif, fontSize: 18 }}>Product Details</h4>
            <p style={{ color: T.text, lineHeight: 1.7 }}>{product.productDetails}</p>
          </div>
          {[['Price', `$${product.price.toLocaleString()}`], ['Cost', `$${product.cost.toLocaleString()}`], ['Gross Margin', `$${(product.price - product.cost).toLocaleString()} (${margin}%)`], ['Category', product.category]].map(([label, val]) => (
            <div key={label} style={S.card}>
              <div style={{ fontSize: 12, color: T.muted, marginBottom: 6 }}>{label}</div>
              <div style={{ fontSize: 20, fontWeight: 600, color: T.teal }}>{val}</div>
            </div>
          ))}
          <div style={{ ...S.card, display: 'flex', gap: 10, gridColumn: '1/-1' }}>
            {['Active', 'Out of Stock', 'Discontinued'].map(s => {
              const [ssc, ssbg] = statusColors[s] || [T.muted, '#f3f4f6']
              return <button key={s} onClick={() => setProducts(prev => prev.map(p => p.id === product.id ? { ...p, status: s } : p))} style={{ ...S.btn, background: product.status === s ? ssc : ssbg, color: product.status === s ? '#fff' : ssc, fontSize: 12 }}>{s}</button>
            })}
          </div>
        </div>
      )}

      {tab === 'Protocol & Dosage' && (
        <div style={{ display: 'grid', gap: 20 }}>
          <div style={S.card}>
            <h4 style={{ marginBottom: 10, color: T.teal, ...S.serif, fontSize: 18 }}>🧬 Protocol Description</h4>
            <p style={{ color: T.text, lineHeight: 1.7 }}>{product.protocol}</p>
          </div>
          <div style={{ ...S.card, borderLeft: `4px solid ${T.teal}` }}>
            <h4 style={{ marginBottom: 10, color: T.teal, ...S.serif, fontSize: 18 }}>💉 Dosage Information</h4>
            <p style={{ color: T.text, lineHeight: 1.7 }}>{product.dosage}</p>
          </div>
          <div style={{ ...S.card, borderLeft: `4px solid ${T.coral}` }}>
            <h4 style={{ marginBottom: 10, color: T.coral, ...S.serif, fontSize: 18 }}>⚠️ Treatment Guidelines & Safety</h4>
            <p style={{ color: T.text, lineHeight: 1.7 }}>{product.treatmentGuidelines}</p>
          </div>
        </div>
      )}

      {tab === 'Commission Config' && (
        <div style={S.card}>
          <h4 style={{ marginBottom: 20, ...S.serif, fontSize: 18, color: T.teal }}>Commission Split</h4>
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

      {tab === 'Sales' && (
        <div style={S.card}>
          <h4 style={{ marginBottom: 16, ...S.serif, fontSize: 18, color: T.teal }}>Sales of this Product</h4>
          {productSales.length === 0 ? <div style={{ color: T.muted, fontStyle: 'italic', padding: 16 }}>No sales recorded yet.</div> : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
                <thead><tr style={{ borderBottom: `2px solid ${T.border}` }}>
                  {['Client', 'Date', 'Rep', 'Amount', 'Status'].map(h => <th key={h} style={{ textAlign: 'left', padding: '8px 10px', fontSize: 12, color: T.muted, fontWeight: 500 }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {productSales.map(sale => {
                    const lead = leads.find(l => l.id === sale.leadId)
                    const rep = team.find(t => t.id === sale.repId)
                    return (
                      <tr key={sale.id} style={{ borderBottom: `1px solid ${T.border}` }}>
                        <td style={{ padding: '10px' }}>{lead ? <Link onClick={() => navigate({ type: 'lead', id: lead.id })}>{lead.name}</Link> : '—'}</td>
                        <td style={{ padding: '10px', color: T.muted, fontSize: 13 }}>{sale.date}</td>
                        <td style={{ padding: '10px' }}>{rep ? <Link onClick={() => navigate({ type: 'person', id: rep.id })} color={personColor(rep)}>{rep.name.split(' ')[0]}</Link> : '—'}</td>
                        <td style={{ padding: '10px', fontWeight: 600, color: T.teal }}>${sale.amount.toLocaleString()}</td>
                        <td style={{ padding: '10px' }}><Badge label={sale.status} color={sale.status === 'Paid' ? '#059669' : '#d97706'} bg={sale.status === 'Paid' ? '#d1fae5' : '#fef3c7'} /></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'Purchase Orders' && (
        <div style={S.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h4 style={{ ...S.serif, fontSize: 18, color: T.teal }}>Purchase Orders</h4>
            <button onClick={() => setShowPOForm(true)} style={{ ...S.btn, ...S.btnPrimary, fontSize: 12 }}>+ New PO</button>
          </div>
          {product.purchaseOrders.length === 0 ? <div style={{ color: T.muted, fontStyle: 'italic', textAlign: 'center', padding: 24 }}>No purchase orders yet.</div> : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
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
            </div>
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
          <h4 style={{ marginBottom: 16, ...S.serif, fontSize: 18, color: T.teal }}>Supplier Information</h4>
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
function Products({ products, navigate }) {
  const statusColors = { Active: [T.teal, T.tealLight], 'Out of Stock': [T.coral, T.coralLight], Discontinued: [T.muted, '#f3f4f6'] }
  return (
    <div style={{ flex: 1, overflow: 'auto', padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ ...S.serif, fontSize: 32, fontWeight: 600 }}>Products &amp; Services</h1>
        <button style={{ ...S.btn, ...S.btnPrimary }}>+ Add Product</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {products.map(p => {
          const margin = ((p.price - p.cost) / p.price * 100).toFixed(0)
          const [sc, sbg] = statusColors[p.status] || [T.muted, '#f3f4f6']
          return (
            <div key={p.id} onClick={() => navigate({ type: 'product', id: p.id })} style={{ ...S.card, cursor: 'pointer', transition: 'box-shadow .15s' }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(27,107,114,.2)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = S.card.boxShadow)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <Badge label={p.status} color={sc} bg={sbg} />
                <Badge label={p.category} color={T.muted} bg='#f3f4f6' />
              </div>
              <h3 style={{ ...S.serif, fontSize: 20, fontWeight: 600, marginBottom: 8, color: T.text }}>{p.name}</h3>
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

// ─── Person Detail (Doctor / Rep profile) ─────────────────────────────────────
function PersonDetail({ person, navigate, goBack, sales, leads, products }) {
  const isDoctor = person.role === 'Doctor'
  const personSales = sales.filter(s => (isDoctor ? s.doctorId : s.repId) === person.id)
  const totalRevenue = personSales.reduce((s, x) => s + x.amount, 0)
  const totalCommission = personSales.reduce((s, x) => s + commissionFor(x, products.find(p => p.id === x.productId), isDoctor ? 'doctor' : 'rep'), 0)
  const myLeads = leads.filter(l => (isDoctor ? l.doctor : l.assignedTo) === person.id)
  const color = personColor(person)

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: 28 }}>
      <button onClick={goBack} style={{ ...S.btn, ...S.btnGhost, marginBottom: 20 }}>← Back</button>
      <div style={{ ...S.card, marginBottom: 20, display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
        <Avatar initials={person.avatar || initialsOf(person.name)} size={60} color={color} />
        <div style={{ flex: 1, minWidth: 200 }}>
          <h2 style={{ ...S.serif, fontSize: 28, fontWeight: 600 }}>{person.name}</h2>
          <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <Badge label={person.role} color={color} bg={color + '18'} />
            <Badge label={person.status} color={person.status === 'Active' ? '#059669' : T.muted} bg={person.status === 'Active' ? '#d1fae5' : '#f3f4f6'} />
            <span style={{ fontSize: 13, color: T.muted }}>{person.email} · {person.phone}</span>
          </div>
          {person.bio && <p style={{ marginTop: 10, color: T.text, lineHeight: 1.6, fontSize: 14 }}>{person.bio}</p>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 20 }}>
        {[['Clients', myLeads.length], ['Sales', personSales.length], ['Revenue Generated', `$${totalRevenue.toLocaleString()}`], [isDoctor ? 'Doctor Commission' : 'Rep Commission', `$${totalCommission.toLocaleString()}`]].map(([l, v]) => (
          <div key={l} style={{ ...S.card, textAlign: 'center' }}>
            <div style={{ ...S.serif, fontSize: 28, fontWeight: 700, color }}>{v}</div>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={S.card}>
          <h4 style={{ marginBottom: 14, ...S.serif, fontSize: 18, color: T.teal }}>{isDoctor ? 'Patients' : 'Clients'}</h4>
          {myLeads.length === 0 ? <div style={{ color: T.muted, fontStyle: 'italic' }}>None assigned.</div> : myLeads.map(l => (
            <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${T.border}` }}>
              <div>
                <Link onClick={() => navigate({ type: 'lead', id: l.id })}>{l.name}</Link>
                <div style={{ fontSize: 12, color: T.muted }}>{l.stage}</div>
              </div>
              <span style={{ fontWeight: 600, color: T.teal }}>${l.purchaseTotal.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div style={S.card}>
          <h4 style={{ marginBottom: 14, ...S.serif, fontSize: 18, color: T.teal }}>Sales & Commissions</h4>
          {personSales.length === 0 ? <div style={{ color: T.muted, fontStyle: 'italic' }}>No sales recorded.</div> : personSales.map(sale => {
            const product = products.find(p => p.id === sale.productId)
            const lead = leads.find(l => l.id === sale.leadId)
            const comm = commissionFor(sale, product, isDoctor ? 'doctor' : 'rep')
            return (
              <div key={sale.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${T.border}` }}>
                <div>
                  <div>{product ? <Link onClick={() => navigate({ type: 'product', id: product.id })}>{product.name}</Link> : '—'}</div>
                  <div style={{ fontSize: 12, color: T.muted }}>{lead ? <Link onClick={() => navigate({ type: 'lead', id: lead.id })} color={T.muted} bold={false}>{lead.name}</Link> : ''} · {sale.date}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 600, color: T.teal }}>${sale.amount.toLocaleString()}</div>
                  <div style={{ fontSize: 12, color: color }}>+${comm.toLocaleString()} comm.</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Reports ──────────────────────────────────────────────────────────────────
function Reports({ leads, navigate }) {
  const totalRevenue = leads.reduce((s, l) => s + l.purchaseTotal, 0)
  const wonLeads = leads.filter(l => l.stage === 'Closed Won')
  const activeClients = leads.filter(l => !['Closed Lost', 'New Lead'].includes(l.stage))
  const avgDeal = wonLeads.length ? Math.round(wonLeads.reduce((s, l) => s + l.purchaseTotal, 0) / wonLeads.length) : 0
  const convRate = leads.length ? ((wonLeads.length / leads.length) * 100).toFixed(0) : 0

  const stageData = STAGES.map(s => ({ stage: s, count: leads.filter(l => l.stage === s).length, revenue: leads.filter(l => l.stage === s).reduce((sum, l) => sum + l.purchaseTotal, 0) }))
  const maxCount = Math.max(...stageData.map(d => d.count), 1)

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: 28 }}>
      <h1 style={{ ...S.serif, fontSize: 32, fontWeight: 600, marginBottom: 24 }}>Reports &amp; Analytics</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[['Total Revenue', `$${totalRevenue.toLocaleString()}`, '💰', T.teal], ['Active Clients', activeClients.length, '👥', T.tealMid], ['Avg Deal Size', `$${avgDeal.toLocaleString()}`, '📊', T.coral], ['Conv. Rate', `${convRate}%`, '🎯', '#7c3aed']].map(([label, val, icon, color]) => (
          <div key={label} style={{ ...S.card, textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
            <div style={{ ...S.serif, fontSize: 32, fontWeight: 700, color }}>{val}</div>
            <div style={{ fontSize: 13, color: T.muted, marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        <div style={S.card}>
          <h4 style={{ marginBottom: 16, ...S.serif, fontSize: 18, color: T.teal }}>Pipeline by Stage</h4>
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
          <h4 style={{ marginBottom: 16, ...S.serif, fontSize: 18, color: T.teal }}>Top Clients by Value</h4>
          {[...leads].sort((a, b) => b.purchaseTotal - a.purchaseTotal).slice(0, 5).map((lead, i) => (
            <div key={lead.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: T.tealLight, color: T.teal, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12 }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <Link onClick={() => navigate({ type: 'lead', id: lead.id })}>{lead.name}</Link>
                <div style={{ fontSize: 12, color: T.muted }}>{lead.stage}</div>
              </div>
              <div style={{ fontWeight: 700, color: T.teal }}>${lead.purchaseTotal.toLocaleString()}</div>
            </div>
          ))}
        </div>

        <div style={S.card}>
          <h4 style={{ marginBottom: 16, ...S.serif, fontSize: 18, color: T.teal }}>Monthly Revenue Trend</h4>
          {[['Jan', 8200], ['Feb', 12400], ['Mar', 9800], ['Apr', 15600], ['May', 11200]].map(([month, val]) => (
            <div key={month} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <span style={{ width: 36, fontSize: 12, color: T.muted }}>{month}</span>
              <div style={{ flex: 1, height: 20, background: T.tealLight, borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(val / 16000) * 100}%`, background: T.teal, borderRadius: 4 }} />
              </div>
              <span style={{ width: 60, fontSize: 12, fontWeight: 600, color: T.teal, textAlign: 'right' }}>${(val / 1000).toFixed(1)}k</span>
            </div>
          ))}
        </div>

        <div style={S.card}>
          <h4 style={{ marginBottom: 16, ...S.serif, fontSize: 18, color: T.teal }}>Torus Assessment Summary</h4>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ ...S.serif, fontSize: 36, fontWeight: 700, color: T.teal }}>{leads.filter(l => l.score).length}</div>
              <div style={{ fontSize: 12, color: T.muted }}>Assessments Done</div>
            </div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ ...S.serif, fontSize: 36, fontWeight: 700, color: T.coral }}>
                {leads.filter(l => l.bioAge).length ? Math.round(leads.filter(l => l.bioAge).reduce((s, l) => s + l.bioAge, 0) / leads.filter(l => l.bioAge).length) : '—'}
              </div>
              <div style={{ fontSize: 12, color: T.muted }}>Avg BioAge</div>
            </div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ ...S.serif, fontSize: 36, fontWeight: 700, color: T.tealMid }}>
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
function Team({ team, setTeam, navigate }) {
  const [showAdd, setShowAdd] = useState(false)
  const [newMember, setNewMember] = useState({ name: '', role: 'Sales Rep', email: '', phone: '', status: 'Active' })

  function addMember() {
    setTeam(prev => [...prev, { id: Date.now(), ...newMember, clients: 0, revenue: 0, joinDate: new Date().toISOString().slice(0, 10), avatar: initialsOf(newMember.name), bio: '' }])
    setShowAdd(false)
    setNewMember({ name: '', role: 'Sales Rep', email: '', phone: '', status: 'Active' })
  }

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ ...S.serif, fontSize: 32, fontWeight: 600 }}>Team Management</h1>
        <button onClick={() => setShowAdd(true)} style={{ ...S.btn, ...S.btnPrimary }}>+ Add Member</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {team.map(m => {
          const color = personColor(m)
          return (
            <div key={m.id} onClick={() => navigate({ type: 'person', id: m.id })} style={{ ...S.card, cursor: 'pointer', transition: 'box-shadow .15s' }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(27,107,114,.2)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = S.card.boxShadow)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <Avatar initials={m.avatar || initialsOf(m.name)} size={48} color={color} />
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
                <button onClick={e => { e.stopPropagation(); setTeam(prev => prev.map(t => t.id === m.id ? { ...t, status: t.status === 'Active' ? 'Inactive' : 'Active' } : t)) }} style={{ ...S.btn, background: m.status === 'Active' ? T.coralLight : T.tealLight, color: m.status === 'Active' ? T.coral : T.teal, flex: 1, fontSize: 12 }}>
                  {m.status === 'Active' ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={e => { e.stopPropagation(); navigate({ type: 'person', id: m.id }) }} style={{ ...S.btn, ...S.btnSecondary, flex: 1, fontSize: 12 }}>View Profile →</button>
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
      <h1 style={{ ...S.serif, fontSize: 32, fontWeight: 600, marginBottom: 8 }}>API &amp; HDT Integration</h1>
      <p style={{ color: T.muted, marginBottom: 24 }}>Connect external lead sources (HDT, web forms, partners) to VINOVA Clinic OS via webhook.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 24 }}>
        <div style={S.card}>
          <h4 style={{ marginBottom: 12, color: T.teal, ...S.serif, fontSize: 18 }}>Webhook Endpoint</h4>
          <div style={{ background: T.bg, borderRadius: 8, padding: 12, fontFamily: 'monospace', fontSize: 13, color: T.text, marginBottom: 12 }}>
            POST https://vinovacr.com/api/leads/ingest
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
          <h4 style={{ marginBottom: 12, color: T.teal, ...S.serif, fontSize: 18 }}>Torus Score Sync</h4>
          <div style={{ background: T.bg, borderRadius: 8, padding: 12, fontFamily: 'monospace', fontSize: 13, color: T.text, marginBottom: 12 }}>
            POST https://vinovacr.com/api/torus/sync
          </div>
          <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6 }}>Receives Torus assessment results and automatically updates the client's BioAge, score, and biomarker breakdown in Clinic OS.</p>
          <div style={{ marginTop: 12 }}>
            <Badge label="Torus Health Inc. Partner" color={T.teal} />
          </div>
        </div>
      </div>

      <div style={S.card}>
        <h4 style={{ marginBottom: 12, color: T.teal, ...S.serif, fontSize: 18 }}>Request Payload (HDT Lead)</h4>
        <pre style={{ background: T.bg, borderRadius: 8, padding: 16, fontSize: 13, overflowX: 'auto', color: T.text, lineHeight: 1.6 }}>{samplePayload}</pre>
        <div style={{ marginTop: 16, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
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
  const [leads, setLeads] = useState(LEADS_SEED)
  const [products, setProducts] = useState(PRODUCTS_SEED)
  const [team, setTeam] = useState(TEAM_SEED)
  const [sales] = useState(SALES_SEED)
  const [documents] = useState(DOCUMENTS_SEED)
  const [timeline, setTimeline] = useState(TIMELINE_SEED)

  // Navigation stack — enables drill-down + Back from anywhere.
  const [stack, setStack] = useState([{ type: 'pipeline' }])
  const view = stack[stack.length - 1]
  const navigate = v => setStack(s => [...s, v])
  const goBack = () => setStack(s => (s.length > 1 ? s.slice(0, -1) : s))
  const setRoot = v => setStack([v])

  if (!user) return <LoginScreen onLogin={setUser} />

  const sidebarKey = ['lead'].includes(view.type) ? 'pipeline' : ['product'].includes(view.type) ? 'products' : ['person'].includes(view.type) ? 'team' : view.type

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: T.bg }}>
      <Sidebar current={sidebarKey} onChange={key => setRoot({ type: key })} user={user} onLogout={() => { setUser(null); setRoot({ type: 'pipeline' }) }} />

      {view.type === 'pipeline' && <Pipeline leads={leads} setLeads={setLeads} navigate={navigate} team={team} />}

      {view.type === 'lead' && (() => {
        const lead = leads.find(l => l.id === view.id)
        return lead ? <LeadDetail lead={lead} navigate={navigate} goBack={goBack} leads={leads} setLeads={setLeads} products={products} team={team} sales={sales} documents={documents} timeline={timeline} setTimeline={setTimeline} initialTab={view.tab} /> : null
      })()}

      {view.type === 'products' && <Products products={products} navigate={navigate} />}

      {view.type === 'product' && (() => {
        const product = products.find(p => p.id === view.id)
        return product ? <ProductDetail product={product} navigate={navigate} goBack={goBack} setProducts={setProducts} sales={sales} leads={leads} team={team} /> : null
      })()}

      {view.type === 'person' && (() => {
        const person = team.find(p => p.id === view.id)
        return person ? <PersonDetail person={person} navigate={navigate} goBack={goBack} sales={sales} leads={leads} products={products} /> : null
      })()}

      {view.type === 'reports' && <Reports leads={leads} navigate={navigate} />}
      {view.type === 'team' && <Team team={team} setTeam={setTeam} navigate={navigate} />}
      {view.type === 'api' && <ApiDocs />}
    </div>
  )
}
