import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const clients = await prisma.client.findMany({
    include: { agent: { include: { _count: { select: { calls: true } } } }, prospect: true },
    orderBy: { onboardedAt: "desc" },
  });
  return NextResponse.json(clients);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const client = await prisma.client.create({ data: body });

  if (body.prospectId) {
    await prisma.prospect.update({
      where: { id: body.prospectId },
      data: { status: "won" },
    });
  }

  return NextResponse.json(client, { status: 201 });
}
