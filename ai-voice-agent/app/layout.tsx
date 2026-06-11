import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "AIVoice Agent — B2B Outreach System",
  description: "AI Voice Agent outreach system for service trade contractors",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Sidebar />
        <main style={{ marginLeft: 220, minHeight: "100vh", padding: "2rem" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
