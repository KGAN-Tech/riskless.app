import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import AOS from "aos";
import "aos/dist/aos.css";

interface FlippableCardProps {
  userId: string;
  userName: string;
  memberType: string;
}

export function FlippableCard({ userId, userName, memberType }: FlippableCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className="perspective-1000 w-full max-w-sm mx-auto"
      data-aos="zoom-in"
    >
      <div
        className="relative w-full h-64 cursor-pointer transition-transform duration-700"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
        onClick={handleFlip}
      >
        {/* Front of card */}
        <div
          className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-8 text-white shadow-lg flex flex-col justify-between"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex justify-between items-start">
            <div className="w-8 h-5 bg-white/20 rounded"></div>
            <div className="text-right">
              <p className="text-xs opacity-80">Digital ID</p>
              <div className="flex items-center gap-2 mt-2">
                <QRCode value={userId} size={15} />
                <span className="text-xs">Tap to view QR</span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs opacity-80 mb-1">{memberType}</p>
            <h2 className="text-xl font-semibold mb-1 uppercase">{userName} </h2>
            <p className="text-sm opacity-90">{userId}</p>
          </div>
        </div>

        {/* Back of card */}
        <div
          className="absolute inset-0 w-full h-full bg-white rounded-xl p-8 shadow-lg flex flex-col items-center justify-center border text-center"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
          }}
        >
          <h3 className="text-lg font-medium mb-2">Scan to Proceed</h3>
          <p className="text-sm text-gray-500 mb-4">
            Present this QR code for transaction.
          </p>
          <div className="w-32 h-32 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center mb-4">
            <QRCode value={userId} size={100} />
          </div>
          <p className="text-xs text-gray-500">Member ID: {userId}</p>
          <p className="text-xs font-medium mt-1">Tap to flip back</p>
        </div>
      </div>
    </div>
  );
}
