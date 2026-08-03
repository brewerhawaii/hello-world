"use client";
import { useState } from "react";

const TOOL_SECTIONS = [
  {
    title: "Phase 1 — Lead Sourcing",
    tools: [
      { name: "Outscraper", url: "https://outscraper.com", desc: "Scrape Google Maps listings with reviews, ratings, phone numbers. Filter by category + city.", cost: "~$0.01/result" },
      { name: "Apify", url: "https://apify.com", desc: "Alternative scraper. Use the 'Google Maps Scraper' actor. Better for bulk pulls.", cost: "Pay-per-use" },
      { name: "Google Sheets", url: "https://sheets.google.com", desc: "Store your prospect list. Columns: Name, Phone, City, Vertical, Pain Signal, Status.", cost: "Free" },
    ],
  },
  {
    title: "Phase 2 — AI Voice Agent",
    tools: [
      { name: "Vapi.ai", url: "https://vapi.ai", desc: "Core AI voice agent platform. Create assistants, provision phone numbers, set up call routing and webhooks.", cost: "~$0.07/min" },
      { name: "ElevenLabs", url: "https://elevenlabs.io", desc: "Realistic voice synthesis. Use 'Adam' or 'Rachel' for warm, professional calls.", cost: "Free tier / $5/mo" },
      { name: "Twilio", url: "https://twilio.com", desc: "Phone number provisioning. Can be used alongside or instead of Vapi's built-in numbers.", cost: "$1/mo per number" },
    ],
  },
  {
    title: "Phase 3 — Proof Video",
    tools: [
      { name: "Loom", url: "https://loom.com", desc: "Record screen + face cam. Track when prospects open videos. Free tier works fine to start.", cost: "Free / $12.50/mo" },
    ],
  },
  {
    title: "Phase 4 — Outreach",
    tools: [
      { name: "GoHighLevel (GHL)", url: "https://gohighlevel.com", desc: "All-in-one CRM, email, SMS, and pipeline management. Recommended for managing sequences at scale.", cost: "$97/mo" },
      { name: "Instantly.ai", url: "https://instantly.ai", desc: "Cold email tool with deliverability warmup. Good alternative if not using GHL.", cost: "$37/mo" },
      { name: "Slybroadcast", url: "https://slybroadcast.com", desc: "Ringless voicemail drops. Use for Day 6 voicemail touch. ~$0.05 per drop.", cost: "Pay-per-use" },
      { name: "SimpleTexting", url: "https://simpletexting.com", desc: "Business SMS. Use for Day 6 SMS touch. Only send to warm leads to stay TCPA compliant.", cost: "$29/mo" },
    ],
  },
  {
    title: "Phase 5 — Fulfillment",
    tools: [
      { name: "Typeform", url: "https://typeform.com", desc: "Client intake form. Collect: business name, phones, available appointment windows, emergency protocols.", cost: "Free tier" },
      { name: "Zapier", url: "https://zapier.com", desc: "Connect Vapi webhooks → email/SMS notifications. Fire 'new lead' alerts per call.", cost: "Free tier / $20/mo" },
      { name: "Stripe", url: "https://stripe.com", desc: "Collect setup fee and recurring monthly payments. Set up recurring billing immediately.", cost: "2.9% + $0.30" },
    ],
  },
];

const TIPS = [
  { icon: "🚨", title: "Call Forwarding — Do It Live", body: "Never send forwarding instructions via email. Get on a screen share and do it together. This is your #1 churn risk." },
  { icon: "🎙", title: "Test Your Demo Voice First", body: "Before recording your Loom, test at least 3 ElevenLabs voices. The demo must sound premium — not robotic. Record a 30-second test call." },
  { icon: "⚡", title: "Validate Before Scaling", body: "Send 10 Looms before building any automation. 72 hours of data on open/reply rate tells you if the video converts. Don't scale a broken funnel." },
  { icon: "📱", title: "Day 1: GBM + Email Together", body: "Google Business Message and email on the same day. GBM has ~60% open rate vs 30% for email. If they're not on GBM, double-down on email." },
  { icon: "💰", title: "Collect Setup Fee Upfront", body: "Get the $497 before you do any config work. Use Stripe. The moment they pay, they're invested. Before that, they can ghost you." },
  { icon: "🔁", title: "Clone Agents in 10 Minutes", body: "Your master agent template should be ready before your first sale. Duplicate the Vapi assistant, change the business name and transfer number. That's it." },
];

