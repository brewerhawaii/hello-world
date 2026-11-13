import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TOUCH_DAYS, TOUCH_CHANNELS } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const where: Record<string, unknown> = {};
  if (status && status !== "all") where.status = status;

  const sequences = await prisma.outreachSequence.findMany({
    where,
    include: {
      prospect: true,
      touches: { orderBy: { day: "asc" } },
    },
    orderBy: { startedAt: "desc" },
  });

  return NextResponse.json(sequences);
}

export async function POST(req: NextRequest) {
  const { prospectId } = await req.json();

  const seq = await prisma.outreachSequence.create({
    data: {
      prospectId,
      touches: {
        create: TOUCH_DAYS.flatMap((day) =>
          (TOUCH_CHANNELS[day] ?? ["email"]).map((channel) => ({
            day,
            channel,
            status: "pending",
          }))
        ),
      },
    },
    include: { touches: true, prospect: true },
  });

  await prisma.prospect.update({
    where: { id: prospectId },
    data: { status: "contacted" },
  });

  return NextResponse.json(seq, { status: 201 });
}
