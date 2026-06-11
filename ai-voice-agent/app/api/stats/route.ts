import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const [
    totalProspects,
    activeSequences,
    wonProspects,
    activeClients,
    totalCalls,
    monthlyRevenue,
    videosSent,
  ] = await Promise.all([
    prisma.prospect.count(),
    prisma.outreachSequence.count({ where: { status: "active" } }),
    prisma.prospect.count({ where: { status: "won" } }),
    prisma.client.count({ where: { status: "active" } }),
    prisma.agentCall.count(),
    prisma.client.aggregate({
      _sum: { monthlyFee: true },
      where: { status: "active" },
    }),
    prisma.loomVideo.count({ where: { status: "sent" } }),
  ]);

  const touchesSent = await prisma.outreachTouch.count({ where: { status: { not: "pending" } } });
  const touchesReplied = await prisma.outreachTouch.count({ where: { status: "replied" } });
  const replyRate = touchesSent > 0 ? Math.round((touchesReplied / touchesSent) * 100) : 0;

  return NextResponse.json({
    totalProspects,
    activeSequences,
    wonProspects,
    activeClients,
    totalCalls,
    monthlyRevenue: monthlyRevenue._sum.monthlyFee ?? 0,
    videosSent,
    replyRate,
    conversionRate: totalProspects > 0 ? Math.round((wonProspects / totalProspects) * 100) : 0,
  });
}
