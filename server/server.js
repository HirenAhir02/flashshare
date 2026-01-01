const express = require('express');
const { ExpressPeerServer } = require('peer');
const cors = require('cors');

const app = express();

// ✅ CORS – allow all (Railway + Vercel safest)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST']
}));

// Health check / test
app.get('/', (req, res) => {
  res.send('🚀 PeerJS Server Running');
});

// ⚠️ IMPORTANT: listen FIRST
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});

// ✅ Attach PeerJS AFTER server.listen
const peerServer = ExpressPeerServer(server, {
  path: '/',        // 🔥 VERY IMPORTANT
  debug: true
});

// ⚠️ mount ONLY /peerjs
app.use('/peerjs', peerServer);

// Logs
peerServer.on('connection', (client) => {
  console.log('🔌 Client connected:', client.getId());
});

peerServer.on('disconnect', (client) => {
  console.log('❌ Client disconnected:', client.getId());
});
