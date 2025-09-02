import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthSession, QRAuthRequest, AuthContextType } from '../types/auth';
import { storage } from '../utils/storage';
import { generateAuthCode } from '../utils/qr';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const MOCK_USER: User = {
  id: '1',
  email: 'user@example.com',
  name: 'John Doe',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
  createdAt: new Date(),
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = storage.getUser();
    const token = storage.getToken();
    
    if (savedUser && token) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication - in real app, validate credentials
    if (email && password) {
      const token = 'mock-jwt-token-' + Date.now();
      storage.setUser(MOCK_USER);
      storage.setToken(token);
      setUser(MOCK_USER);
    } else {
      throw new Error('Invalid credentials');
    }
    
    setIsLoading(false);
  };

  const logout = (): void => {
    storage.removeUser();
    setUser(null);
  };

  const generateQRAuth = async (): Promise<QRAuthRequest> => {
    const request: QRAuthRequest = {
      id: 'qr-' + Date.now(),
      code: generateAuthCode(),
      status: 'pending',
      deviceInfo: {
        userAgent: navigator.userAgent,
        ip: '192.168.1.1', // Mock IP
        location: 'San Francisco, CA',
      },
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    };

    storage.addQRRequest(request);
    return request;
  };

  const approveQRAuth = async (requestId: string): Promise<void> => {
    storage.updateQRRequest(requestId, { status: 'approved' });
  };

  const denyQRAuth = async (requestId: string): Promise<void> => {
    storage.updateQRRequest(requestId, { status: 'denied' });
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    generateQRAuth,
    approveQRAuth,
    denyQRAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};