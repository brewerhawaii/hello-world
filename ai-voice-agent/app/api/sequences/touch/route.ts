import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  const { touchId, status, videoUrl, content } = await req.json();

  const touch = await prisma.outreachTouch.update({
    where: { id: touchId },
    data: {
      status,
      videoUrl,
      content,
      sentAt: status === "sent" ? new Date() : undefined,
    },
    include: { sequence: true },
  });

  if (status === "replied") {
    await prisma.outreachSequence.update({
      where: { id: touch.sequenceId },
      data: { status: "replied" },
    });
    await prisma.prospect.update({
      where: { id: touch.sequence.prospectId },
      data: { status: "interested" },
    });
  }

  return NextResponse.json(touch);
}
