import React, { useState } from 'react';
import { 
  Map, 
  Shield, 
  LayoutDashboard, 
  Settings, 
  Bell, 
  Battery, 
  Navigation as NavIcon,
  Wifi,
  Plus,
  Video,
  Signal,
  MapPin,
  ExternalLink,
  Smartphone
} from 'lucide-react';
import RadarMap from './components/RadarMap';
import ChatInterface from './components/ChatInterface';
import PanicOverlay from './components/PanicOverlay';
import ConnectDeviceModal from './components/ConnectDeviceModal';
import CameraFeedOverlay from './components/CameraFeedOverlay';
import { FamilyMember, AppView } from './types';

// Initial Mock Data - Coordinates centered around Central Park, NY for demo
const INITIAL_FAMILY: FamilyMember[] = [
  {
    id: '1',
    name: 'Mom',
    status: 'safe',
    lastSeen: 'Now',
    battery: 85,
    signalStrength: 4,
    wifiConnected: true,
    isCameraActive: false,
    isMicActive: false,
    location: { lat: 40.785091, lng: -73.968285, address: '86th St, New York' },
    avatarUrl: 'https://picsum.photos/100/100?random=1'
  },
  {
    id: '2',
    name: 'Dad',
    status: 'warning',
    lastSeen: '5m ago',
    battery: 15,
    signalStrength: 2,
    wifiConnected: false,
    isCameraActive: false,
    isMicActive: false,
    location: { lat: 40.781324, lng: -73.963487, address: 'The Met Museum' },
    avatarUrl: 'https://picsum.photos/100/100?random=2'
  }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isPanicOpen, setIsPanicOpen] = useState(false);
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [selectedCameraMember, setSelectedCameraMember] = useState<FamilyMember | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(INITIAL_FAMILY);

  const handleAddMember = (name: string) => {
    // Generate a random nearby location
    const baseLat = 40.7829;
    const baseLng = -73.9654;
    const offsetLat = (Math.random() - 0.5) * 0.01;
    const offsetLng = (Math.random() - 0.5) * 0.01;

    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: name,
      status: 'safe',
      lastSeen: 'Just now',
      battery: 98,
      signalStrength: 4,
      wifiConnected: true,
      isCameraActive: true,
      isMicActive: true,
      location: { 
        lat: baseLat + offsetLat, 
        lng: baseLng + offsetLng, 
        address: 'Fifth Avenue' 
      },
      avatarUrl: `https://ui-avatars.com/api/?name=${name}&background=random&color=fff&background=6366f1`
    };
    
    setFamilyMembers(prev => [...prev, newMember]);
    setIsConnectOpen(false);
    // Switch to map to show tracking immediately
    setCurrentView(AppView.MAP);
  };

  const openGoogleMaps = (member: FamilyMember) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${member.location.lat},${member.location.lng}`;
    window.open(url, '_blank');
  };

  const renderContent = () => {
    switch (currentView) {
      case AppView.ADVISOR:
        return <ChatInterface />;
      case AppView.MAP:
        return (
          <div className="space-y-4">
             <RadarMap members={familyMembers} />
             <div className="grid grid-cols-1 gap-3">
               {familyMembers.map(member => (
                 <div key={member.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={member.avatarUrl} className="w-10 h-10 rounded-full bg-slate-200 object-cover" alt={member.name} />
                      <div>
                        <h4 className="font-semibold text-slate-800">{member.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><MapPin size={10} /> {member.location.address}</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5">
                            {member.wifiConnected ? <Wifi size={10} /> : <Signal size={10} />}
                            {member.wifiConnected ? 'WiFi' : '4G'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <button 
                         onClick={() => openGoogleMaps(member)}
                         className="p-2 bg-slate-50 text-slate-600 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors border border-slate-200"
                         title="Track on Google Maps"
                       >
                         <NavIcon size={16} />
                       </button>
                       <button 
                         onClick={() => setSelectedCameraMember(member)}
                         className="p-2 bg-slate-50 text-slate-600 rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition-colors border border-slate-200"
                         title="View Live Camera"
                       >
                         <Video size={16} />
                       </button>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        );
      case AppView.SETTINGS:
        return (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold mb-4">Settings</h2>
            <div className="space-y-4">
              
              {/* Install App Guide */}
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 mb-6">
                <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                  <Smartphone size={18} />
                  Install App
                </h3>
                <p className="text-xs text-indigo-700 mb-3">Add Guardian to your home screen for quick access.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-indigo-100">
                    <strong className="block text-slate-700 mb-1">iPhone (iOS)</strong>
                    <ol className="list-decimal pl-4 space-y-1 text-slate-500">
                      <li>Tap <strong className="text-slate-700">Share</strong> (square with arrow)</li>
                      <li>Scroll down & tap <strong className="text-slate-700">Add to Home Screen</strong></li>
                      <li>Tap <strong className="text-slate-700">Add</strong></li>
                    </ol>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-indigo-100">
                    <strong className="block text-slate-700 mb-1">Android</strong>
                    <ol className="list-decimal pl-4 space-y-1 text-slate-500">
                      <li>Tap <strong className="text-slate-700">Menu</strong> (3 dots)</li>
                      <li>Tap <strong className="text-slate-700">Install App</strong> or <strong className="text-slate-700">Add to Home Screen</strong></li>
                    </ol>
                  </div>
                </div>
              </div>

              <div 
                onClick={() => setIsConnectOpen(true)}
                className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                      <Plus size={20} />
                   </div>
                   <div>
                     <span className="font-semibold text-slate-800 block">Add New Device</span>
                     <span className="text-xs text-slate-500">Connect a child or family member</span>
                   </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-700">Location Sharing</span>
                <div className="w-10 h-6 bg-green-500 rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-700">Camera Access</span>
                <div className="w-10 h-6 bg-green-500 rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 mt-4">
                <h3 className="font-semibold mb-2">Emergency Contacts</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Mom (Mobile)</span>
                    <span className="text-slate-400">Edit</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>911 (Local)</span>
                    <span className="text-slate-400">Default</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case AppView.DASHBOARD:
      default:
        return (
          <div className="space-y-6">
            {/* Header Status */}
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-indigo-600 rounded-2xl p-5 text-white shadow-lg shadow-indigo-200 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Shield size={60} />
                  </div>
                  <h3 className="text-indigo-100 text-sm font-medium mb-1">Family Status</h3>
                  <p className="text-2xl font-bold">All Safe</p>
                  <p className="text-xs text-indigo-200 mt-2">Last check: Just now</p>
               </div>
               
               <div 
                 onClick={() => setIsPanicOpen(true)}
                 className="bg-red-500 rounded-2xl p-5 text-white shadow-lg shadow-red-200 relative overflow-hidden cursor-pointer hover:bg-red-600 transition-colors group"
               >
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Bell size={60} />
                  </div>
                  <h3 className="text-red-100 text-sm font-medium mb-1">Emergency</h3>
                  <p className="text-2xl font-bold">PANIC</p>
                  <p className="text-xs text-red-200 mt-2">Tap to alert contacts</p>
               </div>
            </div>

            {/* Quick Actions / Tracking Grid */}
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-lg">Tracking</h3>
              <button 
                onClick={() => setIsConnectOpen(true)} 
                className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-semibold hover:bg-indigo-100 transition-colors"
              >
                + Add Member
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {familyMembers.map(member => (
                <div key={member.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center relative group">
                   <div className="absolute top-2 right-2 flex gap-1 z-10">
                       <button 
                         onClick={() => openGoogleMaps(member)}
                         className="p-1.5 bg-slate-100 rounded-full text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                         title="Track on Map"
                       >
                         <MapPin size={14} />
                       </button>
                   </div>
                   
                   <div className="relative mb-2 mt-1">
                     <img src={member.avatarUrl} className="w-12 h-12 rounded-full object-cover bg-slate-100" alt={member.name} />
                     <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        member.status === 'safe' ? 'bg-green-500' : 
                        member.status === 'warning' ? 'bg-amber-500' : 'bg-slate-400'
                     }`}></span>
                   </div>
                   <span className="font-semibold text-sm text-slate-700 block">{member.name}</span>
                   
                   <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                      <div className={`flex items-center gap-0.5 ${member.battery < 20 ? 'text-red-500 font-bold' : ''}`}>
                        <Battery size={10} />
                        <span>{member.battery}%</span>
                      </div>
                      <div className="flex items-center gap-0.5">
                         {member.wifiConnected ? <Wifi size={10} /> : <Signal size={10} />}
                         <span className="ml-0.5">{member.signalStrength}/4</span>
                      </div>
                   </div>
                </div>
              ))}
              
              {/* Add New Button Card */}
              <div 
                onClick={() => setIsConnectOpen(true)}
                className="bg-slate-50 p-3 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 transition-colors group h-[120px]"
              >
                 <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-2 shadow-sm text-slate-400 group-hover:text-indigo-600 group-hover:scale-110 transition-all">
                   <Plus size={20} />
                 </div>
                 <span className="font-semibold text-xs text-slate-500 group-hover:text-indigo-600">Connect<br/>Device</span>
              </div>
            </div>

            {/* Recent Activity / Safety Tip */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
               <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                 <Shield size={18} className="text-indigo-600" />
                 Safety Tip of the Day
               </h3>
               <p className="text-slate-600 text-sm leading-relaxed">
                 Create a "safe word" with your family. If anyone is in a situation where they can't speak freely, using this word signals they need immediate help without alerting others around them.
               </p>
               <button 
                 onClick={() => setCurrentView(AppView.ADVISOR)}
                 className="mt-3 text-indigo-600 text-sm font-semibold hover:underline"
               >
                 Ask Advisor for more →
               </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-0">
      
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-10 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <Shield size={18} fill="currentColor" />
          </div>
          <h1 className="font-bold text-xl text-slate-800 tracking-tight">Guardian</h1>
        </div>
        <button 
          onClick={() => setIsPanicOpen(true)}
          className="bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-xs font-bold border border-red-100 hover:bg-red-100 transition-colors flex items-center gap-1"
        >
          <Bell size={12} />
          SOS
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto p-4">
        {renderContent()}
      </div>

      {/* Bottom Nav (Mobile style) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-40 md:max-w-2xl md:mx-auto md:relative md:border-t-0 md:bg-transparent md:mt-8">
        <button 
          onClick={() => setCurrentView(AppView.DASHBOARD)}
          className={`flex flex-col items-center gap-1 transition-colors ${currentView === AppView.DASHBOARD ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <LayoutDashboard size={24} strokeWidth={currentView === AppView.DASHBOARD ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button 
          onClick={() => setCurrentView(AppView.MAP)}
          className={`flex flex-col items-center gap-1 transition-colors ${currentView === AppView.MAP ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Map size={24} strokeWidth={currentView === AppView.MAP ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Radar</span>
        </button>
        
        {/* Floating Panic Button Center */}
        <div className="-mt-8">
          <button 
             onClick={() => setIsPanicOpen(true)}
             className="bg-red-600 hover:bg-red-700 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-red-200 border-4 border-slate-50 transition-transform active:scale-95"
          >
            <Bell size={24} fill="currentColor" />
          </button>
        </div>

        <button 
          onClick={() => setCurrentView(AppView.ADVISOR)}
          className={`flex flex-col items-center gap-1 transition-colors ${currentView === AppView.ADVISOR ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Shield size={24} strokeWidth={currentView === AppView.ADVISOR ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Advisor</span>
        </button>
        <button 
          onClick={() => setCurrentView(AppView.SETTINGS)}
          className={`flex flex-col items-center gap-1 transition-colors ${currentView === AppView.SETTINGS ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Settings size={24} strokeWidth={currentView === AppView.SETTINGS ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Settings</span>
        </button>
      </div>

      <PanicOverlay isOpen={isPanicOpen} onClose={() => setIsPanicOpen(false)} />
      <ConnectDeviceModal 
        isOpen={isConnectOpen} 
        onClose={() => setIsConnectOpen(false)} 
        onConnect={handleAddMember} 
      />
      <CameraFeedOverlay 
        isOpen={!!selectedCameraMember}
        onClose={() => setSelectedCameraMember(null)}
        member={selectedCameraMember}
      />
    </div>
  );
};

export default App;