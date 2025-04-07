import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      {
        firstName: "John",
        lastName: "Tool",
        email: "johntool@example.com",
        role: "ADMIN",
        token: uuidv4(),
      },
      {
        firstName: "Jill",
        lastName: "Connor",
        email: "jillconnor@example.com",
        role: "CLIENT",
        token: uuidv4(),
      },
      {
        firstName: "Kate",
        lastName: "Howl",
        email: "katehowl@example.com",
        role: "CLIENT",
        token: uuidv4(),
      },
    ],
  });

  await prisma.parkingSpot.createMany({
    data: [
      { name: "California" },
      { name: "Michigan" },
      { name: "Texas" },
      { name: "New Hampshire" },
      { name: "Arizona" },
      { name: "Georgia" },
      { name: "Hawaii" },
      { name: "Idaho" },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
