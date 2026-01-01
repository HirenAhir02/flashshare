const express = require('express');
const { ExpressPeerServer } = require('peer');
const cors = require('cors');

const app = express();

// Railway dynamic port
const PORT = process.env.PORT || 3000;

// 🔥 CORS (global)
app.use(cors({
  origin: '*',   // ✅ PeerJS needs this
  methods: ['GET', 'POST'],
}));

// Test route
app.get('/', (req, res) => {
  res.send('🚀 FlashShare Signaling Server Running');
});

// Start HTTP server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✨ FlashShare Server running on port ${PORT}`);
});

// 🔥 PeerServer with CORS HEADERS
const peerServer = ExpressPeerServer(server, {
  path: '/flashshare',
  allow_discovery: true,
  debug: true,
});

// 🔥 VERY IMPORTANT: attach headers
peerServer.on('connection', (client) => {
  console.log('Client connected:', client.getId());
});

peerServer.on('disconnect', (client) => {
  console.log('Client disconnected:', client.getId());
});

// 🔥 attach PeerServer
app.use('/flashshare', peerServer);
