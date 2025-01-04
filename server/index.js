import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Serve static files from the dist directory after building
app.use(express.static(join(__dirname, '../dist')));

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('startSpeaking', () => {
    // Broadcast to all clients that bot is speaking
    io.emit('botSpeaking', true);
  });

  socket.on('stopSpeaking', () => {
    // Broadcast to all clients that bot stopped speaking
    io.emit('botSpeaking', false);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});