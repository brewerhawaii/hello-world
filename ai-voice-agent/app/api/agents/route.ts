import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSystemPrompt } from "@/lib/utils";

export async function GET() {
  const agents = await prisma.vapiAgent.findMany({
    include: { client: true, _count: { select: { calls: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(agents);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const systemPrompt = generateSystemPrompt(body.businessName, body.transferPhone);

  const agent = await prisma.vapiAgent.create({
    data: { ...body, systemPrompt },
  });

  return NextResponse.json(agent, { status: 201 });
}
