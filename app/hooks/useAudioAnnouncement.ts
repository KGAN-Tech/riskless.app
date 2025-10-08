import { useCallback, useRef, useState, useEffect } from 'react';

export interface VoiceSettings {
  voiceURI: string;
  rate: number;
  volume: number;
  pitch: number;
}

export function useAudioAnnouncement() {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    voiceURI: '',
    rate: 0.8,
    volume: 0.8,
    pitch: 1
  });

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      // Set default voice (prefer English voices)
      if (availableVoices.length > 0 && !voiceSettings.voiceURI) {
        const englishVoice = availableVoices.find(voice => 
          voice.lang.startsWith('en')
        ) || availableVoices[0];
        
        setVoiceSettings(prev => ({
          ...prev,
          voiceURI: englishVoice.voiceURI
        }));
      }
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
    
    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [voiceSettings.voiceURI]);

  const announce = useCallback((message: string) => {
    // Cancel any ongoing speech
    if (utteranceRef.current) {
      speechSynthesis.cancel();
    }

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(message);
    
    // Find selected voice
    const selectedVoice = voices.find(voice => voice.voiceURI === voiceSettings.voiceURI);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.rate = voiceSettings.rate;
    utterance.volume = voiceSettings.volume;
    utterance.pitch = voiceSettings.pitch;

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  }, [voices, voiceSettings]);

  const stop = useCallback(() => {
    speechSynthesis.cancel();
  }, []);

  const updateVoiceSettings = useCallback((settings: Partial<VoiceSettings>) => {
    setVoiceSettings(prev => ({ ...prev, ...settings }));
  }, []);

  return { 
    announce, 
    stop, 
    voices, 
    voiceSettings, 
    updateVoiceSettings 
  };
}