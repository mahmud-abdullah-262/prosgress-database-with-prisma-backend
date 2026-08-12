"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const faker_1 = require("@faker-js/faker");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const adapter = new adapter_pg_1.PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new client_1.PrismaClient({ adapter });
const USER_COUNT = 15;
const CATEGORY_COUNT = 6;
const PRODUCT_COUNT = 40;
const ORDER_COUNT = 25;
async function main() {
    console.log('🌱 Seeding started...');
    const hashedPassword = await bcryptjs_1.default.hash('123456aA', 10);
    // ---------- 1. USERS ----------
    const userData = Array.from({ length: USER_COUNT }).map((_, i) => ({
        name: faker_1.faker.person.fullName(),
        email: faker_1.faker.internet.email({ firstName: `user${i}` }).toLowerCase(),
        password: hashedPassword,
        role: i === 0 ? client_1.Role.ADMIN : client_1.Role.USER, // প্রথম ইউজারকে ADMIN রাখলাম
    }));
    await prisma.user.createMany({ data: userData, skipDuplicates: true });
    const users = await prisma.user.findMany();
    console.log(`✅ ${users.length} users created`);
    // ---------- 2. CATEGORIES ----------
    const categoryNames = Array.from(new Set(Array.from({ length: CATEGORY_COUNT }).map(() => faker_1.faker.commerce.department())));
    await prisma.category.createMany({
        data: categoryNames.map((name) => ({
            name,
            description: faker_1.faker.commerce.productDescription(),
        })),
        skipDuplicates: true,
    });
    const categories = await prisma.category.findMany();
    console.log(`✅ ${categories.length} categories created`);
    // ---------- 3. PRODUCTS ----------
    const productData = Array.from({ length: PRODUCT_COUNT }).map(() => ({
        title: faker_1.faker.commerce.productName(),
        description: faker_1.faker.commerce.productDescription(),
        price: parseFloat(faker_1.faker.commerce.price({ min: 10, max: 5000 })),
        stock: faker_1.faker.number.int({ min: 0, max: 200 }),
        categoryId: faker_1.faker.helpers.arrayElement(categories).id, // random category
    }));
    await prisma.product.createMany({ data: productData });
    const products = await prisma.product.findMany();
    console.log(`✅ ${products.length} products created`);
    // ---------- 4. ORDERS + ORDER ITEMS + REVIEWS ----------
    let totalOrderItems = 0;
    let totalReviews = 0;
    for (let i = 0; i < ORDER_COUNT; i++) {
        const orderUser = faker_1.faker.helpers.arrayElement(users);
        // এই অর্ডারে র‍্যান্ডম ১-৪টা প্রোডাক্ট থাকবে (duplicate ছাড়া)
        const orderProducts = faker_1.faker.helpers.arrayElements(products, faker_1.faker.number.int({ min: 1, max: 4 }));
        const itemsInput = orderProducts.map((product) => {
            const quantity = faker_1.faker.number.int({ min: 1, max: 5 });
            return {
                productId: product.id,
                quantity,
                price: product.price, // অর্ডারের সময়কার প্রাইস স্ন্যাপশট
            };
        });
        const totalAmount = itemsInput.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const order = await prisma.order.create({
            data: {
                userId: orderUser.id,
                totalAmount,
                status: faker_1.faker.helpers.arrayElement(Object.values(client_1.OrderStatus)),
                orderItems: {
                    create: itemsInput,
                },
            },
            include: { orderItems: true },
        });
        totalOrderItems += order.orderItems.length;
        // ---------- 5. এই অর্ডারের প্রতিটা আইটেমের জন্য REVIEW ----------
        for (const item of order.orderItems) {
            // ধরলাম শুধু DELIVERED অর্ডারের প্রোডাক্টেই রিভিউ থাকবে (বাস্তবসম্মত)
            if (order.status === client_1.OrderStatus.DELIVERED) {
                await prisma.review.create({
                    data: {
                        rating: faker_1.faker.number.int({ min: 1, max: 5 }),
                        comment: faker_1.faker.lorem.sentence(),
                        userId: order.userId,
                        productId: item.productId,
                    },
                });
                totalReviews++;
            }
        }
    }
    console.log(`✅ ${ORDER_COUNT} orders created`);
    console.log(`✅ ${totalOrderItems} order items created`);
    console.log(`✅ ${totalReviews} reviews created`);
    console.log('🌱 Seeding finished!');
}
main()
    .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
