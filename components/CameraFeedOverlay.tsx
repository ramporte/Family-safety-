import React, { useState, useEffect } from 'react';
import { X, Video, Mic, MicOff, Battery, Signal, Wifi, Smartphone } from 'lucide-react';
import { FamilyMember } from '../types';

interface CameraFeedOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  member: FamilyMember | null;
}

const CameraFeedOverlay: React.FC<CameraFeedOverlayProps> = ({ isOpen, onClose, member }) => {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'failed'>('connecting');
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (isOpen && member) {
      setStatus('connecting');
      // Simulate connection delay
      const timer = setTimeout(() => setStatus('connected'), 2000);
      return () => clearTimeout(timer);
    } else {
      setStatus('connecting');
    }
  }, [isOpen, member]);

  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col animate-in fade-in duration-300">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-10 flex justify-between items-start">
        <div>
           <div className="flex items-center gap-2 mb-1">
             <div className={`w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)] ${status === 'connected' ? 'bg-red-500 animate-pulse' : 'bg-yellow-500'}`}></div>
             <span className="text-white font-mono text-xs font-bold uppercase tracking-widest shadow-black drop-shadow-md">
               {status === 'connected' ? 'LIVE FEED' : 'CONNECTING...'}
             </span>
           </div>
           <h2 className="text-white font-bold text-lg drop-shadow-md">{member.name}'s Device</h2>
           <p className="text-white/70 text-xs drop-shadow-md flex items-center gap-1">
             {member.isCameraActive ? 'Rear Camera' : 'Front Camera'} • 1080p • 30fps
           </p>
        </div>
        <button onClick={onClose} className="p-2 bg-white/10 rounded-full backdrop-blur-md text-white hover:bg-white/20 transition-colors border border-white/10">
          <X size={24} />
        </button>
      </div>

      {/* Main Feed Area */}
      <div className="flex-1 relative bg-slate-900 flex items-center justify-center overflow-hidden">
         {status === 'connecting' && (
           <div className="text-center p-6">
             <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin"></div>
             </div>
             <h3 className="text-white font-semibold text-lg mb-2">Establishing Connection</h3>
             <p className="text-white/50 text-sm max-w-xs mx-auto">
               Securely connecting to {member.name}'s device via encrypted channel...
             </p>
           </div>
         )}
         
         {status === 'connected' && (
            <div className="relative w-full h-full animate-in zoom-in-95 duration-500">
               {/* Simulated Video Feed Image */}
               <img 
                 src={`https://picsum.photos/seed/${member.name}cam/800/1200`} 
                 className="w-full h-full object-cover opacity-90"
                 alt="Live Feed"
               />
               
               {/* Simulation Scanlines/Noise Overlay */}
               <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_4px,6px_100%] pointer-events-none"></div>
               
               {/* Controls */}
               <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-8 z-20">
                  <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className={`w-14 h-14 rounded-full backdrop-blur-md flex items-center justify-center text-white border transition-all ${isMuted ? 'bg-white/10 border-white/20 hover:bg-white/20' : 'bg-white text-slate-900 border-white'}`}>
                        {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                    </div>
                    <span className="text-[10px] font-medium text-white/80 uppercase tracking-wide group-hover:text-white">Audio</span>
                  </button>

                  <div className="relative group cursor-pointer">
                     <div className="w-20 h-20 rounded-full border-4 border-white/30 flex items-center justify-center bg-white/5 backdrop-blur-sm group-hover:bg-white/10 transition-colors">
                        <div className="w-14 h-14 bg-red-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]"></div>
                     </div>
                     <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-medium text-white/80 uppercase tracking-wide whitespace-nowrap">Recording</span>
                  </div>

                  <button className="flex flex-col items-center gap-2 group">
                    <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 border border-white/20 transition-all">
                        <Video size={24} />
                    </div>
                    <span className="text-[10px] font-medium text-white/80 uppercase tracking-wide group-hover:text-white">Flip Cam</span>
                  </button>
               </div>
               
               {/* Stats Overlay */}
               <div className="absolute top-20 right-4 flex flex-col gap-2 items-end z-10">
                  <div className="flex items-center gap-2 text-white/90 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium border border-white/10">
                    {member.wifiConnected ? (
                        <>
                            <Wifi size={14} className="text-green-400" /> 
                            <span>WiFi • {member.signalStrength * 25}%</span>
                        </>
                    ) : (
                        <>
                            <Signal size={14} className="text-blue-400" />
                            <span>5G • {member.signalStrength} bars</span>
                        </>
                    )}
                  </div>
                  <div className={`flex items-center gap-2 text-white/90 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium border border-white/10 ${member.battery < 20 ? 'text-red-300 border-red-900/50' : ''}`}>
                    <Battery size={14} className={member.battery < 20 ? 'text-red-500' : 'text-white'} /> 
                    <span>{member.battery}%</span>
                  </div>
               </div>
               
               {/* Timestamp */}
               <div className="absolute bottom-4 right-4 font-mono text-xs text-white/60">
                 {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
               </div>
            </div>
         )}
      </div>
    </div>
  );
};

export default CameraFeedOverlay;