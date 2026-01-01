const express = require('express');
const { ExpressPeerServer } = require('peer');

const app = express();

// ✅ Railway dynamic port
const PORT = process.env.PORT || 3000;

// basic test route
app.get('/', (req, res) => {
  res.send('🚀 FlashShare Signaling Server Running');
});

// create HTTP server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✨ FlashShare Server running on port ${PORT}`);
});

// attach PeerJS to SAME server
const peerServer = ExpressPeerServer(server, {
  path: '/flashshare',
  allow_discovery: true,
});

app.use('/flashshare', peerServer);

// logs
peerServer.on('connection', (client) => {
  console.log('Client connected:', client.getId());
});

peerServer.on('disconnect', (client) => {
  console.log('Client disconnected:', client.getId());
});
