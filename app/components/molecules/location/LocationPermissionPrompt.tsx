import { useState, useEffect } from "react";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { 
  MapPin, 
  Navigation, 
  AlertCircle,
  CheckCircle,
  Settings,
  RefreshCw,
  Shield
} from "lucide-react";
import { InfoCard } from "@/components/organisms/cards";
import AOS from "aos";

interface LocationPermissionPromptProps {
  onLocationGranted: (location: { lat: number; lng: number }) => void;
  onLocationDenied: () => void;
  isRequired?: boolean;
  title?: string;
  description?: string;
}

const LocationPermissionPrompt = ({
  onLocationGranted,
  onLocationDenied,
  isRequired = true,
  title = "Location Access Required",
  description = "We need your location to find nearby pharmacies and provide accurate results."
}: LocationPermissionPromptProps) => {
  const [permissionState, setPermissionState] = useState<'pending' | 'requesting' | 'granted' | 'denied' | 'error'>('pending');
  const [error, setError] = useState<string>('');
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
    });

    // Check if location permission is already granted
    checkExistingPermission();
  }, []);

  const checkExistingPermission = async () => {
    if (!navigator.geolocation) {
      setPermissionState('error');
      setError('Geolocation is not supported by this browser');
      return;
    }

    // Check permission state if available
    if (navigator.permissions) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        if (permission.state === 'granted') {
          requestLocation();
        } else if (permission.state === 'denied') {
          setPermissionState('denied');
        }
      } catch (err) {
        // Fallback for browsers that don't support permissions API
        console.log('Permissions API not supported');
      }
    }
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setPermissionState('error');
      setError('Geolocation is not supported by this browser');
      return;
    }

    setPermissionState('requesting');
    setError('');
    setIsRetrying(false);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        console.log("🎯 Location permission granted! Your coordinates:", {
          latitude: location.lat,
          longitude: location.lng,
          accuracy: `${position.coords.accuracy}m`,
          googleMapsLink: `https://www.google.com/maps?q=${location.lat},${location.lng}`
        });
        
        setPermissionState('granted');
        onLocationGranted(location);
      },
      (error) => {
        setIsRetrying(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setPermissionState('denied');
            setError('Location access was denied. Please enable location permissions in your browser settings.');
            break;
          case error.POSITION_UNAVAILABLE:
            setPermissionState('error');
            setError('Location information is unavailable. Please check your GPS or network connection.');
            break;
          case error.TIMEOUT:
            setPermissionState('error');
            setError('Location request timed out. Please try again.');
            break;
          default:
            setPermissionState('error');
            setError('An unknown error occurred while retrieving location.');
            break;
        }
        if (error.code === error.PERMISSION_DENIED) {
          onLocationDenied();
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const handleRetry = () => {
    setIsRetrying(true);
    requestLocation();
  };

  const handleSkip = () => {
    setPermissionState('denied');
    onLocationDenied();
  };

  const openLocationSettings = () => {
    // Instructions for enabling location
    alert(`To enable location access:

1. Click the location icon (🔒 or 🌐) in your browser's address bar
2. Select "Allow" for location permissions
3. Refresh this page and try again

Or check your browser settings:
- Chrome: Settings > Privacy & Security > Site Settings > Location
- Firefox: Settings > Privacy & Security > Permissions > Location
- Safari: Preferences > Websites > Location`);
  };

  if (permissionState === 'granted') {
    return (
      <InfoCard className="bg-green-50 border-green-200" dataAos="fade-up">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-green-900">Location Access Granted</h3>
            <p className="text-sm text-green-700">
              We can now show you accurate nearby pharmacies.
            </p>
          </div>
        </div>
      </InfoCard>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Permission Card */}
      <InfoCard className="border-blue-200 bg-blue-50" dataAos="fade-up">
        <div className="text-center space-y-4">
          {/* Icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
            {permissionState === 'requesting' ? (
              <RefreshCw className="h-8 w-8 text-white animate-spin" />
            ) : (
              <MapPin className="h-8 w-8 text-white" />
            )}
          </div>

          {/* Title and Description */}
          <div>
            <h2 className="text-xl font-bold text-blue-900 mb-2">{title}</h2>
            <p className="text-blue-700 text-sm leading-relaxed">
              {description}
            </p>
          </div>

          {/* Benefits */}
          <div className="bg-white/60 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-blue-900 text-sm">Why we need your location:</h4>
            <div className="space-y-2 text-xs text-blue-700">
              <div className="flex items-center space-x-2">
                <Navigation className="h-3 w-3" />
                <span>Find pharmacies closest to you</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-3 w-3" />
                <span>Show accurate distances and directions</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-3 w-3" />
                <span>Your location data stays private and secure</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {permissionState === 'pending' && (
              <Button 
                onClick={requestLocation}
                className="w-full"
                size="lg"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Enable Location Access
              </Button>
            )}

            {permissionState === 'requesting' && (
              <Button 
                disabled
                className="w-full"
                size="lg"
              >
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Requesting Location...
              </Button>
            )}

            {(permissionState === 'error' || permissionState === 'denied') && (
              <div className="space-y-2">
                <Button 
                  onClick={handleRetry}
                  className="w-full"
                  size="lg"
                  disabled={isRetrying}
                >
                  {isRetrying ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Retrying...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Try Again
                    </>
                  )}
                </Button>
                
                {permissionState === 'denied' && (
                  <Button 
                    onClick={openLocationSettings}
                    variant="outline"
                    className="w-full"
                    size="sm"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Location Settings Help
                  </Button>
                )}
              </div>
            )}

            {!isRequired && (
              <Button 
                onClick={handleSkip}
                variant="ghost"
                size="sm"
                className="text-gray-600"
              >
                Skip for now
              </Button>
            )}
          </div>
        </div>
      </InfoCard>

      {/* Error Message */}
      {error && (
        <InfoCard className="bg-red-50 border-red-200" dataAos="fade-up">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-red-900 text-sm">Location Error</h4>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        </InfoCard>
      )}

      {/* Privacy Notice */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 text-xs text-gray-500 bg-gray-50 rounded-full px-3 py-1">
          <Shield className="h-3 w-3" />
          <span>Your location is only used to find nearby pharmacies</span>
        </div>
      </div>
    </div>
  );
};

export default LocationPermissionPrompt;