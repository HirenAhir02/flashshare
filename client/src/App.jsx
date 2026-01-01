import React, { useState, useEffect, useRef } from 'react';
import { 
  Moon, Sun, Upload, Download, Zap, 
  CheckCircle, ArrowRight, Wifi, Copy, 
  File, AlertTriangle, X, Shield, Lock, 
  Globe, Server, Cpu, Heart, Share2, EyeOff, 
  AlertOctagon
} from 'lucide-react';
import './App.css';

const PEERJS_CDN = "https://unpkg.com/peerjs@1.5.2/dist/peerjs.min.js";

// --- HOOKS ---
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

// --- MODAL COMPONENT (New) ---
const ConfirmModal = ({ isOpen, onConfirm, onCancel, darkMode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm transition-all animate-in fade-in">
      <div className={`w-full max-w-sm p-6 rounded-2xl shadow-2xl scale-100 animate-in zoom-in-95 duration-200 ${darkMode ? 'bg-slate-900 border border-slate-700' : 'bg-white'}`}>
        <div className="flex flex-col items-center text-center gap-4">
          <div className="p-3 bg-red-500/10 rounded-full text-red-500">
            <AlertOctagon size={32} />
          </div>
          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Stop Transfer?</h3>
          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            File transfer is currently in progress. If you leave now, the process will be cancelled.
          </p>
          <div className="flex gap-3 w-full mt-2">
            <button 
              onClick={onCancel}
              className={`flex-1 py-3 rounded-xl font-semibold ${darkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
            >
              Continue
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 py-3 rounded-xl font-semibold bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20"
            >
              Yes, Stop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- NAVBAR ---
const Navbar = ({ darkMode, toggleTheme, setPage, page }) => {
  const handleNavClick = (sectionId) => {
    if (page !== 'home') {
      setPage('home');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogoClick = () => {
    setPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className={`fixed top-0 w-full z-50 backdrop-blur-md border-b transition-colors duration-300 ${
      darkMode ? 'bg-slate-900/90 border-slate-700 text-white' : 'bg-white/90 border-slate-200 text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 cursor-pointer group select-none" onClick={handleLogoClick}>
            <div className="bg-gradient-to-tr from-cyan-400 to-blue-600 p-2 rounded-lg group-hover:rotate-12 transition-transform">
              <Zap size={24} className="text-white" fill="currentColor" />
            </div>
            <span className="font-bold text-xl md:text-2xl tracking-tighter">
              Flash<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Share</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              <button onClick={() => handleNavClick('how-it-works')} className="hover:text-cyan-500 transition-colors">How it Works</button>
              <button onClick={() => handleNavClick('security')} className="hover:text-cyan-500 transition-colors">Security</button>
              <button onClick={() => handleNavClick('about')} className="hover:text-cyan-500 transition-colors">About</button>
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
};

// --- FOOTER ---
const Footer = ({ darkMode }) => (
  <footer className={`py-8 border-t ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
    <div className="max-w-7xl mx-auto px-4 text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Zap size={20} className="text-cyan-500" />
        <span className={`font-bold text-xl ${darkMode ? 'text-white' : 'text-slate-900'}`}>FlashShare</span>
      </div>
      <p className={`text-sm mb-6 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Secure, Peer-to-Peer file sharing directly in your browser.</p>
      <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm max-w-full">
        <span className="text-slate-400 text-sm whitespace-nowrap">Designed by</span>
        <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 animate-pulse whitespace-nowrap">@hiren hadiya</span>
        <Heart size={14} className="text-red-500 fill-red-500 animate-bounce" />
      </div>
    </div>
  </footer>
);

// --- SECTIONS ---
const Hero = ({ setPage, darkMode }) => (
  <div className="relative pt-24 pb-12 lg:pt-48 lg:pb-32 overflow-hidden px-4">
    <div className="absolute top-20 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-cyan-500/20 rounded-full blur-3xl mix-blend-screen" />
    <div className="absolute bottom-10 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-blue-600/20 rounded-full blur-3xl mix-blend-screen" />
    <div className="relative max-w-7xl mx-auto text-center z-10">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-bold tracking-wide uppercase mb-6">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>V2.0 Now Live
      </div>
      <h1 className={`text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6 md:mb-8 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
        Share Files at <br className="hidden md:block" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">Light Speed</span>
      </h1>
      <p className={`max-w-2xl mx-auto text-base md:text-lg mb-8 md:mb-10 px-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
        Unlimited size. Direct P2P transfer. No servers.<br className="hidden sm:block"/> Securely share files directly between devices.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full px-4 sm:px-0">
        <button onClick={() => setPage('send')} className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-cyan-500/25 active:scale-95 transition-all w-full sm:w-auto flex items-center justify-center gap-2">
          <Upload size={24} className="group-hover:-translate-y-1 transition-transform" /><span>Send File</span>
        </button>
        <button onClick={() => setPage('receive')} className={`px-8 py-4 rounded-xl font-bold text-lg border-2 transition-all w-full sm:w-auto flex items-center justify-center gap-2 ${darkMode ? 'border-slate-700 text-white hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
          <Download size={24} /><span>Receive File</span>
        </button>
      </div>
    </div>
  </div>
);

const HowItWorks = ({ darkMode }) => (
  <section id="how-it-works" className={`py-16 md:py-20 ${darkMode ? 'bg-slate-900/50' : 'bg-slate-100/50'}`}>
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className={`text-2xl md:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>How It Works</h2>
        <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Share files in 3 simple steps.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {[
          { icon: <File size={32} />, title: "1. Select File", desc: "Choose any file. No size limits." },
          { icon: <Share2 size={32} />, title: "2. Connect", desc: "Share the ID with receiver." },
          { icon: <Download size={32} />, title: "3. Transfer", desc: "Transfer starts instantly." }
        ].map((step, idx) => (
          <div key={idx} className={`p-6 md:p-8 rounded-2xl border transition-all ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="w-14 h-14 md:w-16 md:h-16 bg-cyan-500/10 text-cyan-500 rounded-2xl flex items-center justify-center mb-4 md:mb-6 text-2xl">{step.icon}</div>
            <h3 className={`text-lg md:text-xl font-bold mb-2 md:mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{step.title}</h3>
            <p className={`text-sm md:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const SecuritySection = ({ darkMode }) => (
  <section id="security" className="py-16 md:py-20 overflow-hidden">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold uppercase mb-4 md:mb-6"><Shield size={14} /> Security First</div>
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 md:mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>End-to-End Encrypted. <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Private by Design.</span></h2>
          <p className={`text-base md:text-lg mb-8 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Your files never touch our servers. They fly directly from your device to your friend's device via WebRTC.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 max-w-sm mx-auto md:mx-0">
            {[{ icon: <EyeOff size={18} />, text: "No Server Storage" }, { icon: <Lock size={18} />, text: "DTLS 1.2 Encryption" }, { icon: <Globe size={18} />, text: "Direct P2P Link" }, { icon: <Cpu size={18} />, text: "Browser Sandbox" }].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-800 text-cyan-500">{item.icon}</div><span className={`text-sm md:text-base font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex justify-center mt-8 md:mt-0">
            <div className={`relative w-64 h-64 md:w-80 md:h-80 rounded-full border-4 flex items-center justify-center ${darkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
                 <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-[spin_10s_linear_infinite]"></div>
                 <Shield size={80} className="text-cyan-500/20 md:scale-150 scale-100" />
                 <div className="absolute inset-0 flex items-center justify-center"><Lock size={48} className="text-cyan-500 md:scale-125 scale-100" /></div>
            </div>
        </div>
      </div>
    </div>
  </section>
);

const AboutSection = ({ darkMode }) => (
    <section id="about" className={`py-16 md:py-20 ${darkMode ? 'bg-slate-900/50' : 'bg-slate-100/50'}`}>
        <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className={`text-2xl md:text-3xl font-bold mb-4 md:mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>About FlashShare</h2>
            <p className={`text-base md:text-lg leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>FlashShare solves the problem of file sharing without accounts, clouds, or limits. Built for speed and privacy.</p>
        </div>
    </section>
);

// --- SENDER INTERFACE (With Interrupt Modal) ---
const SendInterface = ({ setPage, darkMode, isPeerLoaded }) => {
  const [file, setFile] = useState(null);
  const [peerId, setPeerId] = useState('');
  const [status, setStatus] = useState('init'); 
  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const peerRef = useRef(null);
  const fileRef = useRef(null);
  
  useEffect(() => { fileRef.current = file; }, [file]);

  // Prevent browser close
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (status === 'transferring') {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [status]);

  useEffect(() => {
    if (!isPeerLoaded) return;
    const peer = new window.Peer(undefined, { debug: 2 });
    peer.on('open', (id) => { setPeerId(id); setStatus('ready'); });
    peer.on('connection', (conn) => {
      if (fileRef.current) {
        setStatus('transferring');
        setTimeout(() => transferFile(conn, fileRef.current), 500);
      }
    });
    peerRef.current = peer;
    return () => { if (peerRef.current) peerRef.current.destroy(); };
  }, [isPeerLoaded, file]);

  const transferFile = (conn, currentFile) => {
    conn.send({ type: 'METADATA', name: currentFile.name, size: currentFile.size, mime: currentFile.type });
    const CHUNK_SIZE = 16384; 
    let offset = 0;
    const reader = new FileReader();

    reader.onload = (e) => {
      if (!conn.open) return;
      conn.send({ type: 'CHUNK', data: e.target.result });
      offset += CHUNK_SIZE;
      
      const buffered = conn.dataChannel.bufferedAmount || 0;
      const sentBytes = offset - buffered;
      const percent = Math.min(100, (sentBytes / currentFile.size) * 100);
      setProgress(percent);

      if (offset < currentFile.size) {
        // Stop if disconnected
        if (!peerRef.current || peerRef.current.destroyed) return;

        if (conn.dataChannel.bufferedAmount > 64 * 1024) {
           setTimeout(readNextChunk, 50); 
        } else {
           setTimeout(readNextChunk, 0); 
        }
      } else {
        const checkBufferInterval = setInterval(() => {
            if (!peerRef.current || peerRef.current.destroyed) { clearInterval(checkBufferInterval); return; }
            const currentBuffered = conn.dataChannel.bufferedAmount || 0;
            const finalSentBytes = currentFile.size - currentBuffered;
            setProgress((finalSentBytes / currentFile.size) * 100);

            if (currentBuffered === 0) {
              clearInterval(checkBufferInterval);
              conn.send({ type: 'EOF' });
              setProgress(100);
              setStatus('complete');
            }
        }, 100);
      }
    };

    const readNextChunk = () => {
        if (!peerRef.current || peerRef.current.destroyed) return;
        if (conn.dataChannel.bufferedAmount > 64 * 1024) {
             const buffered = conn.dataChannel.bufferedAmount || 0;
             const sentBytes = offset - buffered;
             setProgress((sentBytes / currentFile.size) * 100);
             setTimeout(readNextChunk, 50);
             return;
        }
      const slice = currentFile.slice(offset, offset + CHUNK_SIZE);
      reader.readAsArrayBuffer(slice);
    };
    readNextChunk();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(peerId);
    alert("ID Copied!");
  };

  const handleBack = () => {
    if (status === 'transferring') {
      setShowModal(true);
    } else {
      setPage('home');
    }
  };

  const confirmCancel = () => {
    if (peerRef.current) peerRef.current.destroy();
    setPage('home');
  };

  return (
    <>
      <ConfirmModal 
        isOpen={showModal} 
        onCancel={() => setShowModal(false)} 
        onConfirm={confirmCancel} 
        darkMode={darkMode} 
      />
      <div className="min-h-screen pt-20 px-4 flex flex-col items-center max-w-4xl mx-auto w-full">
        <div className="w-full flex justify-between items-center mb-8">
          <button onClick={handleBack} className={`flex items-center gap-2 hover:underline ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            <ArrowRight className="rotate-180" size={20} /> Back
          </button>
          <h2 className={`text-xl md:text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Send Files</h2>
        </div>

        <div className={`w-full max-w-2xl rounded-3xl p-6 md:p-8 border-2 border-dashed ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'}`}>
          {!file ? (
             <div className="flex flex-col items-center justify-center py-12 md:py-20 cursor-pointer text-center" onClick={() => document.getElementById('f').click()}>
               <input type="file" id="f" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
               <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mb-4"><Upload size={32} className="text-cyan-500"/></div>
               <h3 className={`text-lg md:text-xl font-bold ${darkMode?'text-white':'text-black'}`}>Click to Select File</h3>
               <p className="text-sm text-slate-500 mt-2">Supports Large Files</p>
             </div>
          ) : (
            <div className="text-center">
               <h3 className={`font-bold mb-4 break-words ${darkMode?'text-white':'text-black'}`}>{file.name}</h3>
               {status === 'ready' && (
                 <div className="bg-slate-800 p-4 rounded-xl mb-4 flex flex-col md:flex-row gap-3 justify-between items-center">
                   <span className="text-slate-400 text-sm">Share this ID:</span>
                   <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-lg w-full md:w-auto justify-between">
                      <code className="text-cyan-400 text-lg font-mono truncate">{peerId}</code>
                      <button onClick={copyToClipboard}><Copy className="text-white shrink-0" size={18}/></button>
                   </div>
                 </div>
               )}
               {status === 'transferring' && (
                 <div className="w-full bg-slate-700 h-4 rounded-full overflow-hidden mt-4">
                   <div className="bg-cyan-500 h-full transition-all duration-75" style={{width: `${progress}%`}}></div>
                   <p className="text-slate-400 text-sm mt-2">{`${Math.floor(progress)}% Sent`}</p>
                 </div>
               )}
               {status === 'complete' && (
                 <div className="text-green-500 font-bold flex items-center justify-center gap-2 mt-4"><CheckCircle /> Sent Successfully!</div>
               )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// --- RECEIVER INTERFACE (With Interrupt Modal) ---
const ReceiveInterface = ({ setPage, darkMode, isPeerLoaded }) => {
  const [remoteId, setRemoteId] = useState('');
  const [status, setStatus] = useState('init');
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  const chunksRef = useRef([]);
  const receivedSizeRef = useRef(0);
  const metaRef = useRef(null);
  const peerRef = useRef(null);

  useEffect(() => {
    if (!isPeerLoaded) return;
    const peer = new window.Peer();
    peerRef.current = peer;
    return () => peer.destroy();
  }, [isPeerLoaded]);

  // Prevent browser close
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (status === 'receiving') {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [status]);

  const connectToPeer = () => {
    if (!remoteId) return;
    setStatus('connecting');
    const conn = peerRef.current.connect(remoteId, { reliable: true });
    conn.on('open', () => setStatus('connected'));
    conn.on('data', (data) => {
      if (data.type === 'METADATA') {
        metaRef.current = data;
        chunksRef.current = [];
        receivedSizeRef.current = 0;
        setFileName(data.name);
        setStatus('receiving');
      } else if (data.type === 'CHUNK') {
        chunksRef.current.push(data.data);
        receivedSizeRef.current += data.data.byteLength;
        if (metaRef.current) setProgress((receivedSizeRef.current / metaRef.current.size) * 100);
      } else if (data.type === 'EOF') {
        downloadFile();
        setStatus('complete');
      }
    });
  };

  const downloadFile = () => {
    const blob = new Blob(chunksRef.current, { type: metaRef.current.mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = metaRef.current.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleBack = () => {
    if (status === 'receiving') {
      setShowModal(true);
    } else {
      setPage('home');
    }
  };

  const confirmCancel = () => {
    if (peerRef.current) peerRef.current.destroy();
    setPage('home');
  };

  return (
    <>
      <ConfirmModal 
        isOpen={showModal} 
        onCancel={() => setShowModal(false)} 
        onConfirm={confirmCancel} 
        darkMode={darkMode} 
      />
      <div className="min-h-screen pt-20 px-4 flex flex-col items-center max-w-4xl mx-auto w-full">
        <div className="w-full flex justify-between items-center mb-8">
          <button onClick={handleBack} className={`flex items-center gap-2 hover:underline ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            <ArrowRight className="rotate-180" size={20} /> Back
          </button>
          <h2 className={`text-xl md:text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Receive Files</h2>
        </div>

        <div className={`w-full max-w-xl rounded-3xl p-6 md:p-8 border shadow-xl ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
          {status === 'init' && (
            <div className="flex flex-col gap-6">
               <input 
                type="text" placeholder="Enter Sender ID"
                className={`w-full text-center text-lg md:text-xl font-mono py-4 rounded-xl border-2 uppercase ${darkMode ? 'bg-slate-800 text-white' : 'bg-slate-50 text-black'}`}
                value={remoteId} onChange={(e) => setRemoteId(e.target.value)}
               />
               <button onClick={connectToPeer} className="w-full py-4 rounded-xl font-bold text-lg bg-cyan-500 text-white hover:bg-cyan-600 active:scale-95 transition-all">
                 Start Download
               </button>
            </div>
          )}
          {(status === 'receiving' || status === 'connecting') && (
             <div className="text-center py-10">
                <h3 className={`text-lg md:text-xl font-bold mb-4 ${darkMode?'text-white':'text-black'}`}>{status === 'connecting' ? 'Connecting...' : `Downloading ${fileName}...`}</h3>
                <div className="w-full bg-slate-700 rounded-full h-4 mb-4 overflow-hidden">
                  <div className="bg-cyan-500 h-4 transition-all" style={{ width: `${progress}%` }}></div>
                </div>
             </div>
          )}
          {status === 'complete' && (
             <div className="text-center py-10 text-green-500 font-bold text-xl md:text-2xl">
                <CheckCircle size={50} className="mx-auto mb-4" /> Download Complete!
             </div>
          )}
        </div>
      </div>
    </>
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
      <Navbar darkMode={darkMode} toggleTheme={() => setDarkMode(!darkMode)} setPage={setPage} page={page} />
      {page === 'home' && (
        <>
          <Hero setPage={setPage} darkMode={darkMode} />
          <HowItWorks darkMode={darkMode} />
          <SecuritySection darkMode={darkMode} />
          <AboutSection darkMode={darkMode} />
          <Footer darkMode={darkMode} />
        </>
      )}
      {page === 'send' && <SendInterface setPage={setPage} darkMode={darkMode} isPeerLoaded={isPeerLoaded} />}
      {page === 'receive' && <ReceiveInterface setPage={setPage} darkMode={darkMode} isPeerLoaded={isPeerLoaded} />}
    </div>
  );
};

export default App;