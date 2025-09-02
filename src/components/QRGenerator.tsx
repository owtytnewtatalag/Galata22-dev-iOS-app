import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { generateQRCode, createAuthURL } from '../utils/qr';
import { QrCode, RefreshCw, Clock, CheckCircle, XCircle } from 'lucide-react';
import { QRAuthRequest } from '../types/auth';

export const QRGenerator: React.FC = () => {
  const { generateQRAuth } = useAuth();
  const [qrRequest, setQrRequest] = useState<QRAuthRequest | null>(null);
  const [qrCodeImage, setQrCodeImage] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateNewQR = async () => {
    setIsGenerating(true);
    try {
      const request = await generateQRAuth();
      const authURL = createAuthURL(request.id, request.code);
      const qrImage = await generateQRCode(authURL);
      
      setQrRequest(request);
      setQrCodeImage(qrImage);
      setTimeLeft(5 * 60); // 5 minutes
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    generateNewQR();
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (qrRequest && timeLeft === 0) {
      setQrRequest({ ...qrRequest, status: 'expired' });
    }
  }, [timeLeft, qrRequest]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = () => {
    if (!qrRequest) return null;
    
    switch (qrRequest.status) {
      case 'approved':
        return <CheckCircle className="w-6 h-6 text-success-600" />;
      case 'denied':
        return <XCircle className="w-6 h-6 text-error-600" />;
      case 'expired':
        return <Clock className="w-6 h-6 text-warning-600" />;
      default:
        return <QrCode className="w-6 h-6 text-primary-600" />;
    }
  };

  const getStatusMessage = () => {
    if (!qrRequest) return '';
    
    switch (qrRequest.status) {
      case 'approved':
        return 'Authentication approved! You can now access the device.';
      case 'denied':
        return 'Authentication denied. Please try again.';
      case 'expired':
        return 'QR code has expired. Generate a new one to continue.';
      default:
        return 'Scan this QR code with your mobile device to authenticate.';
    }
  };

  return (
    <div className="card max-w-md mx-auto animate-slide-up">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          {getStatusIcon()}
          <h3 className="text-xl font-semibold text-gray-900 ml-2">
            QR Authentication
          </h3>
        </div>

        {qrRequest && qrRequest.status === 'pending' && (
          <div className="mb-4">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Expires in {formatTime(timeLeft)}</span>
            </div>
          </div>
        )}

        <div className="mb-6">
          {qrCodeImage && qrRequest?.status === 'pending' ? (
            <div className="relative">
              <img
                src={qrCodeImage}
                alt="QR Code for authentication"
                className="mx-auto rounded-lg shadow-sm"
              />
              <div className="absolute inset-0 border-2 border-primary-200 rounded-lg">
                <div className="w-full h-0.5 bg-primary-400 animate-scan opacity-60"></div>
              </div>
            </div>
          ) : (
            <div className="w-64 h-64 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
              {getStatusIcon()}
            </div>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-6">
          {getStatusMessage()}
        </p>

        {qrRequest && (qrRequest.status === 'expired' || qrRequest.status === 'denied') && (
          <button
            onClick={generateNewQR}
            disabled={isGenerating}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Generate New QR Code</span>
              </>
            )}
          </button>
        )}

        {qrRequest && qrRequest.status === 'pending' && (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-primary-900 mb-2">Device Information</h4>
            <div className="space-y-1 text-xs text-primary-700">
              <p><span className="font-medium">Location:</span> {qrRequest.deviceInfo.location}</p>
              <p><span className="font-medium">IP:</span> {qrRequest.deviceInfo.ip}</p>
              <p><span className="font-medium">Request ID:</span> {qrRequest.id}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};