
import dns from 'node:dns';
dns.setServers(['1.1.1.1', '8.8.8.8']); //cloudefare and google dns

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import gamesRouter from './src/routes/games.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: "*"
}));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Atlas Connected Successfully'))
  .catch(err => {
    console.error('MongoDB Error:', err.message);
  });

// Connection events
const db = mongoose.connection;
db.on('error', err => console.error('DB Error:', err.message));
db.on('disconnected', () => console.log('MongoDB Disconnected'));
db.on('reconnected', () => console.log('MongoDB Reconnected'));

// Routes
app.use('/games', gamesRouter);

//checking runing backend or not
app.get('/', (req, res) => {
  res.json({ message: 'Games Store Backend Running' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server: http://localhost:${PORT}/games`);
});
 