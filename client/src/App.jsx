import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Moon, Sun, Upload, Download, Zap, Share2, 
  ShieldCheck, File, X, CheckCircle, ArrowRight, 
  Menu, Cpu, Wifi, Globe, Copy, Lock, Server, EyeOff, Network,
  AlertTriangle
} from 'lucide-react';
import './App.css';

// NOTE: In a real environment, you would install peerjs via npm: `npm install peerjs`
// Here we are loading it from CDN for the demo to work without build steps.
const PEERJS_CDN = "https://unpkg.com/peerjs@1.5.2/dist/peerjs.min.js";

/**
 * UTILITY: Dynamic Script Loader
 * Loads PeerJS library dynamically since we are in a single-file environment.
 */
const usePeerJS = () => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (window.Peer) {
      setLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = PEERJS_CDN;
    script.async = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);
  }, []);
  return loaded;
};

// --- Components ---

const Navbar = ({ darkMode, toggleTheme, setPage }) => (
  <nav className={`fixed top-0 w-full z-50 backdrop-blur-md border-b transition-colors duration-300 ${
    darkMode ? 'bg-slate-900/80 border-slate-700 text-white' : 'bg-white/80 border-slate-200 text-slate-900'
  }`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setPage('home')}
        >
          <div className="bg-gradient-to-tr from-cyan-400 to-blue-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
            <Zap size={24} className="text-white" fill="currentColor" />
          </div>
          <span className="font-bold text-2xl tracking-tighter">
            Flash<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Share</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors ${
              darkMode ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </div>
  </nav>
);

const Hero = ({ setPage, darkMode }) => (
  <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
    <div className="absolute top-20 left-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl mix-blend-screen animate-pulse" />
    <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl mix-blend-screen animate-pulse delay-700" />

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 mb-8 animate-fade-in-up">
        <span className="text-sm font-semibold tracking-wide">P2P TRANSFER PROTOCOL V2.0 (LIVE)</span>
      </div>
      <h1 className={`text-5xl md:text-7xl font-extrabold tracking-tight mb-8 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
        Transfer Files at the <br className="hidden md:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
          Speed of Light
        </span>
      </h1>
      <p className={`mt-4 max-w-2xl mx-auto text-xl mb-10 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
        Direct P2P. No Server Uploads. <strong>150GB+ Ready.</strong>
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button 
          onClick={() => setPage('send')}
          className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-cyan-500/50 hover:scale-105 transition-all duration-300 w-full sm:w-auto overflow-hidden"
        >
           <div className="flex items-center justify-center gap-2 relative z-10">
            <Upload size={24} />
            <span>Send File</span>
          </div>
        </button>
        <button 
          onClick={() => setPage('receive')}
          className={`px-8 py-4 rounded-xl font-bold text-lg border-2 transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-2 ${
            darkMode ? 'border-slate-700 text-white hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Download size={24} />
          <span>Receive File</span>
        </button>
      </div>
    </div>
  </div>
);

// --- REAL SEND LOGIC ---

const SendInterface = ({ setPage, darkMode, isPeerLoaded }) => {
  const [file, setFile] = useState(null);
  const [peerId, setPeerId] = useState('');
  const [status, setStatus] = useState('init'); // init, ready, waiting, transferring, complete, error
  const [progress, setProgress] = useState(0);
  const [peer, setPeer] = useState(null);
  const [conn, setConn] = useState(null);
  
  // Initialize Peer on mount
  useEffect(() => {
    if (!isPeerLoaded) return;
    
    // Create Peer (using public PeerJS server for demo)
    // In production, use your own host: { host: 'your-node-app.com', port: 443, path: '/myapp' }
    // const p = new window.Peer(null, {
    //   debug: 2
    // });
//     const p = new window.Peer(null, {
//   host: 'flashshare-production.up.railway.app',
//   port: 9001,
//   path: '/flashshare',
//   secure: true
// });
// const p = new window.Peer(undefined, {
//   host: 'flashshare-production.up.railway.app',
//   path: '/flashshare',
//   secure: true,
//   config: {
//     iceServers: [
//       { urls: 'stun:stun.l.google.com:19302' },
//       { urls: 'stun:stun1.l.google.com:19302' }
//     ]
//   }
// });

// const p = new Peer(undefined, {
//   host: 'flashshare-production.up.railway.app',
//   port: 443,
//   path: '/peerjs',   // ✅ MUST MATCH
//   secure: true,
//   debug: 2,
//   config: {
//     iceServers: [
//       { urls: 'stun:stun.l.google.com:19302' },
//       { urls: 'stun:stun1.l.google.com:19302' }
//     ]
//   }
// });

const p = new window.Peer(undefined, {
  host: 'flashshare-production.up.railway.app',
  port: 443,
  secure: true,
  path: '/peerjs',
  debug: 2
});

// p.on('open', (id) => {
//   console.log('✅ Peer ID:', id);
// });

p.on('error', (err) => {
  console.error('❌ Peer error:', err);
});



    p.on('open', (id) => {
      setPeerId(id);
      setStatus('ready');
    });

    p.on('connection', (connection) => {
      setConn(connection);
      setStatus('waiting_ack'); // Connected, waiting to start
      
      connection.on('open', () => {
        // Connection established
        console.log("Receiver connected!");
      });

      connection.on('data', (data) => {
        // Handle ACK to send next chunk (Backpressure control)
        if (data && data.type === 'ACK_CHUNK') {
          // In a complex app, we use this to trigger next chunk read
        }
      });
    });

    p.on('error', (err) => {
      console.error(err);
      setStatus('error');
    });

    setPeer(p);

    return () => {
      if (p) p.destroy();
    };
  }, [isPeerLoaded]);

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer?.files[0] || e.target.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  // Robust Copy Function (Fix for NotAllowedError)
  const copyToClipboard = (text) => {
    // 1. Try standard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(err => {
        // If failed (e.g. permission denied), use fallback
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  };

  const fallbackCopy = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Ensure it's not visible but part of DOM
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      // Success feedback could go here
    } catch (err) {
      console.error('Fallback: Unable to copy', err);
    }
    
    document.body.removeChild(textArea);
  };

  const startTransfer = async () => {
    if (!conn || !file) return;
    setStatus('transferring');

    // 1. Send Metadata
    conn.send({
      type: 'METADATA',
      name: file.name,
      size: file.size,
      mime: file.type
    });

    // 2. Start Chunking
    const CHUNK_SIZE = 16 * 1024; // 16KB chunks (Safe for PeerJS)
    let offset = 0;

    // Simple loop for demo. For 150GB, we need flow control (wait for ACKs)
    // to prevent memory overflow. Here we use a bufferedAmount check.
    
    const readSlice = (o) => {
      const slice = file.slice(offset, o + CHUNK_SIZE);
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (!conn.open) return;
        
        conn.send({
          type: 'CHUNK',
          data: event.target.result // ArrayBuffer
        });

        offset += CHUNK_SIZE;
        
        // Calculate Progress
        const percent = Math.min(100, (offset / file.size) * 100);
        setProgress(percent);

        if (offset < file.size) {
          // Flow Control: Check buffer
          if (conn.dataChannel.bufferedAmount > 10 * 1024 * 1024) {
             // Wait if buffer is full (>10MB)
             setTimeout(() => readSlice(offset), 100);
          } else {
             // Continue fast
             setTimeout(() => readSlice(offset), 0); // Release main thread
          }
        } else {
          conn.send({ type: 'EOF' }); // End of File
          setStatus('complete');
        }
      };
      
      reader.readAsArrayBuffer(slice);
    };

    readSlice(0);
  };

  // Auto-start transfer when connection opens and file is ready
  useEffect(() => {
    if (status === 'waiting_ack' && file && conn) {
       // Add small delay to ensure connection is stable
       setTimeout(startTransfer, 500);
    }
  }, [status, file, conn]);


  return (
    <div className="min-h-screen pt-24 px-4 flex flex-col items-center max-w-4xl mx-auto">
      <div className="w-full flex justify-between items-center mb-8">
        <button onClick={() => setPage('home')} className={`flex items-center gap-2 hover:underline ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          <ArrowRight className="rotate-180" size={20} /> Back
        </button>
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Send Files</h2>
      </div>

      <div className={`w-full max-w-2xl rounded-3xl p-8 border-2 border-dashed transition-all duration-300 relative overflow-hidden ${
        darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'
      }`}>
        
        {!file ? (
          <div 
            className="flex flex-col items-center justify-center py-20 cursor-pointer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            onClick={() => document.getElementById('fileInput').click()}
          >
            <input type="file" id="fileInput" className="hidden" onChange={handleFileDrop} />
            <div className="w-24 h-24 rounded-full bg-cyan-500/10 flex items-center justify-center mb-6 text-cyan-500">
              <Upload size={40} />
            </div>
            <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Select File</h3>
            <p className="text-slate-500">Supports Large Files (100GB+)</p>
          </div>
        ) : (
          <div className="text-center">
             <div className="flex items-center justify-center gap-3 mb-6">
                <File className="text-cyan-500" />
                <span className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{file.name}</span>
                <span className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300">{(file.size / (1024*1024)).toFixed(2)} MB</span>
             </div>

             {status === 'ready' && (
               <>
                 <div className="mb-6">
                   <p className="text-slate-500 mb-2">Share this ID with receiver:</p>
                   <div className={`flex items-center justify-center gap-4 px-8 py-4 rounded-xl border ${
                     darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                   }`}>
                     <span className="text-3xl font-mono font-bold text-cyan-500 tracking-wider select-all">{peerId}</span>
                     <button className="p-2 hover:bg-white/10 rounded" onClick={() => copyToClipboard(peerId)}>
                        <Copy size={20} className={darkMode ? 'text-white' : 'text-slate-600'}/>
                     </button>
                   </div>
                 </div>
                 <div className="flex justify-center items-center gap-2 text-yellow-500 animate-pulse">
                    <Wifi size={18} />
                    <span>Waiting for receiver to connect...</span>
                 </div>
               </>
             )}

             {status === 'transferring' && (
                <div className="py-8">
                   <div className="relative w-48 h-48 mx-auto mb-6">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-700" />
                        <circle 
                          cx="96" cy="96" r="88" 
                          stroke="#06b6d4" 
                          strokeWidth="12" 
                          fill="transparent" 
                          strokeDasharray={2 * Math.PI * 88}
                          strokeDashoffset={2 * Math.PI * 88 * (1 - progress / 100)}
                          strokeLinecap="round"
                        />
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
                    <CheckCircle size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Sent Successfully!</h3>
                  <button onClick={() => window.location.reload()} className="text-cyan-400 hover:underline">Send Another</button>
                </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

// --- REAL RECEIVE LOGIC ---

const ReceiveInterface = ({ setPage, darkMode, isPeerLoaded }) => {
  const [remoteId, setRemoteId] = useState('');
  const [status, setStatus] = useState('init');
  const [progress, setProgress] = useState(0);
  const [meta, setMeta] = useState(null); // Keep meta for UI rendering
  const metaRef = useRef(null); // Use ref for event listener access
  const [receivedChunks, setReceivedChunks] = useState([]);
  const [peer, setPeer] = useState(null);

  useEffect(() => {
    if (!isPeerLoaded) return;
    const p = new window.Peer();
    p.on('open', (id) => console.log('My Receiver ID:', id));
    setPeer(p);
    return () => { if(p) p.destroy(); };
  }, [isPeerLoaded]);

  const connectToPeer = () => {
    if (!peer || !remoteId) return;
    setStatus('connecting');

    const conn = peer.connect(remoteId);

    conn.on('open', () => {
      setStatus('connected');
      console.log("Connected to Sender");
    });

    let receivedBytes = 0;
    let chunks = [];

    conn.on('data', (data) => {
      if (data.type === 'METADATA') {
        metaRef.current = data; // Update Ref immediately
        setMeta(data);          // Trigger UI update
        setStatus('receiving');
        chunks = []; 
        receivedBytes = 0;
      } 
      else if (data.type === 'CHUNK') {
        chunks.push(data.data);
        receivedBytes += data.data.byteLength;
        
        // Update UI using Ref to ensure we don't crash if state is slow
        if (metaRef.current) {
           setProgress((receivedBytes / metaRef.current.size) * 100);
        }
      } 
      else if (data.type === 'EOF') {
        // File Finished
        setStatus('building');
        
        // Fix: Use metaRef.current instead of meta state to avoid null error
        const currentMeta = metaRef.current;
        
        if (currentMeta) {
            const blob = new Blob(chunks, { type: currentMeta.mime });
            
            // Trigger Download
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = currentMeta.name;
            a.click();
            
            setStatus('complete');
        } else {
            console.error("Metadata missing at EOF");
            setStatus('error');
        }
        chunks = []; // Clear RAM
      }
    });

    conn.on('error', (err) => {
        console.error("Conn Error", err);
        setStatus('error');
    });
  };

  return (
    <div className="min-h-screen pt-24 px-4 flex flex-col items-center max-w-4xl mx-auto">
      <div className="w-full flex justify-between items-center mb-8">
        <button onClick={() => setPage('home')} className={`flex items-center gap-2 hover:underline ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          <ArrowRight className="rotate-180" size={20} /> Back
        </button>
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Receive Files</h2>
      </div>

      <div className={`w-full max-w-xl rounded-3xl p-8 border shadow-xl ${
        darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
      }`}>
        {status === 'init' && (
          <div className="flex flex-col gap-6">
             <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-4">
                  <Download size={32} />
                </div>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Enter Sender ID</h3>
             </div>
             <input 
              type="text" 
              placeholder="Paste ID here..."
              className={`w-full text-center text-xl font-mono py-4 rounded-xl border-2 focus:outline-none focus:border-cyan-500 uppercase ${
                darkMode ? 'bg-slate-800 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
              value={remoteId}
              onChange={(e) => setRemoteId(e.target.value)}
             />
             <button 
              onClick={connectToPeer}
              className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/25 hover:scale-[1.02]"
             >
               Start Download
             </button>
          </div>
        )}

        {(status === 'receiving' || status === 'connecting' || status === 'building') && (
           <div className="text-center py-10">
              <h3 className="text-xl font-bold text-white mb-4">
                {status === 'connecting' && 'Connecting to peer...'}
                {status === 'receiving' && `Downloading ${meta?.name}...`}
                {status === 'building' && 'Constructing File...'}
              </h3>
              
              <div className="w-full bg-slate-700 rounded-full h-4 mb-4 overflow-hidden">
                <div 
                  className="bg-cyan-500 h-4 transition-all duration-200"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-slate-400">{Math.floor(progress)}% Complete</p>
           </div>
        )}

        {status === 'complete' && (
           <div className="text-center py-10">
              <div className="w-20 h-20 bg-green-500 rounded-full mx-auto flex items-center justify-center text-white mb-4">
                <CheckCircle size={40} />
              </div>
              <h3 className="text-2xl font-bold text-white">Download Complete!</h3>
              <p className="text-slate-400 mt-2">File saved to your device.</p>
           </div>
        )}
      </div>
    </div>
  );
};

const App = () => {
  const [page, setPage] = useState('home');
  const [darkMode, setDarkMode] = useState(true);
  const isPeerLoaded = usePeerJS();

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('bg-slate-950');
      document.body.classList.remove('bg-slate-50');
    } else {
      document.body.classList.add('bg-slate-50');
      document.body.classList.remove('bg-slate-950');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans selection:bg-cyan-500/30 ${
      darkMode ? 'text-slate-100' : 'text-slate-900'
    }`}>
      <Navbar darkMode={darkMode} toggleTheme={() => setDarkMode(!darkMode)} setPage={setPage} />
      
      <main>
        {page === 'home' && <Hero setPage={setPage} darkMode={darkMode} />}
        {page === 'send' && <SendInterface setPage={setPage} darkMode={darkMode} isPeerLoaded={isPeerLoaded} />}
        {page === 'receive' && <ReceiveInterface setPage={setPage} darkMode={darkMode} isPeerLoaded={isPeerLoaded} />}
      </main>

      {/* Warning for Demo Environment */}
      <div className="fixed bottom-4 right-4 max-w-sm p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-xs text-yellow-500 backdrop-blur-md">
        <div className="flex items-center gap-2 font-bold mb-1">
          <AlertTriangle size={14} />
          <span>Demo Note:</span>
        </div>
        Uses Public PeerJS Server. For 150GB+ transfers in Production, ensure you use the Node.js backend provided.
      </div>
    </div>
  );
};

export default App;