import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSystemPrompt } from "@/lib/utils";

export async function POST() {
  const count = await prisma.prospect.count();
  if (count > 0) return NextResponse.json({ message: "Already seeded" });

  const prospects = await prisma.prospect.createMany({
    data: [
      { businessName: "Mike's Plumbing & Drain", ownerName: "Mike Torres", phone: "8085551234", email: "mike@mikesplumbing.com", city: "Honolulu, HI", vertical: "Plumber", rating: 4.1, reviewCount: 38, reviewSnippet: "Great work but really hard to reach. Called twice before someone answered.", painSignals: "hard to reach,no answer", status: "new" },
      { businessName: "Aloha Electric LLC", ownerName: "Dave Kim", phone: "8085552345", email: null, city: "Kailua, HI", vertical: "Electrician", rating: 3.9, reviewCount: 22, reviewSnippet: "Went to voicemail 3 times before I got through. Good work once scheduled.", painSignals: "voicemail,no answer,hard to schedule", status: "contacted" },
      { businessName: "Pacific HVAC Services", ownerName: "Sarah Nakamura", phone: "8085553456", email: "sarah@pacifichvac.com", city: "Pearl City, HI", vertical: "HVAC", rating: 4.3, reviewCount: 61, reviewSnippet: "Excellent service but the phone line is always busy during evenings.", painSignals: "busy,no evening hours", status: "demo_sent" },
      { businessName: "Island Locksmith Pro", ownerName: "Tom Reyes", phone: "8085554567", email: null, city: "Aiea, HI", vertical: "Locksmith", rating: 3.7, reviewCount: 15, reviewSnippet: "Called multiple times, no answer. Finally texted and got a response the next day.", painSignals: "no answer,slow response,called multiple times", status: "new" },
      { businessName: "Oahu Roofing Co", ownerName: "Chris Yamamoto", phone: "8085555678", email: "chris@oahuroofing.com", city: "Kaneohe, HI", vertical: "Roofer", rating: 4.0, reviewCount: 44, reviewSnippet: "Really responsive once you get them, but the first call went to voicemail.", painSignals: "voicemail,first call missed", status: "interested" },
      { businessName: "Fast Fix Plumbing", ownerName: "Luis Mendez", phone: "8085556789", email: null, city: "Mililani, HI", vertical: "Plumber", rating: 3.8, reviewCount: 29, reviewSnippet: "Hard to get through on the phone. Ended up calling a competitor first.", painSignals: "hard to reach,called competitor", status: "new" },
      { businessName: "Bright Spark Electric", ownerName: "Amy Chen", phone: "8085557890", email: "amy@brightsparkhi.com", city: "Ewa Beach, HI", vertical: "Electrician", rating: 4.5, reviewCount: 88, reviewSnippet: "Professional team. Sometimes calls go to voicemail after hours.", painSignals: "after hours voicemail", status: "won" },
      { businessName: "Cool Breeze HVAC", ownerName: "Ray Santos", phone: "8085558901", email: null, city: "Waipahu, HI", vertical: "HVAC", rating: 3.6, reviewCount: 18, reviewSnippet: "Good prices but I had to call back 4 times before anyone answered.", painSignals: "called back,no answer,4 times", status: "no_reply" },
    ],
  });

  const allProspects = await prisma.prospect.findMany({ orderBy: { createdAt: "asc" } });

  // Create a demo agent
  const agent1 = await prisma.vapiAgent.create({
    data: {
      name: "Bright Spark Electric Agent",
      businessName: "Bright Spark Electric",
      businessPhone: "8085557890",
      transferPhone: "8085557891",
      voiceId: "adam",
      status: "active",
      vapiPhoneNumber: "+18085550001",
      systemPrompt: generateSystemPrompt("Bright Spark Electric", "8085557891"),
      calls: {
        create: [
          { callerName: "John Doe", callerPhone: "8085559001", callType: "emergency", duration: 94, summary: "Power outage, transferred to owner immediately.", outcome: "transferred" },
          { callerName: "Linda Park", callerPhone: "8085559002", callType: "booking", duration: 127, summary: "Scheduled panel inspection for Thursday 2pm.", outcome: "booked" },
          { callerName: "Robert Walsh", callerPhone: "8085559003", callType: "standard", duration: 68, summary: "Asked about outlet repair, booked for Friday morning.", outcome: "booked" },
        ],
      },
    },
  });

  // Convert one prospect to client
  await prisma.client.create({
    data: {
      prospectId: allProspects.find((p) => p.status === "won")?.id,
      agentId: agent1.id,
      businessName: "Bright Spark Electric",
      ownerName: "Amy Chen",
      phone: "8085557890",
      email: "amy@brightsparkhi.com",
      vertical: "Electrician",
      city: "Ewa Beach, HI",
      setupFee: 497,
      monthlyFee: 297,
      emergencyAddon: true,
      status: "active",
      callForwardingSet: true,
    },
  });

  // Create a draft agent
  await prisma.vapiAgent.create({
    data: {
      name: "Pacific HVAC Demo",
      businessName: "Pacific HVAC Services",
      businessPhone: "8085553456",
      transferPhone: "8085553457",
      voiceId: "rachel",
      status: "draft",
      systemPrompt: generateSystemPrompt("Pacific HVAC Services", "8085553457"),
    },
  });

  // Create sequence for contacted prospect
  const contacted = allProspects.find((p) => p.status === "contacted");
  if (contacted) {
    await prisma.outreachSequence.create({
      data: {
        prospectId: contacted.id,
        status: "active",
        currentStep: 1,
        touches: {
          create: [
            { day: 1, channel: "gbm", status: "sent", sentAt: new Date(Date.now() - 2 * 86400000), videoUrl: "https://loom.com/share/demo123", content: "Hi Dave — I called your number today and it went to voicemail. I recorded exactly what happened and what should happen instead." },
            { day: 1, channel: "email", status: "sent", sentAt: new Date(Date.now() - 2 * 86400000), subject: "I called you today...", content: "Hi Dave — quick 3-minute video showing what a missed call is costing you." },
            { day: 3, channel: "email", status: "pending" },
            { day: 6, channel: "sms", status: "pending" },
            { day: 6, channel: "voicemail", status: "pending" },
            { day: 10, channel: "email", status: "pending" },
          ],
        },
      },
    });
  }

  // Create Loom videos
  await prisma.loomVideo.createMany({
    data: [
      { title: "Dave Kim — Aloha Electric missed call demo", prospectId: contacted?.id, loomUrl: "https://loom.com/share/demo123", status: "sent", viewCount: 2, duration: 162 },
      { title: "Pacific HVAC — Sarah Nakamura demo", prospectId: allProspects.find((p) => p.status === "demo_sent")?.id, loomUrl: "https://loom.com/share/demo456", status: "sent", viewCount: 1, duration: 148 },
      { title: "Master Template — Plumber vertical", loomUrl: null, status: "draft", viewCount: 0, duration: null },
    ],
  });

  return NextResponse.json({ message: "Seeded successfully", prospects: prospects.count });
}
