import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { QRGenerator } from './QRGenerator';
import { QRScanner } from './QRScanner';
import { Monitor, Smartphone, Shield, Activity, Users, Lock } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'desktop' | 'mobile'>('desktop');

  const stats = [
    {
      label: 'Active Sessions',
      value: '3',
      icon: Activity,
      color: 'text-success-600',
      bg: 'bg-success-50',
    },
    {
      label: 'Devices',
      value: '5',
      icon: Users,
      color: 'text-primary-600',
      bg: 'bg-primary-50',
    },
    {
      label: 'Security Level',
      value: 'High',
      icon: Lock,
      color: 'text-warning-600',
      bg: 'bg-warning-50',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Manage your secure authentication sessions and devices
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="flex items-center justify-center mb-6">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('desktop')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'desktop'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>Desktop View</span>
            </button>
            <button
              onClick={() => setActiveTab('mobile')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'mobile'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Mobile View</span>
            </button>
          </div>
        </div>

        <div className="min-h-[400px]">
          {activeTab === 'desktop' ? (
            <div>
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Desktop Authentication
                </h3>
                <p className="text-gray-600">
                  Generate QR codes for secure device authentication
                </p>
              </div>
              <QRGenerator />
            </div>
          ) : (
            <div>
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Mobile Authentication
                </h3>
                <p className="text-gray-600">
                  Approve or deny authentication requests from your mobile device
                </p>
              </div>
              <QRScanner />
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="flex items-center mb-4">
          <Shield className="w-5 h-5 text-primary-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Security Features</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-success-400 rounded-full mt-2"></div>
            <div>
              <p className="font-medium text-gray-900">End-to-End Encryption</p>
              <p className="text-gray-600">All authentication data is encrypted</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-success-400 rounded-full mt-2"></div>
            <div>
              <p className="font-medium text-gray-900">Time-Limited Codes</p>
              <p className="text-gray-600">QR codes expire after 5 minutes</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-success-400 rounded-full mt-2"></div>
            <div>
              <p className="font-medium text-gray-900">Device Verification</p>
              <p className="text-gray-600">Each device is uniquely identified</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-success-400 rounded-full mt-2"></div>
            <div>
              <p className="font-medium text-gray-900">Real-time Monitoring</p>
              <p className="text-gray-600">Live status updates and notifications</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};