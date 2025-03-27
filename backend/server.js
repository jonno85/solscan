import express, { json } from 'express';
import { connect } from 'mongoose';
import config from 'config';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { startIndexing } from './services/indexer.js';

import blockRoutes from './routes/blocks.js';
import transactionRoutes from './routes/transactions.js';
import accountRoutes from './routes/accounts.js';
import tokenRoutes from './routes/tokens.js';
import logger from './utils/logger.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(json());

// Routes
app.use('/api/v1/blocks', blockRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/accounts', accountRoutes);
app.use('/api/v1/tokens', tokenRoutes);

io.on('connection', (socket) => {
  logger.info('Client connected');

  socket.on('disconnect', () => {
    logger.info('Client disconnected');
  });
});

connect(config.get('mongoURI'))
  .then(() => {
    logger.info('MongoDB Connected');

    // Start the indexer
    startIndexing(io);

    // Start server
    const PORT = config.get('port') || 5001;
    server.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    logger.error('MongoDB Connection Error:', err);
    process.exit(1);
  });
