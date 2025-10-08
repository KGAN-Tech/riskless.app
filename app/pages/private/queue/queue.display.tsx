import { motion, AnimatePresence } from "framer-motion";
import { Users } from "lucide-react";
import { useEffect, useState } from "react";
import FTCCMedical from "@/assets/imgs/FTCC-Medical.png";

interface PatientDetails {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  sex?: "male" | "female";
  birthDate?: string;
  userName?: string;
}

interface WaitingPatient {
  id: string;
  number: string;
  status: "waiting" | "next" | "now_serving";
  patient: PatientDetails;
}

interface Counter {
  id: string;
  title: string;
  counterNumber: string;
  currentNumber: number | null;
  waitingCount: number;
  isVisible: boolean;
  isActive: boolean;
  nextPatient?: number | null;
  isProcessing?: boolean;
  processingStartTime?: number;
  estimatedProcessingTime?: number;
  stepOrder: number;
  currentPatient?: PatientDetails | null;
  waitingPatients?: WaitingPatient[];
}

interface QueueDisplayProps {
  counters: Counter[];
  isFullscreen: boolean;
}

// Mock announcements
const announcements = [
  "📢 Free check-up available every Friday!",
  "💉 Flu vaccines are now available at the clinic.",
  "🕒 New clinic hours: Mon–Sat, 8 AM – 6 PM.",
];

export default function QueueDisplay({ counters, isFullscreen }: QueueDisplayProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const visibleCounters = counters
    .filter((c) => c.isVisible)
    .sort((a, b) => a.stepOrder - b.stepOrder);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Rotate announcements every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  if (visibleCounters.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900 text-white">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold">No Active Counters</h2>
          <p className="text-gray-300">Please configure counters in the admin panel</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={FTCCMedical} alt="FTCC Medical Inc." className="h-12 w-auto" />
              <div>
                <h1 className="text-2xl font-bold text-white">QUEUE MANAGEMENT SYSTEM</h1>
                <p className="text-blue-200 text-sm">Real-time Patient Queue Display</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-mono font-bold text-white">
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="text-blue-200 text-sm">
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Queue Display */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {visibleCounters.map((counter, index) => (
            <motion.div
              key={counter.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden"
            >
              {/* Counter Header */}
              <div
                className={`p-6 ${
                  counter.isActive
                    ? "bg-gradient-to-r from-emerald-500 to-cyan-500"
                    : "bg-gradient-to-r from-gray-600 to-gray-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold">{counter.counterNumber}</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{counter.title}</h2>
                      <p className="text-white/80 text-sm">Counter {counter.counterNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        counter.isActive ? "bg-green-400 animate-pulse" : "bg-red-400"
                      }`}
                    />
                    <span className="text-sm font-medium">
                      {counter.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Now Serving Section */}
              <div className="p-6 text-center border-b border-white/10">
                <div className="text-blue-300 text-sm font-medium mb-2 uppercase tracking-wide">
                  Now Serving
                </div>

                {counter.currentNumber ? (
                  <div>
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-8xl font-black text-yellow-400 mb-4 font-mono"
                    >
                      {String(counter.currentNumber).padStart(3, "0")}
                    </motion.div>

                    {counter.currentPatient && (
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={counter.currentPatient.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="bg-white/10 rounded-xl p-4 backdrop-blur-sm"
                        >
                          <div className="text-white text-xl font-semibold">
                            {`${counter.currentPatient.firstName} ${counter.currentPatient.lastName}`.toUpperCase()}
                          </div>
                          {counter.currentPatient.userName && (
                            <div className="text-blue-200 text-sm mt-1">
                              @{counter.currentPatient.userName}
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    )}
                  </div>
                ) : (
                  <div className="text-6xl font-black text-gray-500 font-mono">---</div>
                )}
              </div>

              {/* Next Patient */}
              <div className="px-6 py-4 bg-white/5 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-blue-300 text-sm font-medium uppercase tracking-wide">
                    Next Patient
                  </span>
                  <div className="text-2xl font-bold font-mono text-orange-400">
                    {counter.nextPatient ? String(counter.nextPatient).padStart(3, "0") : "---"}
                  </div>
                </div>
              </div>

              {/* Waiting List */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-blue-300 text-sm font-medium uppercase tracking-wide">
                    Waiting Queue
                  </span>
                  <div className="bg-blue-500/20 px-3 py-1 rounded-full">
                    <span className="text-blue-300 text-sm font-bold">
                      {counter.waitingCount} people
                    </span>
                  </div>
                </div>

                {counter.waitingPatients && counter.waitingPatients.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {counter.waitingPatients
                      .sort((a, b) => {
                        // Sort "next" patients first, then by queue number
                        if (a.status === "next" && b.status !== "next") return -1;
                        if (b.status === "next" && a.status !== "next") return 1;
                        return parseInt(a.number) - parseInt(b.number);
                      })
                      .slice(0, 8)
                      .map((waitingPatient, idx) => (
                        <motion.div
                          key={waitingPatient.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className={`flex items-center gap-4 rounded-lg p-3 border ${
                            waitingPatient.status === "next"
                              ? "bg-orange-500/20 border-orange-400/50"
                              : "bg-white/5 border-white/10"
                          }`}
                        >
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              waitingPatient.status === "next"
                                ? "bg-gradient-to-r from-orange-500 to-yellow-500"
                                : "bg-gradient-to-r from-blue-500 to-cyan-500"
                            }`}
                          >
                            <span className="text-white font-bold font-mono text-sm">
                              #{waitingPatient.number}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="text-white font-semibold truncate">
                                {`${waitingPatient.patient.firstName} ${waitingPatient.patient.lastName}`.toUpperCase()}
                              </div>
                              {waitingPatient.status === "next" && (
                                <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                  NEXT
                                </span>
                              )}
                            </div>
                            {waitingPatient.patient.userName && (
                              <div className="text-blue-200 text-xs truncate">
                                @{waitingPatient.patient.userName}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}

                    {counter.waitingPatients.length > 8 && (
                      <div className="text-center py-2">
                        <span className="text-gray-400 text-sm">
                          +{counter.waitingPatients.length - 8} more patients waiting...
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No patients waiting</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white/5 backdrop-blur-sm border-t border-white/10 mt-8">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-300 text-sm font-medium">LIVE UPDATES</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={announcementIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="text-center flex-1 mx-8"
              >
                <p className="text-blue-200 text-lg font-medium">
                  {announcements[announcementIndex]}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="text-blue-300 text-sm">
              FTCC Medical Inc. © {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
