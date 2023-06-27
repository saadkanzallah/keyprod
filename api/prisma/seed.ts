import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma  = new PrismaClient();
const roles = ['ADMIN', 'AGENT', 'USER'];
const productCount = 10;
const orderCount = 5;
const parcelCount = 3;
const fakerUser = (role: string): any => ({
    email: role.toLowerCase() + '@keyprod.fr',
    password: 'XXXXXX', // TODO : hash password
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    role
});

const fakerProduct = (orderId: string = null, parcelId: string = null): any => ({
    category: faker.helpers.arrayElement(['KEYNETIC', 'KEYVIBE']),
    version: 'V' + faker.number.int({ min: 1, max: 9 }),
    code: faker.string.alphanumeric({casing: 'upper', length: 6}),
    weight: faker.number.int({ min: 1, max: 100 }),
    orderId,
    parcelId,
});

const fakerOrder = (): any => ({
    client: faker.person.fullName(),
    code: faker.string.alphanumeric({casing: 'upper', length: 6}),
});

const fakerParcel = (order: any, withTracking: boolean = false): any => ({
    label: faker.person.jobTitle(),
    code: faker.string.alphanumeric({casing: 'upper', length: 6}),
    tracking: withTracking ? faker.string.alphanumeric({casing: 'upper', length: 6}) : null,
    orderId: order.id,
    //order
});

const fakerProductsOrder = async (total: number, order: any): Promise<any> => {
    for (let i = 1; i <= total; i++) {
        console.log(`Seeding Product ${i} / Order ${order.id}...`);
        await prisma.product.create({ data: fakerProduct(order.id) });

        if (i <= parcelCount) {
            /// --------- Parcels ---------------
            console.log(`Seeding ${parcelCount} Parcels...`);
            for (let j = 1; j <= parcelCount; j++) {
                console.log(`Seeding Parcel ${j} / Order ${order.id}...`);
                const newParcel = await prisma.parcel.create({ data: fakerParcel(order, (i % 3 === 0)) });
                const totalParcel = faker.number.int({ min: 1, max: 9 });
                fakerProductsParcel(totalParcel, order.id, newParcel.id);
            }
        }
    }
}

const fakerProductsParcel = async (total: number, orderId: string, parcelId: string): Promise<any> => {
    for (let i = 1; i <= total; i++) {
        console.log(`Seeding Product ${i} / Parcel ${parcelId}...`);
        await prisma.product.create({ data: fakerProduct(orderId, parcelId) });
    }
}
    
async function main() {
    console.log(`Clearing User table...`);
    await prisma.user.deleteMany();
    console.log(`Clearing Product table...`);
    await prisma.product.deleteMany();
    console.log(`Clearing Product table...`);
    await prisma.order.deleteMany();
    console.log(`Clearing Parcel table...`);
    await prisma.parcel.deleteMany();
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
    console.log(`Seeding ${orderCount} Orders...`);
    for (let i = 1; i <= orderCount; i++) {
        console.log(`Seeding Order ${i}...`);
        const newOrder = await prisma.order.create({ data: fakerOrder() });
        const totalOrder = faker.number.int({ min: 1, max: 9 });
        fakerProductsOrder(totalOrder, newOrder);
    }

    console.log(`Seeding End...`);
};
    
      
    
main()
.catch((e) => console.error(e))
.finally(async () => {
    await prisma.$disconnect();
});