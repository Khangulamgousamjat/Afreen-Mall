import dotenv from 'dotenv';
import { createApp } from './app.js';

dotenv.config();

const PORT = process.env.PORT || 4000;

const app = createApp();

// Start listening on 0.0.0.0 for Render compatibility
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`===========================================================`);
  console.log(`  Afreen Mall API Server running on port ${PORT}`);
  console.log(`  Healthcheck: http://localhost:${PORT}/health`);
  console.log(`===========================================================`);
});
