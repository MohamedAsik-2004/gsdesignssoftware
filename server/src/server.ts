import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { initSocket } from './socket';
import { authRouter } from './routes/authRoutes';
import { orderRouter } from './routes/orderRoutes';
import { customerRouter, reportRouter } from './routes/customerRoutes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Express Middlewares
app.use(cors());
app.use(express.json());

// API Endpoints
app.use('/api/auth', authRouter);
app.use('/api/orders', orderRouter);
app.use('/api/customers', customerRouter);
app.use('/api/reports', reportRouter);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'GS Designs Multi-Terminal Backend API',
    timestamp: new Date().toISOString(),
    desksSupported: ['ADMIN', 'DESIGNER', 'PRINTING', 'BILLING']
  });
});

// Serve frontend build static files if built dist folder exists
const distPath = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Create HTTP & Socket.io Server
const httpServer = createServer(app);
initSocket(httpServer);

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`🚀 GS DESIGNS MULTI-TERMINAL BACKEND SERVER RUNNING`);
  console.log(`📡 PORT: http://localhost:${PORT}`);
  console.log(`⚡ SOCKET.IO: Connected for Real-Time Synchronization`);
  console.log(`====================================================`);
});
