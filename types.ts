export interface FamilyMember {
  id: string;
  name: string;
  status: 'safe' | 'warning' | 'danger' | 'offline';
  lastSeen: string;
  battery: number;
  signalStrength: 0 | 1 | 2 | 3 | 4; // 0-4 scale
  wifiConnected: boolean;
  isCameraActive: boolean;
  isMicActive: boolean;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  avatarUrl: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  MAP = 'MAP',
  ADVISOR = 'ADVISOR',
  SETTINGS = 'SETTINGS',
}

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
}