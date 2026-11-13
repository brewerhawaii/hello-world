import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount);
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));
}

export function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export const VERTICALS = ["Plumber", "Electrician", "HVAC", "Locksmith", "Roofer", "Pest Control", "Landscaping", "Other"] as const;

export const STATUS_COLORS: Record<string, string> = {
  new: "badge-blue",
  contacted: "badge-cyan",
  demo_sent: "badge-purple",
  interested: "badge-yellow",
  won: "badge-green",
  lost: "badge-red",
  no_reply: "badge-slate",
  active: "badge-green",
  paused: "badge-yellow",
  completed: "badge-blue",
  onboarding: "badge-cyan",
  churned: "badge-red",
  draft: "badge-slate",
  error: "badge-red",
};

export const TOUCH_DAYS = [1, 3, 6, 10] as const;

export const TOUCH_CHANNELS: Record<number, string[]> = {
  1: ["gbm", "email"],
  3: ["email"],
  6: ["sms", "voicemail"],
  10: ["email"],
};

export function generateSystemPrompt(businessName: string, transferPhone: string): string {
  return `You are the virtual receptionist for ${businessName}.

Your job:
1. Greet the caller warmly using the business name
2. Capture: full name, callback number, reason for call
3. If EMERGENCY keywords detected (no water, burst pipe, no power, flooding, gas smell, locked out, no heat, no AC):
   → Say "This sounds urgent — let me connect you with someone right away."
   → Transfer to: ${transferPhone}
4. For standard service requests: offer 2–3 appointment windows, confirm booking, read back details
5. End every call: confirm what was captured, thank them, say goodbye warmly

IMPORTANT: Always sound warm, professional, and calm. Never say you're an AI unless directly asked. Never make up appointment times — only offer slots provided in your context.`;
}
