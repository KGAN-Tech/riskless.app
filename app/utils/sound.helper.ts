// Sound utility for queue notifications
export class QueueSoundService {
  private static instance: QueueSoundService;
  private audioContext: AudioContext | null = null;

  static getInstance(): QueueSoundService {
    if (!QueueSoundService.instance) {
      QueueSoundService.instance = new QueueSoundService();
    }
    return QueueSoundService.instance;
  }

  private async initAudioContext(): Promise<AudioContext> {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      // Resume audio context if it's suspended (required by Chrome's autoplay policy)
      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }
    }
    return this.audioContext;
  }

  // Play a notification bell sound
  async playNotificationBell(): Promise<void> {
    try {
      const audioContext = await this.initAudioContext();

      // Create a pleasant bell sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Bell-like frequency progression
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5

      // Soft attack and decay for bell effect
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.0);

      oscillator.type = "sine";
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1.0);

      console.log("🔔 [Sound] Played notification bell");
    } catch (error) {
      console.error("Error playing notification bell:", error);
    }
  }

  // Play a success chime
  async playSuccessChime(): Promise<void> {
    try {
      const audioContext = await this.initAudioContext();

      // Create ascending success sound
      const frequencies = [261.63, 329.63, 392.0, 523.25]; // C4, E4, G4, C5

      for (let i = 0; i < frequencies.length; i++) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(frequencies[i], audioContext.currentTime);

        const startTime = audioContext.currentTime + i * 0.1;
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

        oscillator.type = "sine";
        oscillator.start(startTime);
        oscillator.stop(startTime + 0.3);
      }

      console.log("🎵 [Sound] Played success chime");
    } catch (error) {
      console.error("Error playing success chime:", error);
    }
  }

  // Play speech announcement
  async playAnnouncement(
    queueNumber: string,
    patientName: string,
    counterName?: string
  ): Promise<void> {
    try {
      // First play a notification bell
      await this.playNotificationBell();

      // Wait a moment, then speak
      setTimeout(() => {
        const message = counterName
          ? `Now serving number ${queueNumber}. ${patientName}, please proceed to ${counterName}.`
          : `Now serving number ${queueNumber}. ${patientName}, please proceed to the counter.`;

        const utterance = new SpeechSynthesisUtterance(message);
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 0.9;

        // Try to use a pleasant voice
        const voices = speechSynthesis.getVoices();
        const preferredVoice = voices.find(
          (voice) =>
            voice.name.includes("Female") ||
            voice.name.includes("Zira") ||
            voice.name.includes("Hazel") ||
            voice.lang.includes("en")
        );

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        speechSynthesis.speak(utterance);
        console.log(`🔊 [Sound] Playing announcement: ${message}`);
      }, 500);
    } catch (error) {
      console.error("Error playing announcement:", error);
    }
  }

  // Play a simple status update sound
  async playStatusUpdateSound(): Promise<void> {
    try {
      const audioContext = await this.initAudioContext();

      // Create a soft, pleasant notification sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Two-tone notification
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
      oscillator.frequency.setValueAtTime(554.37, audioContext.currentTime + 0.15); // C#5

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);

      oscillator.type = "sine";
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.4);

      console.log("🔊 [Sound] Played status update sound");
    } catch (error) {
      console.error("Error playing status update sound:", error);
    }
  }

  // Test if audio is working
  async testAudio(): Promise<boolean> {
    try {
      await this.playNotificationBell();
      return true;
    } catch (error) {
      console.error("Audio test failed:", error);
      return false;
    }
  }
}

// Export convenience functions
export const soundService = QueueSoundService.getInstance();

export const playNotificationBell = () => soundService.playNotificationBell();
export const playSuccessChime = () => soundService.playSuccessChime();
export const playStatusUpdateSound = () => soundService.playStatusUpdateSound();
export const playAnnouncement = (queueNumber: string, patientName: string, counterName?: string) =>
  soundService.playAnnouncement(queueNumber, patientName, counterName);
