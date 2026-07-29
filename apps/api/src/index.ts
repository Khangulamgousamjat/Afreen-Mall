import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRouter from './modules/auth/auth.routes.js';
import usersRouter from './modules/users/users.routes.js';
import posRouter from './modules/pos/pos.routes.js';
import cashRouter from './modules/cash/cash.routes.js';
import catalogRouter from './modules/catalog/catalog.routes.js';
import inventoryRouter from './modules/inventory/inventory.routes.js';
import purchasingRouter from './modules/purchasing/purchasing.routes.js';
import warehouseRouter from './modules/warehouse/warehouse.routes.js';
import customersRouter from './modules/customers/customers.routes.js';
import reportsRouter from './modules/reports/reports.routes.js';
import hardwareRouter from './modules/hardware/hardware.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// Healthcheck
app.get('/health', (req, res) => {
  res.json({ status: 'ok', store: 'Afreen Mall Internal Operations Platform API', time: new Date() });
});

// API v1 Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/pos', posRouter);
app.use('/api/v1/cash', cashRouter);
app.use('/api/v1/catalog', catalogRouter);
app.use('/api/v1/inventory', inventoryRouter);
app.use('/api/v1/purchasing', purchasingRouter);
app.use('/api/v1/warehouse', warehouseRouter);
app.use('/api/v1/customers', customersRouter);
app.use('/api/v1/reports', reportsRouter);
app.use('/api/v1/hardware', hardwareRouter);

// Start listening on 0.0.0.0 for Render compatibility
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`===========================================================`);
  console.log(`  Afreen Mall API Server running on port ${PORT}`);
  console.log(`  Healthcheck: http://localhost:${PORT}/health`);
  console.log(`===========================================================`);
});
