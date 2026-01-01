const express = require('express');
const { ExpressPeerServer } = require('peer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// 🔥 allow everything for PeerJS
app.use(cors({ origin: '*' }));

app.get('/', (req, res) => {
  res.send('🚀 FlashShare Signaling Server Running');
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✨ FlashShare Server running on port ${PORT}`);
});

// 🔥 IMPORTANT CHANGE HERE
const peerServer = ExpressPeerServer(server, {
  path: '/peerjs',   // ✅ THIS FIXES 404
  allow_discovery: true,
  debug: true,
});

app.use('/peerjs', peerServer);

peerServer.on('connection', (client) => {
  console.log('Client connected:', client.getId());
});
peerServer.on('disconnect', (client) => {
  console.log('Client disconnected:', client.getId());
});
