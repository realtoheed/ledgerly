import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const demoInvoices = [
  { number: "INV-0248", client: "Northstar Labs", initials: "NL", issued: "Jun 8, 2026", due: "Jun 22, 2026", amount: 4200, status: "Pending", color: "#2f6d62" },
  { number: "INV-0247", client: "Morrow Studio", initials: "MS", issued: "Jun 5, 2026", due: "Jun 5, 2026", amount: 1850, status: "Paid", color: "#886746" },
  { number: "INV-0246", client: "Fable & Co.", initials: "FC", issued: "May 29, 2026", due: "Jun 7, 2026", amount: 3200, status: "Overdue", color: "#9d514e" },
  { number: "INV-0245", client: "Kinship Coffee", initials: "KC", issued: "May 24, 2026", due: "Jun 14, 2026", amount: 975, status: "Pending", color: "#526c91" },
  { number: "INV-0244", client: "Onda Systems", initials: "OS", issued: "May 19, 2026", due: "May 19, 2026", amount: 5600, status: "Paid", color: "#68598a" },
];

async function main() {
  const password = await bcrypt.hash("demo1234", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@ledgerly.io" },
    update: {},
    create: { name: "Jordan Davis", email: "demo@ledgerly.io", password },
  });

  for (const invoice of demoInvoices) {
    await prisma.invoice.create({
      data: { ...invoice, userId: user.id },
    });
  }

  console.log("Seeded demo user (demo@ledgerly.io / demo1234) with 5 invoices.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
