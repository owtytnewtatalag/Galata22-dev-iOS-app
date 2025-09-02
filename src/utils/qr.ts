import QRCode from 'qrcode';
import { QRCodeData } from '../types/auth';

export const generateQRCode = async (data: QRCodeData): Promise<string> => {
  try {
    const jsonData = JSON.stringify(data);
    const qrCodeDataURL = await QRCode.toDataURL(jsonData, {
      width: 256,
      margin: 2,
      color: {
        dark: '#1e40af',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M'
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

export const parseQRData = (data: string): QRCodeData | null => {
  try {
    const parsed = JSON.parse(data);
    
    // Validate required fields
    if (!parsed.id || !parsed.timestamp || !parsed.action || !parsed.sessionId || !parsed.expiresAt) {
      return null;
    }
    
    // Check if QR code has expired
    if (Date.now() > parsed.expiresAt) {
      return null;
    }
    
    return parsed as QRCodeData;
  } catch (error) {
    console.error('Error parsing QR data:', error);
    return null;
  }
};

export const generateSessionId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const isQRCodeExpired = (expiresAt: number): boolean => {
  return Date.now() > expiresAt;
};