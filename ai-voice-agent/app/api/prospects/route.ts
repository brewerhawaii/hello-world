import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const vertical = searchParams.get("vertical");
  const search = searchParams.get("search");

  const where: Record<string, unknown> = {};
  if (status && status !== "all") where.status = status;
  if (vertical && vertical !== "all") where.vertical = vertical;
  if (search) {
    where.OR = [
      { businessName: { contains: search } },
      { ownerName: { contains: search } },
      { city: { contains: search } },
      { phone: { contains: search } },
    ];
  }

  const prospects = await prisma.prospect.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { sequences: { orderBy: { startedAt: "desc" }, take: 1 }, _count: { select: { sequences: true } } },
  });

  return NextResponse.json(prospects);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const prospect = await prisma.prospect.create({ data: body });
  return NextResponse.json(prospect, { status: 201 });
}