export default function SettingsPage() {
  const [apiKeys, setApiKeys] = useState({ vapi: "", elevenlabs: "", twilio: "", sendgrid: "" });
  const [saved, setSaved] = useState(false);

  async function saveKeys() {
    // In a real deployment, these would be saved server-side as encrypted settings
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="page-title">Settings & Tool Stack</h1>
        <p className="page-sub">API keys, integrations, and the complete tech stack reference.</p>
      </div>

      {/* API Keys */}
      <div className="card p-5 mb-6">
        <div className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "var(--cyan)" }}>
          API Configuration
        </div>
        <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
          {[
            { key: "vapi" as const, label: "Vapi API Key", placeholder: "vapi_..." },
            { key: "elevenlabs" as const, label: "ElevenLabs API Key", placeholder: "sk_..." },
            { key: "twilio" as const, label: "Twilio Account SID", placeholder: "AC..." },
            { key: "sendgrid" as const, label: "SendGrid API Key", placeholder: "SG...." },
          ].map(({ key, label, placeholder }) => (
            <div key={key} className="form-group">
              <label className="form-label">{label}</label>
              <input
                className="input"
                type="password"
                value={apiKeys[key]}
                onChange={(e) => setApiKeys({ ...apiKeys, [key]: e.target.value })}
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button className="btn btn-primary" onClick={saveKeys}>
            {saved ? "✓ Saved" : "Save API Keys"}
          </button>
        </div>
        <p className="text-xs mt-2" style={{ color: "var(--slate2)" }}>
          Note: In production, set these as environment variables (VAPI_API_KEY, ELEVENLABS_API_KEY, etc.) not in the UI.
        </p>
      </div>

      {/* Tool stack */}
      <div className="mb-6">
        <div className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "var(--slate2)" }}>
          Full Tool Stack by Phase
        </div>
        <div className="flex flex-col gap-5">
          {TOOL_SECTIONS.map((section) => (
            <div key={section.title}>
              <div className="text-sm font-bold mb-3" style={{ fontFamily: "Syne, sans-serif", color: "var(--white)" }}>
                {section.title}
              </div>
              <div className="grid gap-2">
                {section.tools.map((tool) => (
                  <div key={tool.name} className="card p-3 flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-semibold text-sm">{tool.name}</span>
                        <span className="badge badge-slate text-xs">{tool.cost}</span>
                      </div>
                      <p className="text-xs" style={{ color: "var(--slate)" }}>{tool.desc}</p>
                    </div>
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost btn-sm flex-shrink-0"
                    >
                      Open →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pro tips */}
      <div>
        <div className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "var(--slate2)" }}>
          Execution Tips
        </div>
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {TIPS.map((tip) => (
            <div key={tip.title} className="card p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{tip.icon}</span>
                <span className="font-semibold text-sm" style={{ fontFamily: "Syne, sans-serif" }}>{tip.title}</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--slate)" }}>{tip.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cost model */}
      <div className="card p-5 mt-6" style={{ background: "rgba(0,212,255,0.03)", borderColor: "rgba(0,212,255,0.15)" }}>
        <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "var(--cyan)" }}>
          Monthly Cost Model (at 5 active clients)
        </div>
        <div className="flex flex-col gap-1.5 text-sm">
          {[
            ["Vapi.ai (500 min/mo × $0.07)", "$35"],
            ["ElevenLabs (Pro plan)", "$22"],
            ["Loom (Business)", "$15"],
            ["GoHighLevel", "$97"],
            ["Twilio numbers (5)", "$5"],
            ["Misc (zapier, etc.)", "$20"],
          ].map(([label, cost]) => (
            <div key={label} className="flex justify-between">
              <span style={{ color: "var(--slate)" }}>{label}</span>
              <span className="font-medium">{cost}</span>
            </div>
          ))}
          <div className="divider my-1" />
          <div className="flex justify-between font-bold">
            <span>Total costs</span>
            <span>~$194/mo</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Revenue (5 × $394)</span>
            <span style={{ color: "var(--cyan)" }}>$1,970/mo</span>
          </div>
          <div className="flex justify-between font-bold">
            <span style={{ color: "var(--green)" }}>Net profit margin</span>
            <span style={{ color: "var(--green)" }}>~90%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
