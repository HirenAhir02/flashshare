const express = require('express');
const { ExpressPeerServer } = require('peer');
const http = require('http');
const cors = require('cors');

const app = express();

// ✅ Allow all (Vercel safe)
app.use(cors({ origin: '*' }));

// Test route
app.get('/', (req, res) => {
  res.send('🚀 PeerJS Server Running');
});

// 🔥 IMPORTANT: create HTTP server manually
const server = http.createServer(app);

// 🔥 Attach PeerJS BEFORE listen
const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: '/'
});

// 🔥 Mount PeerJS
app.use('/peerjs', peerServer);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ PeerJS listening on ${PORT}`);
});
