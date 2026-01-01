const express = require('express');
const { ExpressPeerServer } = require('peer');

const app = express();

// Railway dynamically assigns port
const PORT = process.env.PORT || 3000;

// Simple test route
app.get('/', (req, res) => {
  res.send('🚀 FlashShare Signaling Server Running');
});

// Start HTTP server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✨ FlashShare Server running on port ${PORT}`);
});

// Attach PeerJS to the same Express server
const peerServer = ExpressPeerServer(server, {
  path: '/flashshare',
  allow_discovery: true,
  debug: true // logs PeerJS activity
});

// Mount PeerJS under /flashshare
app.use('/flashshare', peerServer);

// PeerJS connection events
peerServer.on('connection', (client) => {
  console.log('Client connected:', client.getId());
});

peerServer.on('disconnect', (client) => {
  console.log('Client disconnected:', client.getId());
});
