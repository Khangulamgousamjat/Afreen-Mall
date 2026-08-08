import { PrismaClient, RoleName } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Seeding Afreen Mall Database ---');

  // 1. Seed Store
  const store = await prisma.store.upsert({
    where: { code: 'AFREEN-001' },
    update: {},
    create: {
      code: 'AFREEN-001',
      name: 'Afreen Mall',
      address: 'Main Commercial Hub, City Center, Sector 4',
      phone: '+91 8625076618',
      email: 'operations@afreenmall.com',
      gstin: '27AAAAA0000A1Z5',
    },
  });
  console.log(`Seeded Store: ${store.name}`);

  // 2. Seed Super Admin
  const superAdminPassword = process.env.INITIAL_SUPER_ADMIN_PASSWORD || 'AfreenMaster@2026';
  const superAdminPasswordHash = await bcrypt.hash(superAdminPassword, 12);
  const superAdmin = await prisma.user.upsert({
    where: { staffId: 300000 },
    update: { passwordHash: superAdminPasswordHash },
    create: {
      staffId: 300000,
      username: 'Superkhan',
      fullName: 'Afreen Mall Super Admin',
      role: RoleName.SUPER_ADMIN,
      passwordHash: superAdminPasswordHash,
      mustChangePassword: false,
    },
  });
  console.log(`Seeded Super Admin: Staff ID ${superAdmin.staffId} (${superAdmin.username})`);

  // 3. Seed Default Staff Accounts
  const defaultStaffPassword = process.env.INITIAL_STAFF_PASSWORD || 'AfreenStaff@2026';
  const defaultHash = await bcrypt.hash(defaultStaffPassword, 12);
  const staffMembers = [
    { staffId: 300001, username: 'manager1', name: 'Rajesh Sharma (Store Manager)', role: RoleName.STORE_MANAGER },
    { staffId: 300002, username: 'accountant1', name: 'Priya Patel (Accountant)', role: RoleName.ACCOUNTANT },
    { staffId: 300003, username: 'cashofficer1', name: 'Sanjay Gupta (Cash Officer)', role: RoleName.CASH_OFFICER },
    { staffId: 300004, username: 'inventory1', name: 'Sunil Kumar (Inventory Lead)', role: RoleName.INVENTORY_STAFF },
    { staffId: 300005, username: 'purchase1', name: 'Neha Singh (Purchase Lead)', role: RoleName.PURCHASE_TEAM },
    // 10 Normal Cashier accounts
    { staffId: 300010, username: 'cashier1', name: 'Cashier 1', role: RoleName.CASHIER },
    { staffId: 300011, username: 'cashier2', name: 'Cashier 2', role: RoleName.CASHIER },
    { staffId: 300012, username: 'cashier3', name: 'Cashier 3', role: RoleName.CASHIER },
    { staffId: 300013, username: 'cashier4', name: 'Cashier 4', role: RoleName.CASHIER },
    { staffId: 300014, username: 'cashier5', name: 'Cashier 5', role: RoleName.CASHIER },
    { staffId: 300015, username: 'cashier6', name: 'Cashier 6', role: RoleName.CASHIER },
    { staffId: 300016, username: 'cashier7', name: 'Cashier 7', role: RoleName.CASHIER },
    { staffId: 300017, username: 'cashier8', name: 'Cashier 8', role: RoleName.CASHIER },
    { staffId: 300018, username: 'cashier9', name: 'Cashier 9', role: RoleName.CASHIER },
    { staffId: 300019, username: 'cashier10', name: 'Cashier 10', role: RoleName.CASHIER },
  ];

  for (const s of staffMembers) {
    await prisma.user.upsert({
      where: { staffId: s.staffId },
      update: {},
      create: {
        staffId: s.staffId,
        username: s.username,
        fullName: s.name,
        passwordHash: defaultHash,
        role: s.role,
        mustChangePassword: true,
      },
    });
  }
  console.log(`Seeded ${staffMembers.length} standard staff accounts (IDs 300001 - 300006)`);

  // 3. Seed POS Registers
  const registers = ['POS-01', 'POS-02', 'POS-03'];
  for (const posNumber of registers) {
    await prisma.register.upsert({
      where: { posNumber },
      update: {},
      create: {
        posNumber,
        name: `Checkout Counter ${posNumber.split('-')[1]}`,
        isActive: true,
      },
    });
  }

  // 4. Units & Tax Rates
  const pcsUnit = await prisma.unit.upsert({
    where: { code: 'PCS' },
    update: {},
    create: { name: 'Pieces', code: 'PCS' },
  });
  const kgUnit = await prisma.unit.upsert({
    where: { code: 'KG' },
    update: {},
    create: { name: 'Kilograms', code: 'KG' },
  });

  const tax5 = await prisma.taxRate.upsert({
    where: { id: 'tax-5' },
    update: {},
    create: { id: 'tax-5', name: 'GST 5%', rate: 5.0 },
  });
  const tax12 = await prisma.taxRate.upsert({
    where: { id: 'tax-12' },
    update: {},
    create: { id: 'tax-12', name: 'GST 12%', rate: 12.0 },
  });
  const tax18 = await prisma.taxRate.upsert({
    where: { id: 'tax-18' },
    update: {},
    create: { id: 'tax-18', name: 'GST 18%', rate: 18.0 },
  });

  // 5. HSN Codes
  const hsnGrocery = await prisma.hSNCode.upsert({
    where: { code: '1905' },
    update: {},
    create: { code: '1905', description: 'Bread, Pastries, Cakes, Biscuits' },
  });
  const hsnBeverages = await prisma.hSNCode.upsert({
    where: { code: '2202' },
    update: {},
    create: { code: '2202', description: 'Waters, Aerated Waters, Soft Drinks' },
  });

  // 6. Categories & SubCategories
  const catGrocery = await prisma.category.upsert({
    where: { code: 'CAT-GROCERY' },
    update: {},
    create: { name: 'Grocery & Staples', code: 'CAT-GROCERY' },
  });
  const catSnacks = await prisma.category.upsert({
    where: { code: 'CAT-SNACKS' },
    update: {},
    create: { name: 'Snacks & Beverages', code: 'CAT-SNACKS' },
  });

  // 7. Products & Initial Stock
  const sampleProducts = [
    {
      barcode: '8901030000018',
      name: 'Afreen Premium Basmati Rice 5kg',
      description: 'Long grain aromatic basmati rice',
      categoryId: catGrocery.id,
      unitId: kgUnit.id,
      taxRateId: tax5.id,
      hsnCodeId: hsnGrocery.id,
      mrp: 65000, // ₹650.00
      saleRate: 59000, // ₹590.00
      discountPct: 9.23,
      minStockLevel: 25,
      stock: 80,
    },
    {
      barcode: '8901030000025',
      name: 'Britannia Good Day Biscuits 200g',
      description: 'Cashew cookies pack',
      categoryId: catSnacks.id,
      unitId: pcsUnit.id,
      taxRateId: tax18.id,
      hsnCodeId: hsnGrocery.id,
      mrp: 4000, // ₹40.00
      saleRate: 3600, // ₹36.00
      discountPct: 10.0,
      minStockLevel: 50,
      stock: 12, // Low stock for shelf-tag gauge red alert testing!
    },
    {
      barcode: '8901030000032',
      name: 'Coca Cola Soft Drink 1.25L',
      description: 'Carbonated beverage bottle',
      categoryId: catSnacks.id,
      unitId: pcsUnit.id,
      taxRateId: tax18.id,
      hsnCodeId: hsnBeverages.id,
      mrp: 6500, // ₹65.00
      saleRate: 6000, // ₹60.00
      discountPct: 7.69,
      minStockLevel: 30,
      stock: 45, // Amber level testing
    },
    {
      barcode: '8901030000049',
      name: 'Amul Butter 500g',
      description: 'Pasteurized salted butter',
      categoryId: catGrocery.id,
      unitId: pcsUnit.id,
      taxRateId: tax12.id,
      hsnCodeId: hsnGrocery.id,
      mrp: 27500, // ₹275.00
      saleRate: 26000, // ₹260.00
      discountPct: 5.45,
      minStockLevel: 20,
      stock: 5, // Critical red stock
    },
  ];

  for (const p of sampleProducts) {
    const product = await prisma.product.upsert({
      where: { barcode: p.barcode },
      update: {},
      create: {
        barcode: p.barcode,
        name: p.name,
        description: p.description,
        categoryId: p.categoryId,
        unitId: p.unitId,
        taxRateId: p.taxRateId,
        hsnCodeId: p.hsnCodeId,
        mrp: p.mrp,
        saleRate: p.saleRate,
        discountPct: p.discountPct,
        minStockLevel: p.minStockLevel,
      },
    });

    await prisma.inventory.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        currentStock: p.stock,
      },
    });
  }

  // 8. Suppliers & Warehouse
  const supplier = await prisma.supplier.upsert({
    where: { code: 'SUP-001' },
    update: {},
    create: {
      code: 'SUP-001',
      name: 'Metro Wholesale Traders Pvt Ltd',
      contactPerson: 'Karan Malhotra',
      phone: '+91 9820011223',
      email: 'orders@metrowholesale.in',
      address: 'Plot 45, Industrial Logistics Park, Zone 2',
      gstin: '27BBBCC1111B1Z2',
    },
  });

  const warehouse = await prisma.warehouse.upsert({
    where: { code: 'WH-MAIN' },
    update: {},
    create: {
      code: 'WH-MAIN',
      name: 'Afreen Mall Central Warehouse',
    },
  });

  let rackA = await prisma.rack.findFirst({ where: { warehouseId: warehouse.id, rackNumber: 'Rack-A1' } });
  if (!rackA) {
    rackA = await prisma.rack.create({
      data: {
        warehouseId: warehouse.id,
        rackNumber: 'Rack-A1',
      },
    });
  }

  await prisma.bin.upsert({
    where: { binCode: 'BIN-A1-01' },
    update: {},
    create: {
      rackId: rackA.id,
      binCode: 'BIN-A1-01',
      capacity: 500,
    },
  });

  // 9. Sample Customer Loyalty Record
  await prisma.customer.upsert({
    where: { phone: '9876543210' },
    update: {},
    create: {
      phone: '9876543210',
      fullName: 'Vikram Mehta',
      email: 'vikram.mehta@gmail.com',
      tier: 'GOLD',
      loyaltyPoints: 450,
    },
  });

  console.log('--- Database Seeding Completed Successfully ---');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
