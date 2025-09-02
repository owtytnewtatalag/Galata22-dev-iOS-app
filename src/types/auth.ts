export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: Date;
}

export interface QRAuthRequest {
  id: string;
  code: string;
  status: 'pending' | 'approved' | 'denied' | 'expired';
  deviceInfo: {
    userAgent: string;
    ip: string;
    location?: string;
  };
  createdAt: Date;
  expiresAt: Date;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  generateQRAuth: () => Promise<QRAuthRequest>;
  approveQRAuth: (requestId: string) => Promise<void>;
  denyQRAuth: (requestId: string) => Promise<void>;
}