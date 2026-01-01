import React, { useState, useEffect, useRef } from 'react';
import { 
  Moon, Sun, Upload, Download, Zap, 
  CheckCircle, ArrowRight, Wifi, Copy, 
  File, AlertTriangle, X
} from 'lucide-react';
import './App.css';

// CDN Link for PeerJS
const PEERJS_CDN = "https://unpkg.com/peerjs@1.5.2/dist/peerjs.min.js";

/**
 * Hook to load PeerJS script
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
  </nav>
);

const Hero = ({ setPage, darkMode }) => (
  <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
      <h1 className={`text-5xl md:text-7xl font-extrabold tracking-tight mb-8 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
        Transfer Files <br className="hidden md:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
          Instantly
        </span>
      </h1>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button 
          onClick={() => setPage('send')}
          className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-bold text-lg shadow-lg hover:scale-105 transition-all w-full sm:w-auto flex items-center justify-center gap-2"
        >
          <Upload size={24} /> <span>Send File</span>
        </button>
        <button 
          onClick={() => setPage('receive')}
          className={`px-8 py-4 rounded-xl font-bold text-lg border-2 transition-all w-full sm:w-auto flex items-center justify-center gap-2 ${
            darkMode ? 'border-slate-700 text-white hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Download size={24} /> <span>Receive File</span>
        </button>
      </div>
    </div>
  </div>
);

// --- SENDER COMPONENT ---

const SendInterface = ({ setPage, darkMode, isPeerLoaded }) => {
  const [file, setFile] = useState(null);
  const [peerId, setPeerId] = useState('');
  const [status, setStatus] = useState('init'); 
  const [progress, setProgress] = useState(0);
  
  // Refs needed for event listeners
  const peerRef = useRef(null);
  
  useEffect(() => {
    if (!isPeerLoaded) return;

    // Use Public PeerJS Server (Most reliable for demos)
    const peer = new window.Peer(undefined, {
      debug: 2
    });

    peer.on('open', (id) => {
      setPeerId(id);
      setStatus('ready');
    });

    peer.on('connection', (conn) => {
      setStatus('transferring');
      // Wait a bit for connection to stabilize
      setTimeout(() => startTransfer(conn), 500);
    });

    peer.on('error', (err) => {
      console.error(err);
      setStatus('error');
    });

    peerRef.current = peer;

    return () => {
      if (peerRef.current) peerRef.current.destroy();
    };
  }, [isPeerLoaded]);

  const startTransfer = (conn) => {
    // Access current file from state (needs a ref if using inside callback, but we pass it directly here via closure if triggered immediately, 
    // BUT since this is triggered by event, we rely on the closure scope. 
    // To be safe, we check if file exists.)
    // *Correction*: Since `file` is in state, and `useEffect` runs once, `file` might be null inside the `peer.on` closure.
    // However, we only need `file` when we actually start sending.
    // Let's use a Ref for file to access it inside the connection callback safely.
  };
  
  // We need a ref for the file because the 'connection' event listener is established 
  // when the component mounts (when file is null), so it closes over null.
  const fileRef = useRef(null);
  useEffect(() => { fileRef.current = file; }, [file]);

  // Re-bind connection logic to ensure it has access to the latest file
  useEffect(() => {
    if(!peerRef.current) return;
    
    // Remove old listeners to prevent duplicates if file changes (simple approach)
    peerRef.current.off('connection');
    
    peerRef.current.on('connection', (conn) => {
       if (fileRef.current) {
         setStatus('transferring');
         setTimeout(() => transferFile(conn, fileRef.current), 500);
       }
    });
  }, [file, status]); // Re-run if file changes


  const transferFile = (conn, currentFile) => {
    // 1. Send Metadata
    conn.send({
      type: 'METADATA',
      name: currentFile.name,
      size: currentFile.size,
      mime: currentFile.type
    });

    // 2. Chunking Logic
    const CHUNK_SIZE = 16384; // 16KB (Safe limit for WebRTC)
    let offset = 0;
    
    const reader = new FileReader();

    reader.onload = (e) => {
      if (!conn.open) return;
      
      conn.send({
        type: 'CHUNK',
        data: e.target.result // ArrayBuffer
      });

      offset += CHUNK_SIZE;
      const percent = Math.min(100, (offset / currentFile.size) * 100);
      setProgress(percent);

      if (offset < currentFile.size) {
        // Backpressure Check: prevent browser crash
        if (conn.dataChannel.bufferedAmount > 10 * 1024 * 1024) { // 10MB limit
           setTimeout(readNextChunk, 100);
        } else {
           setTimeout(readNextChunk, 0); // Next tick
        }
      } else {
        conn.send({ type: 'EOF' });
        setStatus('complete');
      }
    };

    const readNextChunk = () => {
      const slice = currentFile.slice(offset, offset + CHUNK_SIZE);
      reader.readAsArrayBuffer(slice);
    };

    readNextChunk();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(peerId);
    alert("ID Copied!");
  };

  return (
    <div className="min-h-screen pt-24 px-4 flex flex-col items-center max-w-4xl mx-auto">
      <div className="w-full flex justify-between items-center mb-8">
        <button onClick={() => setPage('home')} className={`flex items-center gap-2 hover:underline ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          <ArrowRight className="rotate-180" size={20} /> Back
        </button>
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Send Files</h2>
      </div>

      <div className={`w-full max-w-2xl rounded-3xl p-8 border-2 border-dashed ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'}`}>
        {!file ? (
           <div className="flex flex-col items-center justify-center py-20 cursor-pointer" onClick={() => document.getElementById('f').click()}>
             <input type="file" id="f" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
             <Upload size={40} className="text-cyan-500 mb-4"/>
             <h3 className={`text-xl font-bold ${darkMode?'text-white':'text-black'}`}>Click to Select File</h3>
           </div>
        ) : (
          <div className="text-center">
             <h3 className={`font-bold mb-4 ${darkMode?'text-white':'text-black'}`}>{file.name}</h3>
             
             {status === 'ready' && (
               <div className="bg-slate-800 p-4 rounded-xl mb-4 flex justify-between items-center">
                 <code className="text-cyan-400 text-xl font-mono">{peerId}</code>
                 <button onClick={copyToClipboard}><Copy className="text-white" size={20}/></button>
               </div>
             )}

             {status === 'transferring' && (
               <div className="w-full bg-gray-700 h-4 rounded-full overflow-hidden">
                 <div className="bg-cyan-500 h-full transition-all" style={{width: `${progress}%`}}></div>
               </div>
             )}

             {status === 'complete' && (
               <div className="text-green-500 font-bold flex items-center justify-center gap-2 mt-4">
                 <CheckCircle /> Sent Successfully!
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

// --- RECEIVER COMPONENT (FIXED) ---

const ReceiveInterface = ({ setPage, darkMode, isPeerLoaded }) => {
  const [remoteId, setRemoteId] = useState('');
  const [status, setStatus] = useState('init');
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  
  // CRITICAL FIX: Use Refs for data buffers
  // State is too slow for high-speed network packets
  const chunksRef = useRef([]);
  const receivedSizeRef = useRef(0);
  const metaRef = useRef(null);
  const peerRef = useRef(null);

  useEffect(() => {
    if (!isPeerLoaded) return;
    const peer = new window.Peer();
    peer.on('open', (id) => console.log('My ID:', id));
    peerRef.current = peer;
    return () => peer.destroy();
  }, [isPeerLoaded]);

  const connectToPeer = () => {
    if (!remoteId) return;
    setStatus('connecting');

    const conn = peerRef.current.connect(remoteId, {
      reliable: true
    });

    conn.on('open', () => {
      setStatus('connected');
      console.log("Connected to Sender");
    });

    conn.on('data', (data) => {
      // 1. Handle Metadata
      if (data.type === 'METADATA') {
        metaRef.current = data;
        chunksRef.current = []; // Reset Buffer
        receivedSizeRef.current = 0;
        setFileName(data.name);
        setStatus('receiving');
      } 
      // 2. Handle File Chunk
      else if (data.type === 'CHUNK') {
        chunksRef.current.push(data.data); // Store in REF immediately
        receivedSizeRef.current += data.data.byteLength;
        
        // Update UI Progress safely
        if (metaRef.current) {
           const percent = (receivedSizeRef.current / metaRef.current.size) * 100;
           setProgress(percent);
        }
      } 
      // 3. Handle End of File
      else if (data.type === 'EOF') {
        downloadFile();
        setStatus('complete');
      }
    });
    
    conn.on('close', () => console.log("Connection closed"));
    conn.on('error', (err) => { console.error(err); setStatus('error'); });
  };

  const downloadFile = () => {
    if (!metaRef.current) return;
    const blob = new Blob(chunksRef.current, { type: metaRef.current.mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = metaRef.current.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Clear memory
    chunksRef.current = [];
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
             <input 
              type="text" 
              placeholder="Enter Sender ID"
              className={`w-full text-center text-xl font-mono py-4 rounded-xl border-2 uppercase ${darkMode ? 'bg-slate-800 text-white' : 'bg-slate-50 text-black'}`}
              value={remoteId}
              onChange={(e) => setRemoteId(e.target.value)}
             />
             <button 
              onClick={connectToPeer}
              className="w-full py-4 rounded-xl font-bold text-lg bg-cyan-500 text-white hover:bg-cyan-600 transition-colors"
             >
               Start Download
             </button>
          </div>
        )}

        {(status === 'receiving' || status === 'connecting') && (
           <div className="text-center py-10">
              <h3 className={`text-xl font-bold mb-4 ${darkMode?'text-white':'text-black'}`}>
                {status === 'connecting' ? 'Connecting...' : `Downloading ${fileName}...`}
              </h3>
              <div className="w-full bg-slate-700 rounded-full h-4 mb-4 overflow-hidden">
                <div className="bg-cyan-500 h-4 transition-all duration-200" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="text-slate-400">{Math.floor(progress)}%</p>
           </div>
        )}

        {status === 'complete' && (
           <div className="text-center py-10">
              <div className="w-20 h-20 bg-green-500 rounded-full mx-auto flex items-center justify-center text-white mb-4">
                <CheckCircle size={40} />
              </div>
              <h3 className={`text-2xl font-bold ${darkMode?'text-white':'text-black'}`}>Download Complete!</h3>
              <button onClick={() => window.location.reload()} className="mt-4 text-cyan-500 hover:underline">Receive Another</button>
           </div>
        )}
      </div>
    </div>
  );
};

// --- APP SHELL ---

const App = () => {
  const [page, setPage] = useState('home');
  const [darkMode, setDarkMode] = useState(true);
  const isPeerLoaded = usePeerJS();

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#0f172a' : '#f8fafc';
  }, [darkMode]);

  return (
    <div className={`min-h-screen font-sans ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
      <Navbar darkMode={darkMode} toggleTheme={() => setDarkMode(!darkMode)} setPage={setPage} />
      {page === 'home' && <Hero setPage={setPage} darkMode={darkMode} />}
      {page === 'send' && <SendInterface setPage={setPage} darkMode={darkMode} isPeerLoaded={isPeerLoaded} />}
      {page === 'receive' && <ReceiveInterface setPage={setPage} darkMode={darkMode} isPeerLoaded={isPeerLoaded} />}
    </div>
  );
};

export default App;