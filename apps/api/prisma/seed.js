"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding database...');
    const store = await prisma.store.create({
        data: {
            name: 'Afreen Mall',
            address: 'Plot No 42, Retail District, Hyderabad, India',
        },
    });
    console.log(`Seeding Store: ${store.name}`);
    try {
        await prisma.$executeRawUnsafe(`ALTER SEQUENCE "User_staff_id_seq" RESTART WITH 300001;`);
        console.log('User staff_id sequence adjusted to 300001');
    }
    catch (err) {
        console.warn('Could not adjust sequence (this is normal if running database push on SQLite/mocking):', err);
    }
    const adminPasswordHash = await bcrypt.hash('Kingkhan@12', 12);
    const superAdmin = await prisma.user.create({
        data: {
            staff_id: 300000,
            username: 'Superkhan',
            name: 'Super Admin Khan',
            password_hash: adminPasswordHash,
            role: 'SUPER_ADMIN',
            must_change_password: false,
        },
    });
    console.log(`Created Super Admin user: ${superAdmin.username} with Staff ID: ${superAdmin.staff_id}`);
    const cashierPasswordHash = await bcrypt.hash('Pass@123', 12);
    const cashier = await prisma.user.create({
        data: {
            staff_id: 300001,
            username: '300001',
            name: 'John Cashier',
            password_hash: cashierPasswordHash,
            role: 'CASHIER',
            must_change_password: true,
        },
    });
    console.log(`Created Cashier user: ${cashier.name} with Staff ID: ${cashier.staff_id}`);
    const cashOfficer = await prisma.user.create({
        data: {
            staff_id: 300002,
            username: '300002',
            name: 'Sara Officer',
            password_hash: cashierPasswordHash,
            role: 'CASH_OFFICER',
            must_change_password: true,
        },
    });
    console.log(`Created Cash Officer user: ${cashOfficer.name} with Staff ID: ${cashOfficer.staff_id}`);
    const manager = await prisma.user.create({
        data: {
            staff_id: 300003,
            username: '300003',
            name: 'Dave Manager',
            password_hash: cashierPasswordHash,
            role: 'STORE_MANAGER',
            must_change_password: true,
        },
    });
    console.log(`Created Store Manager user: ${manager.name} with Staff ID: ${manager.staff_id}`);
    const categoryGrocery = await prisma.category.create({ data: { name: 'Grocery' } });
    const categoryDairy = await prisma.category.create({ data: { name: 'Dairy' } });
    const categoryBeverages = await prisma.category.create({ data: { name: 'Beverages' } });
    const categorySnacks = await prisma.category.create({ data: { name: 'Snacks' } });
    const categoryPersonal = await prisma.category.create({ data: { name: 'Personal Care' } });
    const products = [
        { barcode: '8901030752538', name: 'Lux Soap 100g', categoryId: categoryPersonal.id, price: 4500, cost: 3500, minStock: 20, initialQty: 100 },
        { barcode: '8901207040260', name: 'Amul Gold Milk 1L', categoryId: categoryDairy.id, price: 6600, cost: 5800, minStock: 15, initialQty: 40 },
        { barcode: '8901491101836', name: 'Lays Chips 50g', categoryId: categorySnacks.id, price: 2000, cost: 1500, minStock: 30, initialQty: 150 },
        { barcode: '8901725181220', name: 'Coca Cola 500ml', categoryId: categoryBeverages.id, price: 4000, cost: 3000, minStock: 25, initialQty: 80 },
        { barcode: '8901058002318', name: 'Tata Salt 1kg', categoryId: categoryGrocery.id, price: 2800, cost: 2200, minStock: 10, initialQty: 60 },
    ];
    for (const prod of products) {
        const createdProduct = await prisma.product.create({
            data: {
                barcode: prod.barcode,
                name: prod.name,
                category_id: prod.categoryId,
                price_paise: prod.price,
                cost_paise: prod.cost,
                min_stock: prod.minStock,
            },
        });
        await prisma.inventory.create({
            data: {
                product_id: createdProduct.id,
                quantity: prod.initialQty,
                rack: 'RACK-A',
                bin: 'BIN-1',
            },
        });
    }
    await prisma.supplier.create({
        data: {
            name: 'Metro Wholesale Distributors',
            contact: '+91-9876543210',
        },
    });
    console.log('Seeding complete successfully.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map