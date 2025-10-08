import { useState, useRef, useCallback, useEffect } from 'react';
import { Card } from '@/components/atoms/card';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { Label } from '@/components/atoms/label';
import { Badge } from '@/components/atoms/badge';
import { Separator } from '@/components/atoms/separator';
import { Scanner } from '@yudiel/react-qr-scanner';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  QrCode, 
  Camera, 
  CheckCircle, 
  X, 
  ArrowLeft, 
  User, 
  Clock,
  AlertCircle,
  Save,
  RotateCcw
} from 'lucide-react';
import { uselocalStorage } from '@/utils/localstorage.utils';
import { useNavigate } from 'react-router';

interface ScannedUser {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  qrCode: string;
  photo?: string;
  checkInTime: string;
  queueNumber?: number;
}

interface Counter {
  id: string;
  title: string;
  counterNumber: string;
  currentNumber: number | null;
  waitingCount: number;
  isVisible: boolean;
  isActive: boolean;
  lastCalled?: number | null;
}

const STORAGE_KEY = "queue.counters";
const CHECKIN_STORAGE_KEY = "checkin.users";

export default function CheckInPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'scan' | 'photo' | 'complete'>('scan');
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [userData, setUserData] = useState<ScannedUser | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [counters, setCounters] = useState<Counter[]>([]);
  const [selectedCounter, setSelectedCounter] = useState<string | null>(null);
  
  const webcamRef = useRef<Webcam>(null);

  // Load counters from storage and listen for changes
  useEffect(() => {
    const loadCounters = () => {
      const stored = uselocalStorage.get<Counter[]>(STORAGE_KEY);
      if (stored && Array.isArray(stored)) {
        setCounters(stored);
        // Auto-select first active counter if none selected
        if (!selectedCounter) {
          const firstActive = stored.find(c => c.isActive && c.isVisible);
          if (firstActive) {
            setSelectedCounter(firstActive.id);
          }
        }
      }
    };

    loadCounters();

    // Poll for changes every 500ms to keep in sync
    const interval = setInterval(loadCounters, 500);
    
    return () => clearInterval(interval);
  }, [selectedCounter]);

  const handleQRScan = (codes: any[]) => {
    if (codes && codes.length > 0 && codes[0].rawValue) {
      try {
        const qrData = codes[0].rawValue;
        setScannedData(qrData);
        
        // Parse QR data (assuming it contains user information)
        // In a real app, this would be a proper user ID or token
        const mockUserData: ScannedUser = {
          id: crypto.randomUUID(),
          name: `User ${qrData.slice(-4)}`, // Mock name from QR
          email: `user${qrData.slice(-4)}@example.com`,
          phone: '+63 912 345 6789',
          qrCode: qrData,
          checkInTime: new Date().toISOString(),
        };
        
        setUserData(mockUserData);
        setCurrentStep('photo');
        setError(null);
      } catch (err) {
        setError('Invalid QR code format');
      }
    }
  };

  const capturePhoto = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedPhoto(imageSrc);
      }
    }
  }, []);

  const retakePhoto = () => {
    setCapturedPhoto(null);
  };

  const handleComplete = async () => {
    if (!userData || !capturedPhoto || !selectedCounter) {
      setError('Please complete all steps');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Update user data with photo
      const updatedUserData: ScannedUser = {
        ...userData,
        photo: capturedPhoto,
      };

      // Add to queue
      const selectedCounterData = counters.find(c => c.id === selectedCounter);
      if (selectedCounterData) {
        const nextQueueNumber = (selectedCounterData.currentNumber || 0) + selectedCounterData.waitingCount + 1;
        
        const finalUserData: ScannedUser = {
          ...updatedUserData,
          queueNumber: nextQueueNumber,
        };

        // Save user data
        const existingUsers = uselocalStorage.get<ScannedUser[]>(CHECKIN_STORAGE_KEY) || [];
        uselocalStorage.set(CHECKIN_STORAGE_KEY, [...existingUsers, finalUserData]);

        // Update counter waiting count
        const updatedCounters = counters.map(c => 
          c.id === selectedCounter 
            ? { ...c, waitingCount: c.waitingCount + 1 }
            : c
        );
        uselocalStorage.set(STORAGE_KEY, updatedCounters);
        setCounters(updatedCounters); // Update local state immediately

        setUserData(finalUserData);
        setCurrentStep('complete');
      } else {
        setError('Selected counter not found');
      }
    } catch (err) {
      setError('Failed to complete check-in');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setCurrentStep('scan');
    setScannedData(null);
    setCapturedPhoto(null);
    setUserData(null);
    setError(null);
  };

  const handleBack = () => {
    navigate('/counter/front-desk');
  };

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user"
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
                         <div>
               <h1 className="text-2xl font-bold text-gray-900">Patient Check-In</h1>
               <p className="text-gray-600">Step 1: Scan QR Code • Step 2: Photo Capture for Proof of Life</p>
             </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={currentStep === 'scan' ? 'default' : 'secondary'}>Step 1: Scan QR</Badge>
            <Badge variant={currentStep === 'photo' ? 'default' : 'secondary'}>Step 2: Photo</Badge>
            <Badge variant={currentStep === 'complete' ? 'default' : 'secondary'}>Complete</Badge>
          </div>
        </div>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Scanner/Camera */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {currentStep === 'scan' && <QrCode className="w-5 h-5 text-blue-500" />}
                {currentStep === 'photo' && <Camera className="w-5 h-5 text-green-500" />}
                <h3 className="text-lg font-semibold">
                  {currentStep === 'scan' && 'QR Code Scanner'}
                  {currentStep === 'photo' && 'Photo Capture'}
                  {currentStep === 'complete' && 'Check-In Complete'}
                </h3>
              </div>

              <Separator />

              {/* QR Scanner */}
              {currentStep === 'scan' && (
                <div className="space-y-4">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
                    <Scanner
                      onScan={handleQRScan}
                      onError={() => setError('Camera access denied')}
                      styles={{ container: { width: '100%', height: '100%' } }}
                    />
                    <div className="absolute inset-0 border-2 border-blue-500 border-dashed pointer-events-none"></div>
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    Position the QR code within the frame to scan
                  </p>
                </div>
              )}

                             {/* Photo Capture */}
               {currentStep === 'photo' && (
                 <div className="space-y-4">
                   <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
                     {!capturedPhoto ? (
                       <div className="relative w-full h-full">
                         <Webcam
                           ref={webcamRef}
                           audio={false}
                           screenshotFormat="image/jpeg"
                           videoConstraints={videoConstraints}
                           className="w-full h-full object-cover"
                         />
                         
                         {/* Photo capture overlay */}
                         <div className="absolute inset-0 border-2 border-green-500 border-dashed pointer-events-none">
                           <div className="absolute top-4 left-4 bg-green-500 text-white px-2 py-1 rounded text-sm">
                             Photo Capture
                           </div>
                         </div>
                       </div>
                     ) : (
                       <div className="relative w-full h-full">
                         <img 
                           src={capturedPhoto} 
                           alt="Captured photo" 
                           className="w-full h-full object-cover"
                         />
                         <div className="absolute top-4 left-4 bg-green-500 text-white px-2 py-1 rounded text-sm">
                           Photo Captured ✓
                         </div>
                       </div>
                     )}
                   </div>
                   
                   <div className="flex gap-2">
                     {!capturedPhoto ? (
                       <Button onClick={capturePhoto} className="flex-1">
                         <Camera className="w-4 h-4 mr-2" />
                         Capture Photo for Proof of Life
                       </Button>
                     ) : (
                       <>
                         <Button variant="outline" onClick={retakePhoto} className="flex-1">
                           <RotateCcw className="w-4 h-4 mr-2" />
                           Retake Photo
                         </Button>
                         <Button onClick={handleComplete} disabled={isProcessing} className="flex-1">
                           {isProcessing ? (
                             <>
                               <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                               Updating Profile...
                             </>
                           ) : (
                             <>
                               <Save className="w-4 h-4 mr-2" />
                               Save & Complete Check-In
                             </>
                           )}
                         </Button>
                       </>
                     )}
                   </div>
                   
                   {/* Instructions */}
                   <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                     <h4 className="font-semibold text-blue-900 mb-2">Proof of Life Verification</h4>
                     <p className="text-sm text-blue-700">
                       This photo will be used to verify your identity and update your profile picture. 
                       Please ensure your face is clearly visible in the frame.
                     </p>
                   </div>
                 </div>
               )}

              {/* Complete */}
              {currentStep === 'complete' && userData && (
                <div className="space-y-4">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                                         <div>
                       <h4 className="text-lg font-semibold text-green-600">Check-In Successful!</h4>
                       <p className="text-gray-600">Patient has been added to the queue</p>
                       <p className="text-sm text-green-600 font-medium">✓ Profile picture updated</p>
                     </div>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        Queue #{userData.queueNumber}
                      </div>
                      <p className="text-green-700">Please wait for your number to be called</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Right Panel - User Info & Counter Selection */}
          <div className="space-y-6">
            {/* Counter Selection */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                Select Counter
              </h3>
              <div className="space-y-3">
                {counters.filter(c => c.isActive && c.isVisible).map(counter => (
                  <div
                    key={counter.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedCounter === counter.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedCounter(counter.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{counter.title}</h4>
                        <p className="text-sm text-gray-600">Counter {counter.counterNumber}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">
                          {counter.currentNumber || 0}
                        </div>
                        <div className="text-sm text-gray-500">
                          {counter.waitingCount} waiting
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* User Information */}
            {userData && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-green-500" />
                  Patient Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    {userData.photo && (
                      <img 
                        src={userData.photo} 
                        alt="Patient photo" 
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                      />
                    )}
                    <div>
                      <h4 className="font-semibold text-lg">{userData.name}</h4>
                      <p className="text-sm text-gray-600">{userData.email}</p>
                      <p className="text-sm text-gray-600">{userData.phone}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">QR Code:</span>
                      <p className="font-mono text-xs bg-gray-100 p-2 rounded mt-1">
                        {userData.qrCode}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Check-in Time:</span>
                      <p className="font-medium">
                        {new Date(userData.checkInTime).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  {userData.queueNumber && (
                    <>
                      <Separator />
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          Queue #{userData.queueNumber}
                        </div>
                        <p className="text-sm text-gray-600">Estimated wait time: 15-30 minutes</p>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            )}

            {/* Action Buttons */}
            {currentStep === 'complete' && (
              <Card className="p-6">
                <div className="space-y-3">
                  <Button onClick={handleReset} className="w-full">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Check-In Another Patient
                  </Button>
                  <Button variant="outline" onClick={handleBack} className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Front Desk
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
