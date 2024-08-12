import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.upsert({
    where: { email: 'u1@mail.ru'},
    update: {},
    create: {
      email: 'u1@mail.ru',
      password: '123',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'u2@mail.ru' },
    update: {},
    create: {
      email: 'u2@mail.ru',
      password: '123',
    },
  });

  const pr1 = await prisma.project.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Kanban',
      description: 'My first project',
      userId: 1,
    },
  });

  const pr2 = await prisma.project.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: "Nestjs",
      description: 'Framework',
      userId:  2,
    },
  });

    // create two dummy articles
  const c1 = await prisma.column.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        name: 'todo',
        position: 1,
        projectId: 1,
      },
    });
    
  console.log({ user1, user2, pr1, pr2, c1 });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });