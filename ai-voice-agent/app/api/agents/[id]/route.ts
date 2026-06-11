import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSystemPrompt } from "@/lib/utils";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const agent = await prisma.vapiAgent.findUnique({
    where: { id },
    include: { calls: { orderBy: { createdAt: "desc" }, take: 20 }, client: true },
  });
  if (!agent) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(agent);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  if (body.businessName || body.transferPhone) {
    const current = await prisma.vapiAgent.findUnique({ where: { id } });
    body.systemPrompt = generateSystemPrompt(
      body.businessName ?? current!.businessName,
      body.transferPhone ?? current!.transferPhone
    );
  }
  const agent = await prisma.vapiAgent.update({ where: { id }, data: body });
  return NextResponse.json(agent);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.vapiAgent.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
