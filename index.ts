import { PrismaClient } from "./generated/prisma";

const prisma = new PrismaClient()

async function main() {
    const allUsers = await prisma.user.findMany()
    console.log("yo", allUsers);
}

main()
.then(async () => {
    await prisma.$disconnect()
})
.catch( async (e) => {
    console.error(e);

    await prisma.$disconnect()
    process.exit();
})