import { PrismaClient } from "./generated/prisma";

const prisma = new PrismaClient()

async function main() {
    await prisma.user.create({
        data:{
            name: 'Aman Tandon',
            email: 'amanfortechstuff@gmail.com',
            posts:  { 
                create: {
                title: "My first Post is here",
                content: "Some random stuff about first post which brings up some change and here and there thift store"
            }},
            profile: {
                create: {
                    bio: 'I like dogs'
                }
            }
        }
    })
    const allUsers = await prisma.user.findMany({
        include: {
            posts: true,
            profile: true
        },
    })
    console.dir(allUsers, { depth: null });
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