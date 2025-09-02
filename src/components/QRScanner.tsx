import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { storage } from '../utils/storage';
import { Smartphone, CheckCircle, XCircle, Clock, Scan } from 'lucide-react';
import { QRAuthRequest } from '../types/auth';

export const QRScanner: React.FC = () => {
  const { approveQRAuth, denyQRAuth } = useAuth();
  const [pendingRequests, setPendingRequests] = useState<QRAuthRequest[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const updateRequests = () => {
      const requests = storage.getQRRequests();
      const pending = requests.filter(req => req.status === 'pending');
      setPendingRequests(pending);
    };

    updateRequests();
    const interval = setInterval(updateRequests, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (requestId: string) => {
    await approveQRAuth(requestId);
    setPendingRequests(prev => prev.filter(req => req.id !== requestId));
  };

  const handleDeny = async (requestId: string) => {
    await denyQRAuth(requestId);
    setPendingRequests(prev => prev.filter(req => req.id !== requestId));
  };

  const simulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      // In a real app, this would trigger camera and QR scanning
      alert('In a real app, this would open the camera to scan QR codes!');
    }, 2000);
  };

  const getTimeRemaining = (expiresAt: Date): string => {
    const now = new Date();
    const diff = new Date(expiresAt).getTime() - now.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    if (diff <= 0) return 'Expired';
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="card max-w-md mx-auto animate-slide-up">
        <div className="text-center">
          <div className="flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mx-auto mb-4">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Mobile Device Scanner
          </h3>
          <p className="text-gray-600 mb-6">
            Simulate scanning QR codes from your mobile device
          </p>

          <button
            onClick={simulateScan}
            disabled={isScanning}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            {isScanning ? (
              <>
                <Scan className="w-5 h-5 animate-pulse" />
                <span>Scanning...</span>
              </>
            ) : (
              <>
                <Scan className="w-5 h-5" />
                <span>Scan QR Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {pendingRequests.length > 0 && (
        <div className="card max-w-2xl mx-auto">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-warning-600" />
            Pending Authentication Requests
          </h4>
          
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-warning-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-900">
                      Authentication Request
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {getTimeRemaining(request.expiresAt)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600 mb-4">
                  <div>
                    <span className="font-medium">Location:</span> {request.deviceInfo.location}
                  </div>
                  <div>
                    <span className="font-medium">IP:</span> {request.deviceInfo.ip}
                  </div>
                  <div className="sm:col-span-2">
                    <span className="font-medium">Device:</span> {request.deviceInfo.userAgent.split(' ')[0]}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleApprove(request.id)}
                    className="btn-success flex-1 flex items-center justify-center space-x-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleDeny(request.id)}
                    className="btn-secondary flex-1 flex items-center justify-center space-x-2 bg-error-100 text-error-700 hover:bg-error-200"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Deny</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pendingRequests.length === 0 && (
        <div className="card max-w-md mx-auto text-center">
          <div className="text-gray-400 mb-4">
            <Scan className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-600">
            No pending authentication requests. Generate a QR code to get started.
          </p>
        </div>
      )}
    </div>
  );
};