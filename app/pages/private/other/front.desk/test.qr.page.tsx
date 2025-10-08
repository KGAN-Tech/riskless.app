import { useState } from 'react';
import { Card } from '@/components/atoms/card';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { Label } from '@/components/atoms/label';
import { Badge } from '@/components/atoms/badge';
import { Separator } from '@/components/atoms/separator';
import { motion } from 'framer-motion';
import { 
  QrCode, 
  Copy, 
  Download,
  ArrowLeft,
  User,
  Mail,
  Phone,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router';
import QRCode from 'react-qr-code';

interface TestUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  qrData: string;
}

const sampleUsers: TestUser[] = [
  {
    id: '1',
    name: 'Juan Dela Cruz',
    email: 'juan.delacruz@example.com',
    phone: '+63 912 345 6789',
    qrData: 'USER_001_JUAN_DELACRUZ_2024'
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria.santos@example.com',
    phone: '+63 923 456 7890',
    qrData: 'USER_002_MARIA_SANTOS_2024'
  },
  {
    id: '3',
    name: 'Pedro Garcia',
    email: 'pedro.garcia@example.com',
    phone: '+63 934 567 8901',
    qrData: 'USER_003_PEDRO_GARCIA_2024'
  },
  {
    id: '4',
    name: 'Ana Lopez',
    email: 'ana.lopez@example.com',
    phone: '+63 945 678 9012',
    qrData: 'USER_004_ANA_LOPEZ_2024'
  },
  {
    id: '5',
    name: 'Carlos Reyes',
    email: 'carlos.reyes@example.com',
    phone: '+63 956 789 0123',
    qrData: 'USER_005_CARLOS_REYES_2024'
  }
];

export default function TestQRPage() {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState<TestUser | null>(null);
  const [customQRData, setCustomQRData] = useState('');

  const generateNewUser = () => {
    const randomId = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const names = ['Juan Dela Cruz', 'Maria Santos', 'Pedro Garcia', 'Ana Lopez', 'Carlos Reyes', 'Isabella Torres', 'Miguel Fernandez', 'Sofia Rodriguez'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomEmail = `${randomName.toLowerCase().replace(' ', '.')}@example.com`;
    const randomPhone = `+63 9${Math.floor(Math.random() * 90000000) + 10000000}`;
    
    const newUser: TestUser = {
      id: Date.now().toString(),
      name: randomName,
      email: randomEmail,
      phone: randomPhone,
      qrData: JSON.stringify({
        id: `FTCC_USER_${randomId}`,
        name: randomName,
        email: randomEmail,
        phone: randomPhone,
        type: 'patient_checkin',
        timestamp: new Date().toISOString()
      })
    };
    
    setSelectedUser(newUser);
  };

  const handleCopyQR = (qrData: string) => {
    navigator.clipboard.writeText(qrData);
    // You could add a toast notification here
  };

  const handleDownloadQR = (qrData: string, name: string) => {
    // Create a simple text file with QR data for testing
    const blob = new Blob([qrData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}_QR_Data.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleBack = () => {
    navigate('/counter/front-desk');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">QR Code Test Page</h1>
              <p className="text-gray-600">Generate sample QR codes for testing the check-in system</p>
            </div>
          </div>
          <Badge variant="secondary">Test Environment</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sample Users */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" />
              Sample Users
            </h3>
            <div className="space-y-3">
              {sampleUsers.map((user) => (
                <motion.div
                  key={user.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedUser?.id === user.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{user.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {user.phone}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                        {user.qrData}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* QR Code Display */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-green-500" />
              Generated QR Code
            </h3>
            
            {selectedUser ? (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">{selectedUser.name}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <span>{selectedUser.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <span>{selectedUser.phone}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Generated QR Code */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Generated QR Code:</Label>
                  <div className="flex justify-center">
                    <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-sm">
                      <QRCode
                        value={selectedUser.qrData}
                        size={200}
                        bgColor="#ffffff"
                        fgColor="#000000"
                        level="M"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-sm font-medium">QR Code Data:</Label>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <code className="text-sm font-mono break-all">{selectedUser.qrData}</code>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCopyQR(selectedUser.qrData)}
                      className="flex-1"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Data
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadQR(selectedUser.qrData, selectedUser.name)}
                      className="flex-1"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Data
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h5 className="font-semibold text-green-800 mb-2">Ready to Test! 🎯</h5>
                  <ol className="text-sm text-green-700 space-y-1 list-decimal list-inside">
                    <li>The QR code above is automatically generated</li>
                    <li>Take a screenshot or use your phone to capture this QR code</li>
                    <li>Go to the check-in page</li>
                    <li>Scan the captured QR code during check-in</li>
                    <li>The system will recognize the user data and proceed to photo capture</li>
                  </ol>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <QrCode className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Select a user to generate their QR code</p>
              </div>
            )}
          </Card>
        </div>

        {/* Custom QR Data */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-purple-500" />
            Custom QR Code Generator
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="customQR">Enter custom QR code data:</Label>
              <Input
                id="customQR"
                value={customQRData}
                onChange={(e) => setCustomQRData(e.target.value)}
                placeholder="Enter any text to use as QR code data..."
                className="mt-2"
              />
            </div>
            
            {customQRData && (
              <div className="space-y-4">
                {/* Generated Custom QR Code */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Generated QR Code:</Label>
                  <div className="flex justify-center">
                    <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-sm">
                      <QRCode
                        value={customQRData}
                        size={200}
                        bgColor="#ffffff"
                        fgColor="#000000"
                        level="M"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-sm font-medium">QR Code Data:</Label>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <code className="text-sm font-mono break-all">{customQRData}</code>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCopyQR(customQRData)}
                      className="flex-1"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Data
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadQR(customQRData, 'custom')}
                      className="flex-1"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Data
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => navigate('/counter/front-desk/check-in')}
              className="w-full"
            >
              <QrCode className="w-4 h-4 mr-2" />
              Go to Check-In Page
            </Button>
            <Button 
              variant="outline"
              onClick={generateNewUser}
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate New User
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/counter/settings')}
              className="w-full"
            >
              <QrCode className="w-4 h-4 mr-2" />
              Manage Counters
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
