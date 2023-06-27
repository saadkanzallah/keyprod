import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma  = new PrismaClient();
const roles = ['ADMIN', 'AGENT', 'USER'];
const productCount = 10;
const OrderCount = 5;
const fakerUser = (role: string): any => ({
    email: role.toLowerCase() + '@keyprod.fr',
    password: 'XXXXXX', // TODO : hash password
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    role
});

const fakerProduct = (orderId: string = null): any => ({
    category: faker.helpers.arrayElement(['KEYNETIC', 'KEYVIBE']),
    version: 'V' + faker.number.int({ min: 1, max: 9 }),
    code: faker.string.alphanumeric({casing: 'upper', length: 6}),
    weight: faker.number.int({ min: 1, max: 100 }),
    orderId
});

const fakerOrder = (): any => ({
    client: faker.person.fullName() ,
    code: faker.string.alphanumeric({casing: 'upper', length: 6}),
});

const fakerProductsOrder = async (total: number, orderId: string): Promise<any> => {
    for (let i = 1; i <= total; i++) {
        console.log(`Seeding Product ${i} / Order ${orderId}...`);
        await prisma.product.create({ data: fakerProduct(orderId) });
    }
}
    
async function main() {
    console.log(`Clearing User table...`);
    await prisma.user.deleteMany();
    console.log(`Clearing Product table...`);
    await prisma.product.deleteMany();
    console.log(`Clearing Product table...`);
    await prisma.order.deleteMany();
    console.log(`Seeding Start...`);
    /// --------- Users ---------------
    console.log(`Seeding Users...`);
    roles.map(async (role) => {
        console.log(`Seeding ${role} User...`);
        await prisma.user.create({ data: fakerUser(role) });
    })

    /// --------- Products ---------------
    console.log(`Seeding ${productCount} Products...`);
    for (let i = 1; i <= productCount; i++) {
        console.log(`Seeding Product ${i}...`);
        await prisma.product.create({ data: fakerProduct() });
    }

    /// --------- Orders ---------------
    console.log(`Seeding ${OrderCount} Orders...`);
    for (let i = 1; i <= OrderCount; i++) {
        console.log(`Seeding Order ${i}...`);
        const newOrder = await prisma.order.create({ data: fakerOrder() });
        const totalOrder = faker.number.int({ min: 1, max: 9 });
        fakerProductsOrder(totalOrder, newOrder.id);
    }

    console.log(`Seeding End...`);
};
    
      
    
main()
.catch((e) => console.error(e))
.finally(async () => {
    await prisma.$disconnect();
});