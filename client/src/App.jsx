import React, { useState, useEffect, useRef } from 'react';
import { 
  Moon, Sun, Upload, Download, Zap, 
  CheckCircle, ArrowRight, Wifi, Copy, 
  File, AlertTriangle, X, Shield, Lock, 
  Globe, Server, Cpu, Heart, Share2, EyeOff
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

// --- UI COMPONENTS ---

const Navbar = ({ darkMode, toggleTheme, setPage, page }) => {
  
  // Function to handle smooth scrolling
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

  // ✅ LOGO CLICK FUNCTION (New Update)
  const handleLogoClick = () => {
    setPage('home'); // Home page par le jayega
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Page ko top par scroll karega
  };

  return (
    <nav className={`fixed top-0 w-full z-50 backdrop-blur-md border-b transition-colors duration-300 ${
      darkMode ? 'bg-slate-900/90 border-slate-700 text-white' : 'bg-white/90 border-slate-200 text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* ✅ LOGO SECTION - Yahan change kiya hai */}
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={handleLogoClick} // <--- Yahan click function call kiya
          >
            <div className="bg-gradient-to-tr from-cyan-400 to-blue-600 p-2 rounded-lg group-hover:rotate-12 transition-transform">
              <Zap size={24} className="text-white" fill="currentColor" />
            </div>
            <span className="font-bold text-2xl tracking-tighter hidden sm:block">
              Flash<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Share</span>
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              <button onClick={() => handleNavClick('how-it-works')} className="hover:text-cyan-500 transition-colors">How it Works</button>
              <button onClick={() => handleNavClick('security')} className="hover:text-cyan-500 transition-colors">Security</button>
              <button onClick={() => handleNavClick('about')} className="hover:text-cyan-500 transition-colors">About</button>
          </div>

          {/* Controls */}
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
};

const Footer = ({ darkMode }) => (
  <footer className={`py-8 border-t ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
    <div className="max-w-7xl mx-auto px-4 text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Zap size={20} className="text-cyan-500" />
        <span className={`font-bold text-xl ${darkMode ? 'text-white' : 'text-slate-900'}`}>FlashShare</span>
      </div>
      
      <p className={`text-sm mb-6 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
        Secure, Peer-to-Peer file sharing directly in your browser.
      </p>

      {/* Styled Signature */}
      <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
        <span className="text-slate-400 text-sm">Developed & Designed by</span>
        <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 animate-pulse">
          @hiren hadiya
        </span>
        <Heart size={14} className="text-red-500 fill-red-500 animate-bounce" />
      </div>
    </div>
  </footer>
);

// --- LANDING SECTIONS ---

const Hero = ({ setPage, darkMode }) => (
  <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
    {/* Background Glows */}
    <div className="absolute top-20 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl mix-blend-screen" />
    <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl mix-blend-screen" />

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-bold tracking-wide uppercase mb-6">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
        V2.0 Now Live
      </div>
      
      <h1 className={`text-5xl md:text-7xl font-extrabold tracking-tight mb-8 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
        Share Files at <br className="hidden md:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
          Light Speed
        </span>
      </h1>
      
      <p className={`max-w-2xl mx-auto text-lg mb-10 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
        Unlimited size. Direct P2P transfer. No servers. No limits. <br/>
        Securely share files directly between devices properly.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button 
          onClick={() => setPage('send')}
          className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-cyan-500/25 hover:scale-105 transition-all w-full sm:w-auto flex items-center justify-center gap-2"
        >
          <Upload size={24} className="group-hover:-translate-y-1 transition-transform" /> 
          <span>Send File</span>
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

const HowItWorks = ({ darkMode }) => (
  // Added ID here for navigation
  <section id="how-it-works" className={`py-20 ${darkMode ? 'bg-slate-900/50' : 'bg-slate-100/50'}`}>
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>How It Works</h2>
        <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Share files in 3 simple steps without uploading to any cloud.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          { icon: <File size={32} />, title: "1. Select File", desc: "Choose any file from your device. No size limits." },
          { icon: <Share2 size={32} />, title: "2. Connect", desc: "Share the unique Connection ID with the receiver." },
          { icon: <Download size={32} />, title: "3. Transfer", desc: "Peer-to-peer stream starts instantly & securely." }
        ].map((step, idx) => (
          <div key={idx} className={`p-8 rounded-2xl border transition-all hover:-translate-y-2 ${
            darkMode ? 'bg-slate-800 border-slate-700 hover:border-cyan-500/50' : 'bg-white border-slate-200 hover:border-cyan-500/50'
          }`}>
            <div className="w-16 h-16 bg-cyan-500/10 text-cyan-500 rounded-2xl flex items-center justify-center mb-6 text-2xl">
              {step.icon}
            </div>
            <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{step.title}</h3>
            <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const SecuritySection = ({ darkMode }) => (
  // Added ID here for navigation
  <section id="security" className="py-20">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold uppercase mb-6">
            <Shield size={14} /> Security First
          </div>
          <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            End-to-End Encrypted. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Private by Design.</span>
          </h2>
          <p className={`text-lg mb-8 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            FlashShare uses WebRTC technology to create a direct tunnel between devices. 
            Your files never touch our servers. They fly directly from your device to your friend's device.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: <EyeOff size={20} />, text: "No Server Storage" },
              { icon: <Lock size={20} />, text: "DTLS 1.2 Encryption" },
              { icon: <Globe size={20} />, text: "Direct P2P Link" },
              { icon: <Cpu size={20} />, text: "Browser Sandbox" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-800 text-cyan-500">{item.icon}</div>
                <span className={`font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex justify-center">
            <div className={`relative w-80 h-80 rounded-full border-4 flex items-center justify-center ${
                darkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'
            }`}>
                 <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-[spin_10s_linear_infinite]"></div>
                 <Shield size={120} className="text-cyan-500/20" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <Lock size={64} className="text-cyan-500" />
                 </div>
                 {/* Floating Badges */}
                 <div className="absolute -top-4 right-10 bg-green-500 text-white text-xs px-3 py-1 rounded-full shadow-lg">AES-256</div>
                 <div className="absolute bottom-10 -left-6 bg-blue-500 text-white text-xs px-3 py-1 rounded-full shadow-lg">No Logs</div>
            </div>
        </div>
      </div>
    </div>
  </section>
);

const AboutSection = ({ darkMode }) => (
    // Added ID here for navigation
    <section id="about" className={`py-20 ${darkMode ? 'bg-slate-900/50' : 'bg-slate-100/50'}`}>
        <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>About FlashShare</h2>
            <p className={`text-lg leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                FlashShare was built to solve a simple problem: sending large files shouldn't require creating accounts, 
                uploading to a third-party cloud, or paying for "pro" features. By leveraging modern browser capabilities 
                like WebRTC, we allow users to connect directly. This project is open-source and dedicated to privacy.
            </p>
        </div>
    </section>
);

// --- FUNCTIONAL COMPONENTS (SEND/RECEIVE LOGIC) ---

const SendInterface = ({ setPage, darkMode, isPeerLoaded }) => {
  const [file, setFile] = useState(null);
  const [peerId, setPeerId] = useState('');
  const [status, setStatus] = useState('init'); 
  const [progress, setProgress] = useState(0);
  const peerRef = useRef(null);
  const fileRef = useRef(null);
  
  useEffect(() => { fileRef.current = file; }, [file]);

  useEffect(() => {
    if (!isPeerLoaded) return;
    const peer = new window.Peer(undefined, { debug: 2 });

    peer.on('open', (id) => {
      setPeerId(id);
      setStatus('ready');
    });

    peer.on('connection', (conn) => {
      if (fileRef.current) {
        setStatus('transferring');
        setTimeout(() => transferFile(conn, fileRef.current), 500);
      }
    });

    peerRef.current = peer;
    return () => { if (peerRef.current) peerRef.current.destroy(); };
  }, [isPeerLoaded, file]); // Re-bind if file selected

  const transferFile = (conn, currentFile) => {
    conn.send({
      type: 'METADATA',
      name: currentFile.name,
      size: currentFile.size,
      mime: currentFile.type
    });

    const CHUNK_SIZE = 16384; 
    let offset = 0;
    const reader = new FileReader();

    reader.onload = (e) => {
      if (!conn.open) return;
      conn.send({ type: 'CHUNK', data: e.target.result });
      offset += CHUNK_SIZE;
      setProgress(Math.min(100, (offset / currentFile.size) * 100));

      if (offset < currentFile.size) {
        if (conn.dataChannel.bufferedAmount > 10 * 1024 * 1024) {
           setTimeout(readNextChunk, 100);
        } else {
           setTimeout(readNextChunk, 0); 
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
               <div className="w-full bg-slate-700 h-4 rounded-full overflow-hidden mt-4">
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

const ReceiveInterface = ({ setPage, darkMode, isPeerLoaded }) => {
  const [remoteId, setRemoteId] = useState('');
  const [status, setStatus] = useState('init');
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState('');
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
              type="text" placeholder="Enter Sender ID"
              className={`w-full text-center text-xl font-mono py-4 rounded-xl border-2 uppercase ${darkMode ? 'bg-slate-800 text-white' : 'bg-slate-50 text-black'}`}
              value={remoteId} onChange={(e) => setRemoteId(e.target.value)}
             />
             <button onClick={connectToPeer} className="w-full py-4 rounded-xl font-bold text-lg bg-cyan-500 text-white hover:bg-cyan-600 transition-colors">
               Start Download
             </button>
          </div>
        )}
        {(status === 'receiving' || status === 'connecting') && (
           <div className="text-center py-10">
              <h3 className={`text-xl font-bold mb-4 ${darkMode?'text-white':'text-black'}`}>{status === 'connecting' ? 'Connecting...' : `Downloading ${fileName}...`}</h3>
              <div className="w-full bg-slate-700 rounded-full h-4 mb-4 overflow-hidden">
                <div className="bg-cyan-500 h-4 transition-all" style={{ width: `${progress}%` }}></div>
              </div>
           </div>
        )}
        {status === 'complete' && (
           <div className="text-center py-10 text-green-500 font-bold text-2xl">
              <CheckCircle size={50} className="mx-auto mb-4" /> Download Complete!
           </div>
        )}
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

const App = () => {
  const [page, setPage] = useState('home');
  const [darkMode, setDarkMode] = useState(true);
  const isPeerLoaded = usePeerJS();

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#0f172a' : '#f8fafc';
  }, [darkMode]);

  return (
    <div className={`min-h-screen font-sans ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
      {/* Navbar ko 'page' aur 'setPage' dono pass kiye hain taaki navigation logic chal sake */}
      <Navbar darkMode={darkMode} toggleTheme={() => setDarkMode(!darkMode)} setPage={setPage} page={page} />
      
      {/* Home Page Layout */}
      {page === 'home' && (
        <>
          <Hero setPage={setPage} darkMode={darkMode} />
          <HowItWorks darkMode={darkMode} />
          <SecuritySection darkMode={darkMode} />
          <AboutSection darkMode={darkMode} />
          <Footer darkMode={darkMode} />
        </>
      )}

      {/* Logic Pages */}
      {page === 'send' && <SendInterface setPage={setPage} darkMode={darkMode} isPeerLoaded={isPeerLoaded} />}
      {page === 'receive' && <ReceiveInterface setPage={setPage} darkMode={darkMode} isPeerLoaded={isPeerLoaded} />}
    </div>
  );
};

export default App;