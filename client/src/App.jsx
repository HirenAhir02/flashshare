import React, { useState, useEffect, useRef } from 'react';
import { 
  Moon, Sun, Upload, Download, Zap, Copy, CheckCircle, ArrowRight, AlertTriangle, File, Wifi 
} from 'lucide-react';
import './App.css';

// PeerJS CDN for single-file demo
const PEERJS_CDN = "https://unpkg.com/peerjs@1.5.2/dist/peerjs.min.js";

// Load PeerJS dynamically
const usePeerJS = () => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (window.Peer) { setLoaded(true); return; }
    const script = document.createElement('script');
    script.src = PEERJS_CDN;
    script.async = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);
  }, []);
  return loaded;
};

// --- Navbar ---
const Navbar = ({ darkMode, toggleTheme, setPage }) => (
  <nav className={`fixed top-0 w-full z-50 backdrop-blur-md border-b transition-colors duration-300 ${
    darkMode ? 'bg-slate-900/80 border-slate-700 text-white' : 'bg-white/80 border-slate-200 text-slate-900'
  }`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setPage('home')}>
          <div className="bg-gradient-to-tr from-cyan-400 to-blue-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
            <Zap size={24} className="text-white" fill="currentColor" />
          </div>
          <span className="font-bold text-2xl tracking-tighter">
            Flash<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Share</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className={`p-2 rounded-full transition-colors ${darkMode ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </div>
  </nav>
);

// --- Hero ---
const Hero = ({ setPage, darkMode }) => (
  <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
    <div className="absolute top-20 left-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl mix-blend-screen animate-pulse" />
    <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl mix-blend-screen animate-pulse delay-700" />
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
      <h1 className={`text-5xl md:text-7xl font-extrabold tracking-tight mb-8 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
        Transfer Files at the <br className="hidden md:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
          Speed of Light
        </span>
      </h1>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button onClick={() => setPage('send')} className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-cyan-500/50 hover:scale-105 transition-all duration-300 w-full sm:w-auto overflow-hidden">
          <div className="flex items-center justify-center gap-2 relative z-10">
            <Upload size={24} />
            <span>Send File</span>
          </div>
        </button>
        <button onClick={() => setPage('receive')} className={`px-8 py-4 rounded-xl font-bold text-lg border-2 transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-2 ${darkMode ? 'border-slate-700 text-white hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
          <Download size={24} />
          <span>Receive File</span>
        </button>
      </div>
    </div>
  </div>
);

// --- Send Interface ---
const SendInterface = ({ setPage, darkMode, isPeerLoaded }) => {
  const [file, setFile] = useState(null);
  const [peerId, setPeerId] = useState('');
  const [status, setStatus] = useState('init');
  const [progress, setProgress] = useState(0);
  const [peer, setPeer] = useState(null);
  const [conn, setConn] = useState(null);

  const CHUNK_SIZE = 16 * 1024; // 16KB

  useEffect(() => {
    if (!isPeerLoaded || !file) return;

    const p = new window.Peer(undefined, {
      host: 'flashshare-production.up.railway.app',
      port: 443,
      path: '/peerjs',
      secure: true,
      debug: 2
    });

    let offsetRef = { current: 0 };

    p.on('open', (id) => {
      setPeerId(id);
      setStatus('ready');
      console.log('✅ Peer ID:', id);
    });

    p.on('connection', (connection) => {
      setConn(connection);
      setStatus('waiting_ack');

      // Send Metadata when connection opens
      connection.on('open', () => {
        connection.send({
          type: 'METADATA',
          name: file.name,
          size: file.size,
          mime: file.type
        });
      });

      // ACK-driven chunk sending
      connection.on('data', (data) => {
        if (data?.type === 'ACK_CHUNK') {
          if (!file || !connection.open) return;
          const slice = file.slice(offsetRef.current, offsetRef.current + CHUNK_SIZE);
          const reader = new FileReader();
          reader.onload = (e) => {
            connection.send({ type: 'CHUNK', data: e.target.result });
            offsetRef.current += CHUNK_SIZE;
            setProgress(Math.min(100, (offsetRef.current / file.size) * 100));
            if (offsetRef.current >= file.size) {
              connection.send({ type: 'EOF' });
              setStatus('complete');
            }
          };
          reader.readAsArrayBuffer(slice);
        }
      });
    });

    p.on('error', (err) => {
      console.error('❌ Peer error:', err);
      setStatus('error');
    });

    setPeer(p);

    return () => { if (p) p.destroy(); };
  }, [isPeerLoaded, file]);

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer?.files[0] || e.target.files[0];
    if (droppedFile) setFile(droppedFile);
  };

  const copyToClipboard = (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
    } else fallbackCopy(text);
  };

  const fallbackCopy = (text) => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.focus(); ta.select();
    try { document.execCommand('copy'); } catch {}
    document.body.removeChild(ta);
  };

  return (
    <div className="min-h-screen pt-24 px-4 flex flex-col items-center max-w-4xl mx-auto">
      <div className="w-full flex justify-between items-center mb-8">
        <button onClick={() => setPage('home')} className={`flex items-center gap-2 hover:underline ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          <ArrowRight className="rotate-180" size={20} /> Back
        </button>
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Send Files</h2>
      </div>

      <div className={`w-full max-w-2xl rounded-3xl p-8 border-2 border-dashed relative ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'}`}>
        {!file ? (
          <div className="flex flex-col items-center justify-center py-20 cursor-pointer"
            onDragOver={e => e.preventDefault()} onDrop={handleFileDrop} onClick={() => document.getElementById('fileInput').click()}>
            <input type="file" id="fileInput" className="hidden" onChange={handleFileDrop}/>
            <div className="w-24 h-24 rounded-full bg-cyan-500/10 flex items-center justify-center mb-6 text-cyan-500">
              <Upload size={40}/>
            </div>
            <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Select File</h3>
          </div>
        ) : (
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <File className="text-cyan-500" />
              <span className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{file.name}</span>
              <span className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300">{(file.size/(1024*1024)).toFixed(2)} MB</span>
            </div>

            {status === 'ready' && (
              <div className="mb-6">
                <p className="text-slate-500 mb-2">Share this ID with receiver:</p>
                <div className={`flex items-center justify-center gap-4 px-8 py-4 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-3xl font-mono font-bold text-cyan-500 tracking-wider select-all">{peerId}</span>
                  <button className="p-2 hover:bg-white/10 rounded" onClick={() => copyToClipboard(peerId)}><Copy size={20} className={darkMode ? 'text-white' : 'text-slate-600'}/></button>
                </div>
                <div className="flex justify-center items-center gap-2 text-yellow-500 animate-pulse mt-4">
                  <Wifi size={18} />
                  <span>Waiting for receiver to connect...</span>
                </div>
              </div>
            )}

            {status === 'transferring' && (
              <div className="py-8">
                <div className="relative w-48 h-48 mx-auto mb-6">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-700" />
                    <circle cx="96" cy="96" r="88" stroke="#06b6d4" strokeWidth="12" fill="transparent" strokeDasharray={2 * Math.PI * 88} strokeDashoffset={2 * Math.PI * 88 * (1 - progress/100)} strokeLinecap="round"/>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-white">{Math.floor(progress)}%</span>
                    <span className="text-xs text-cyan-400">Sending...</span>
                  </div>
                </div>
              </div>
            )}

            {status === 'complete' && (
              <div className="py-8">
                <div className="w-20 h-20 bg-green-500 rounded-full mx-auto flex items-center justify-center text-white mb-4">
                  <CheckCircle size={40}/>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Sent Successfully!</h3>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Receive Interface ---
const ReceiveInterface = ({ setPage, darkMode, isPeerLoaded }) => {
  const [remoteId, setRemoteId] = useState('');
  const [status, setStatus] = useState('init');
  const [progress, setProgress] = useState(0);
  const [meta, setMeta] = useState(null);
  const metaRef = useRef(null);
  const chunksRef = useRef([]);
  const receivedBytesRef = useRef(0);
  const [peer, setPeer] = useState(null);

  useEffect(() => {
    if (!isPeerLoaded) return;
    const p = new window.Peer();
    setPeer(p);

    return () => { if(p) p.destroy(); };
  }, [isPeerLoaded]);

  const connectToPeer = () => {
    if (!peer || !remoteId) return;
    setStatus('connecting');

    const conn = peer.connect(remoteId);
    conn.on('open', () => setStatus('connected'));

    conn.on('data', (data) => {
      if (data.type === 'METADATA') {
        metaRef.current = data;
        setMeta(data);
        chunksRef.current = [];
        receivedBytesRef.current = 0;
        setStatus('receiving');
        // Send first ACK to start transfer
        conn.send({ type: 'ACK_CHUNK' });
      } else if (data.type === 'CHUNK') {
        chunksRef.current.push(data.data);
        receivedBytesRef.current += data.data.byteLength;
        setProgress((receivedBytesRef.current / metaRef.current.size) * 100);
        // Send ACK for next chunk
        conn.send({ type: 'ACK_CHUNK' });
      } else if (data.type === 'EOF') {
        const blob = new Blob(chunksRef.current, { type: metaRef.current.mime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = metaRef.current.name;
        a.click();
        setStatus('complete');
      }
    });

    conn.on('error', (err) => { console.error(err); setStatus('error'); });
  };

  return (
    <div className="min-h-screen pt-24 px-4 flex flex-col items-center max-w-4xl mx-auto">
      <div className="w-full flex justify-between items-center mb-8">
        <button onClick={() => setPage('home')} className={`flex items-center gap-2 hover:underline ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          <ArrowRight className="rotate-180" size={20} /> Back
        </button>
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Receive Files</h2>
      </div>

      <div className={`w-full max-w-xl rounded-3xl p-8 border shadow-xl ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
        {status === 'init' && (
          <div className="flex flex-col gap-6">
            <input type="text" placeholder="Paste Sender ID..." className={`w-full text-center py-4 rounded-xl border-2 ${darkMode ? 'bg-slate-800 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} value={remoteId} onChange={e => setRemoteId(e.target.value)}/>
            <button onClick={connectToPeer} className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/25 hover:scale-[1.02]">Start Download</button>
          </div>
        )}
        {(status === 'receiving' || status === 'connecting') && (
          <div className="text-center py-10">
            <h3 className="text-xl font-bold text-white mb-4">{status==='connecting'?'Connecting...':`Downloading ${meta?.name}`} </h3>
            <div className="w-full bg-slate-700 rounded-full h-4 mb-4 overflow-hidden">
              <div className="bg-cyan-500 h-4 transition-all duration-200" style={{width:`${progress}%`}}/>
            </div>
            <p className="text-slate-400">{Math.floor(progress)}% Complete</p>
          </div>
        )}
        {status === 'complete' && (
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-green-500 rounded-full mx-auto flex items-center justify-center text-white mb-4">
              <CheckCircle size={40}/>
            </div>
            <h3 className="text-2xl font-bold text-white">Download Complete!</h3>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main App ---
const App = () => {
  const [page, setPage] = useState('home');
  const [darkMode, setDarkMode] = useState(false);
  const isPeerLoaded = usePeerJS();

  return (
    <div className={darkMode ? 'bg-slate-900 text-white min-h-screen transition-colors' : 'bg-white text-slate-900 min-h-screen transition-colors'}>
      <Navbar darkMode={darkMode} toggleTheme={() => setDarkMode(!darkMode)} setPage={setPage}/>
      {page === 'home' && <Hero setPage={setPage} darkMode={darkMode}/>}
      {page === 'send' && <SendInterface setPage={setPage} darkMode={darkMode} isPeerLoaded={isPeerLoaded}/>}
      {page === 'receive' && <ReceiveInterface setPage={setPage} darkMode={darkMode} isPeerLoaded={isPeerLoaded}/>}
    </div>
  );
};

export default App;
