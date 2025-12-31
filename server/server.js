const express = require('express');
const { PeerServer } = require('peer');

const app = express();
const PORT = process.env.PORT || 443; // Railway free plan assigns dynamic port

// Test endpoint
app.get('/', (req, res) => {
  res.send('🚀 FlashShare Signaling Server is Running...');
});

// Start HTTP server
const server = app.listen(PORT, () => {
  console.log(`✨ FlashShare Server running on port ${PORT}`);
});

// PeerJS Signaling Server
const peerServer = PeerServer({
  port: PORT,          // Free plan compatible
  path: '/flashshare',
  allow_discovery: true
});

peerServer.on('connection', (client) => {
  console.log(`Client Connected: ${client.getId()}`);
});

peerServer.on('disconnect', (client) => {
  console.log(`Client Disconnected: ${client.getId()}`);
});

console.log('📡 P2P Signaling active on path /flashshare');
