import React, { useState, useEffect, useRef } from 'react';
import { 
  Moon, Sun, Upload, Download, Zap, Share2, 
  ShieldCheck, File, X, CheckCircle, ArrowRight, 
  Menu, Cpu, Wifi, Globe, Copy, Lock, Server, EyeOff, Network,
  AlertTriangle
} from 'lucide-react';
import './App.css';

// PeerJS CDN
const PEERJS_CDN = "https://unpkg.com/peerjs@1.5.2/dist/peerjs.min.js";

// Dynamic PeerJS Loader
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

// --- Navbar Component ---
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

// --- Hero Section ---
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

// --- SEND INTERFACE ---
const SendInterface = ({ setPage, darkMode, isPeerLoaded }) => {
  const [file, setFile] = useState(null);
  const [peerId, setPeerId] = useState('');
  const [status, setStatus] = useState('init');
  const [progress, setProgress] = useState(0);
  const [peer, setPeer] = useState(null);
  const [conn, setConn] = useState(null);

  useEffect(() => {
    if (!isPeerLoaded) return;

    const p = new window.Peer(undefined, {
      host: 'flashshare-production.up.railway.app',
      port: 443,
      secure: true,
      path: '/peerjs',
      debug: 2
    });

    p.on('open', (id) => { setPeerId(id); setStatus('ready'); });
    p.on('error', (err) => { console.error('Peer Error:', err); setStatus('error'); });

    p.on('connection', (connection) => {
      setConn(connection);
      setStatus('waiting_ack');
      console.log("Receiver connected!");

      let offset = 0;
      const CHUNK_SIZE = 16 * 1024;

      const sendNextChunk = () => {
        if (!file || !connection.open) return;

        const slice = file.slice(offset, offset + CHUNK_SIZE);
        const reader = new FileReader();
        reader.onload = (e) => {
          connection.send({ type: 'CHUNK', data: e.target.result });
          offset += CHUNK_SIZE;
          const percent = Math.min(100, (offset / file.size) * 100);
          setProgress(percent);

          if (offset >= file.size) connection.send({ type: 'EOF' });
        };
        reader.readAsArrayBuffer(slice);
      };

      connection.on('data', (data) => { if (data?.type === 'ACK_CHUNK') sendNextChunk(); });
      connection.on('open', () => { console.log("Connection open, starting transfer..."); sendNextChunk(); });
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
    ta.value = text; ta.style.position="fixed"; ta.style.left="-9999px"; ta.style.top="0";
    document.body.appendChild(ta); ta.focus(); ta.select();
    try { document.execCommand('copy'); } catch(e){console.error(e);}
    document.body.removeChild(ta);
  };

  const startTransfer = () => {
    if (!conn || !file) return;
    setStatus('transferring');
    conn.send({ type:'METADATA', name:file.name, size:file.size, mime:file.type });
    const CHUNK_SIZE = 16*1024;
    let offset=0;
    const readSlice=(o)=>{
      const slice = file.slice(offset, o + CHUNK_SIZE);
      const reader = new FileReader();
      reader.onload = e => {
        if(!conn.open) return;
        conn.send({ type:'CHUNK', data:e.target.result });
        offset+=CHUNK_SIZE;
        setProgress(Math.min(100,(offset/file.size)*100));
        if(offset<file.size){
          if(conn.dataChannel.bufferedAmount>10*1024*1024)setTimeout(()=>readSlice(offset),100);
          else setTimeout(()=>readSlice(offset),0);
        } else conn.send({ type:'EOF' }); 
      };
      reader.readAsArrayBuffer(slice);
    };
    readSlice(0);
  };

  useEffect(()=>{
    if(status==='waiting_ack' && file && conn) setTimeout(startTransfer,500);
  },[status,file,conn]);

  return (
    <div className="min-h-screen pt-24 px-4 flex flex-col items-center max-w-4xl mx-auto">
      {/* UI code continues like your provided App */}
    </div>
  );
};

// --- RECEIVE INTERFACE ---
const ReceiveInterface = ({ setPage, darkMode, isPeerLoaded }) => {
  const [remoteId,setRemoteId]=useState('');
  const [status,setStatus]=useState('init');
  const [progress,setProgress]=useState(0);
  const [meta,setMeta]=useState(null);
  const metaRef=useRef(null);
  const [peer,setPeer]=useState(null);

  useEffect(()=>{
    if(!isPeerLoaded) return;
    const p=new window.Peer();
    p.on('open',id=>console.log('Receiver ID:',id));
    setPeer(p);
    return ()=>{ if(p)p.destroy(); };
  },[isPeerLoaded]);

  const connectToPeer = () => {
    if(!peer || !remoteId) return;
    setStatus('connecting');
    const conn = peer.connect(remoteId);
    let chunks=[], receivedBytes=0;

    conn.on('open',()=>{setStatus('connected'); console.log("Connected to sender");});

    conn.on('data', data=>{
      if(data.type==='METADATA'){metaRef.current=data; setMeta(data); setStatus('receiving'); chunks=[]; receivedBytes=0;}
      else if(data.type==='CHUNK'){chunks.push(data.data); receivedBytes+=data.data.byteLength; if(metaRef.current)setProgress((receivedBytes/metaRef.current.size)*100);}
      else if(data.type==='EOF'){
        setStatus('building');
        const currentMeta=metaRef.current;
        if(currentMeta){
          const blob=new Blob(chunks,{type:currentMeta.mime});
          const url=URL.createObjectURL(blob);
          const a=document.createElement('a'); a.href=url; a.download=currentMeta.name; a.click();
          setStatus('complete');
        } else {console.error("Metadata missing at EOF"); setStatus('error');}
        chunks=[];
      }
    });

    conn.on('error',err=>{console.error("Conn Error",err); setStatus('error');});
  };

  return (
    <div className="min-h-screen pt-24 px-4 flex flex-col items-center max-w-4xl mx-auto">
      {/* UI code continues like your provided App */}
    </div>
  );
};

// --- MAIN APP ---
const App = () => {
  const [page,setPage]=useState('home');
  const [darkMode,setDarkMode]=useState(true);
  const isPeerLoaded=usePeerJS();

  useEffect(()=>{
    if(darkMode){document.body.classList.add('bg-slate-950'); document.body.classList.remove('bg-slate-50');}
    else {document.body.classList.add('bg-slate-50'); document.body.classList.remove('bg-slate-950');}
  },[darkMode]);

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans selection:bg-cyan-500/30 ${darkMode?'text-slate-100':'text-slate-900'}`}>
      <Navbar darkMode={darkMode} toggleTheme={()=>setDarkMode(!darkMode)} setPage={setPage} />
      <main>
        {page==='home' && <Hero setPage={setPage} darkMode={darkMode} />}
        {page==='send' && <SendInterface setPage={setPage} darkMode={darkMode} isPeerLoaded={isPeerLoaded} />}
        {page==='receive' && <ReceiveInterface setPage={setPage} darkMode={darkMode} isPeerLoaded={isPeerLoaded} />}
      </main>
      <div className="fixed bottom-4 right-4 max-w-sm p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-xs text-yellow-500 backdrop-blur-md">
        <div className="flex items-center gap-2 font-bold mb-1"><AlertTriangle size={14} /><span>Demo Note:</span></div>
        Uses Public PeerJS Server. For 150GB+ transfers in Production, ensure you use the Node.js backend.
      </div>
    </div>
  );
};

export default App;
