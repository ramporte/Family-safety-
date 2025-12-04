import React, { useState } from 'react';
import { X, QrCode, Smartphone, Loader2, Check, Copy } from 'lucide-react';

interface ConnectDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (name: string) => void;
}

const ConnectDeviceModal: React.FC<ConnectDeviceModalProps> = ({ isOpen, onClose, onConnect }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState('');
  const [pairingCode] = useState('882-901');

  if (!isOpen) return null;

  const handleNext = () => {
    if (name.trim()) setStep(2);
  };

  const simulateConnection = () => {
    setStep(3);
    setTimeout(() => {
      onConnect(name);
      // Reset after a delay or let the parent handle closing
      setTimeout(() => {
        setStep(1);
        setName('');
      }, 1000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl overflow-hidden m-4">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800">Connect Device</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4 animate-in slide-in-from-right duration-300">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="text-indigo-600" size={32} />
              </div>
              <div className="text-center mb-6">
                <h2 className="text-lg font-bold text-slate-800">Who are you connecting?</h2>
                <p className="text-sm text-slate-500">Enter your family member's name to generate a pairing code.</p>
              </div>
              <input
                type="text"
                placeholder="e.g., Rahul"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-center text-lg"
                autoFocus
              />
              <button
                onClick={handleNext}
                disabled={!name.trim()}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Generate Code
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 text-center animate-in slide-in-from-right duration-300">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Scan to Pair</h2>
                <p className="text-sm text-slate-500 mt-1">Install the Guardian app on <strong>{name}'s</strong> phone and scan this code.</p>
              </div>
              
              <div className="bg-white p-4 rounded-xl border-2 border-slate-100 inline-block shadow-sm relative group cursor-pointer">
                 <QrCode size={140} className="text-slate-800" />
                 <div className="absolute inset-0 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-bold text-slate-600">Click to Simulate</span>
                 </div>
                 {/* Invisible button to skip for demo purposes */}
                 <button onClick={simulateConnection} className="absolute inset-0 w-full h-full cursor-pointer"></button>
              </div>

              <div className="flex items-center justify-center gap-2 text-slate-400">
                <span className="text-xs uppercase font-bold tracking-widest">Or enter code</span>
              </div>

              <div className="bg-slate-100 py-3 px-6 rounded-lg flex items-center justify-between">
                <span className="font-mono text-xl font-bold text-slate-700 tracking-wider">{pairingCode}</span>
                <Copy size={16} className="text-slate-400" />
              </div>

              <div className="flex items-center justify-center gap-2 text-indigo-600 text-sm font-medium animate-pulse">
                <Loader2 size={16} className="animate-spin" />
                Waiting for connection...
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="py-8 flex flex-col items-center animate-in zoom-in duration-300">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="text-green-600" size={40} strokeWidth={3} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Connected!</h2>
              <p className="text-slate-500 mt-2">Tracking is now active for {name}.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectDeviceModal;