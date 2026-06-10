import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const invoices = await prisma.invoice.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(invoices);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const client = body.client as string;
  const amount = Number(body.amount);
  const due = body.due as string;

  if (!client || !amount) {
    return NextResponse.json({ error: "Client and amount required" }, { status: 400 });
  }

  const count = await prisma.invoice.count({ where: { userId: session.user.id } });
  const initials = client.split(" ").map((p: string) => p[0]).join("").slice(0, 2).toUpperCase();

  const invoice = await prisma.invoice.create({
    data: {
      number: `INV-0${250 + count}`,
      client,
      initials,
      issued: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      due,
      amount,
      status: "Draft",
      color: "#2f6d62",
      userId: session.user.id,
    },
  });

  return NextResponse.json(invoice, { status: 201 });
}
