"use client";

import { useEffect, useState } from "react";
import { CheckCircle, X, Sparkles, ArrowRight, Gift, Star, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  onConfirm?: () => void;
  confirmText?: string;
  showConfetti?: boolean;
}

export function SuccessModal({
  isOpen,
  onClose,
  title = "성공!",
  message = "작업이 완료되었습니다.",
  onConfirm,
  confirmText = "확인",
  showConfetti = true,
}: SuccessModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setShowAnimation(true), 100);
      
      // Create confetti effect
      if (showConfetti && typeof window !== 'undefined') {
        createConfettiEffect();
      }
    } else {
      setShowAnimation(false);
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen, showConfetti]);

  const createConfettiEffect = () => {
    const colors = ['#fbbf24', '#a78bfa', '#60a5fa', '#34d399', '#f87171'];
    const confettiCount = 150;
    const container = document.getElementById('confetti-container');
    
    if (!container) return;
    
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-piece';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.animationDelay = Math.random() * 3 + 's';
      confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
      container.appendChild(confetti);
    }
    
    setTimeout(() => {
      container.innerHTML = '';
    }, 5000);
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        @keyframes success-bounce {
          0% {
            transform: scale(0) rotate(45deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        
        @keyframes sparkle-rotate {
          0% {
            transform: rotate(0deg) scale(0);
          }
          50% {
            transform: rotate(180deg) scale(1.2);
          }
          100% {
            transform: rotate(360deg) scale(0);
          }
        }
        
        @keyframes glow-pulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.4);
          }
          50% {
            box-shadow: 0 0 40px rgba(34, 197, 94, 0.6);
          }
        }
        
        .confetti-piece {
          position: absolute;
          width: 10px;
          height: 10px;
          animation: confetti-fall linear infinite;
        }
        
        .success-icon-bounce {
          animation: success-bounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        .sparkle-animation {
          animation: sparkle-rotate 2s ease-in-out infinite;
        }
        
        .glow-effect {
          animation: glow-pulse 2s ease-in-out infinite;
        }
      `}</style>

      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div
          className={cn(
            "absolute inset-0 bg-black/60 backdrop-blur-md transition-all duration-500",
            showAnimation ? "opacity-100" : "opacity-0"
          )}
          onClick={onClose}
        />

        {/* Confetti Container */}
        {showConfetti && (
          <div 
            id="confetti-container" 
            className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
          />
        )}

        {/* Modal */}
        <div
          className={cn(
            "relative bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-3xl shadow-2xl border border-white/60 backdrop-blur-xl max-w-md w-full mx-4 transform transition-all duration-500",
            showAnimation
              ? "scale-100 opacity-100 translate-y-0"
              : "scale-95 opacity-0 translate-y-8"
          )}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/20 rounded-3xl pointer-events-none" />

          {/* Decorative Background Blobs */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-emerald-300/30 via-blue-300/30 to-purple-300/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-pink-300/30 via-yellow-300/30 to-orange-300/30 rounded-full blur-3xl" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/50 hover:bg-white/70 transition-all duration-200 z-10 backdrop-blur-sm"
          >
            <X className="h-4 w-4 text-slate-600" />
          </button>

          {/* Content */}
          <div className="relative p-8 text-center">
            {/* Success Icon Stack */}
            <div className="relative mb-8">
              {/* Background Glow */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-400/40 to-green-500/40 rounded-full blur-2xl glow-effect" />
              </div>
              
              {/* Main Success Icon */}
              <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto shadow-xl success-icon-bounce">
                <CheckCircle className="h-12 w-12 text-white" strokeWidth={2.5} />
              </div>
              
              {/* Sparkles Around Icon */}
              <Sparkles className="absolute top-0 right-2 h-5 w-5 text-yellow-400 sparkle-animation" />
              <Star className="absolute bottom-2 left-0 h-4 w-4 text-blue-400 sparkle-animation" style={{ animationDelay: '0.5s' }} />
              <Sparkles className="absolute top-4 left-2 h-3 w-3 text-purple-400 sparkle-animation" style={{ animationDelay: '1s' }} />
              <Star className="absolute bottom-0 right-4 h-5 w-5 text-pink-400 sparkle-animation" style={{ animationDelay: '1.5s' }} />
            </div>

            {/* Title with Gradient */}
            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
              {title}
            </h2>

            {/* Message */}
            <p className="text-slate-600 mb-8 leading-relaxed px-4">
              {message}
            </p>

            {/* Benefits Grid */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-3 backdrop-blur-sm">
                <Gift className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                <span className="text-xs text-blue-700 font-medium">특별 혜택</span>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-3 backdrop-blur-sm">
                <Trophy className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                <span className="text-xs text-purple-700 font-medium">프리미엄</span>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-3 backdrop-blur-sm">
                <Star className="h-6 w-6 text-emerald-600 mx-auto mb-1" />
                <span className="text-xs text-emerald-700 font-medium">VIP 서비스</span>
              </div>
            </div>

            {/* Action Button */}
            <Button
              onClick={handleConfirm}
              className="w-full h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 font-semibold"
            >
              {confirmText}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            {/* Bottom Decoration */}
            <div className="mt-6 flex justify-center space-x-2">
              <div className="w-8 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" />
              <div className="w-8 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
              <div className="w-8 h-1 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}