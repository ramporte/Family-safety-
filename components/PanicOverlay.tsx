import React, { useState, useEffect } from 'react';
import { AlertOctagon, Phone, X, CheckCircle } from 'lucide-react';
import { generatePanicMessage } from '../services/geminiService';

interface PanicOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const PanicOverlay: React.FC<PanicOverlayProps> = ({ isOpen, onClose }) => {
  const [countdown, setCountdown] = useState(5);
  const [active, setActive] = useState(false);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  // Handle countdown when open
  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      setActive(false);
      setSent(false);
      setMessage('');
      return;
    }

    let timer: ReturnType<typeof setTimeout>;
    if (countdown > 0 && !active && !sent) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    } else if (countdown === 0 && !active) {
      triggerEmergency();
    }
    return () => clearTimeout(timer);
  }, [isOpen, countdown, active, sent]);

  const triggerEmergency = async () => {
    setActive(true);
    // Simulate location fetch
    const mockLoc = { lat: 40.7128, lng: -74.0060 };
    
    const msg = await generatePanicMessage("User pressed Panic Button. Unknown danger.", mockLoc);
    setMessage(msg);
    
    // Simulate API call to backend SMS service
    setTimeout(() => {
        setSent(true);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-600/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-md p-6 m-4 bg-white rounded-3xl shadow-2xl text-center relative overflow-hidden">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
        >
          <X size={20} className="text-slate-600" />
        </button>

        {!active ? (
          <div className="py-8">
            <div className="mb-6 relative">
              <div className="w-32 h-32 mx-auto rounded-full border-4 border-red-500 flex items-center justify-center animate-pulse">
                <span className="text-6xl font-black text-red-600">{countdown}</span>
              </div>
              <p className="mt-4 text-slate-500 font-medium uppercase tracking-widest text-sm">Auto-sending in...</p>
            </div>
            
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Emergency Alert</h2>
            <p className="text-slate-500 mb-8 px-4">
              This will send your location and an SOS message to your 3 emergency contacts.
            </p>

            <button
              onClick={triggerEmergency}
              className="w-full py-4 bg-red-600 text-white rounded-xl font-bold text-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-200 mb-3"
            >
              SEND NOW
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="py-8">
            {!sent ? (
              <div className="flex flex-col items-center">
                 <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <AlertOctagon className="w-10 h-10 text-red-600" />
                 </div>
                 <h2 className="text-xl font-bold text-slate-800 mb-2">Generating Alert...</h2>
                 <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto animate-pulse">
                   AI is composing situation details based on location...
                 </p>
                 <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 w-2/3 animate-[shimmer_1s_infinite_linear]"></div>
                 </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                 </div>
                 <h2 className="text-xl font-bold text-slate-800 mb-2">Alert Sent</h2>
                 <p className="text-slate-500 text-sm mb-6">
                   Your emergency contacts have been notified.
                 </p>
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left w-full mb-6">
                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Message Content</p>
                    <p className="text-slate-700 text-sm italic">"{message}"</p>
                 </div>
                 
                 <a 
                   href="tel:911"
                   className="flex items-center justify-center gap-2 w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-colors shadow-lg"
                 >
                   <Phone size={20} />
                   Call 911
                 </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PanicOverlay;