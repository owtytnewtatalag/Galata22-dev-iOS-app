export interface QRCodeData {
  id: string;
  timestamp: number;
  action: 'login' | 'register' | 'verify';
  userId?: string;
  sessionId: string;
  expiresAt: number;
}

export interface AuthSession {
  id: string;
  userId: string;
  isAuthenticated: boolean;
  createdAt: number;
  expiresAt: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: number;
}