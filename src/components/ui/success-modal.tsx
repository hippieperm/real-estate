"use client";

import { useEffect, useState } from "react";
import { CheckCircle, X, Sparkles, ArrowRight } from "lucide-react";
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
    } else {
      setShowAnimation(false);
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
          showAnimation ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Confetti Animation */}
      {showConfetti && showAnimation && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <Sparkles
                className={cn(
                  "h-4 w-4 text-yellow-400",
                  i % 3 === 0 && "text-blue-400",
                  i % 3 === 1 && "text-pink-400",
                  i % 3 === 2 && "text-green-400"
                )}
              />
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <div
        className={cn(
          "relative bg-white rounded-2xl shadow-2xl border border-white/20 backdrop-blur-xl max-w-md w-full mx-4 transform transition-all duration-300",
          showAnimation
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4"
        )}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors duration-200 z-10"
        >
          <X className="h-4 w-4 text-slate-500" />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Success Icon */}
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            {/* Pulse Animation */}
            <div className="absolute inset-0 w-20 h-20 bg-green-400/30 rounded-full mx-auto animate-ping"></div>
            <div className="absolute inset-2 w-16 h-16 bg-green-400/20 rounded-full mx-auto animate-pulse"></div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-slate-800 mb-3">{title}</h2>

          {/* Message */}
          <p className="text-slate-600 mb-8 leading-relaxed">{message}</p>

          {/* Action Button */}
          <Button
            onClick={handleConfirm}
            className="w-full h-12 gradient-blue text-white border-0 shadow-glow hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            {confirmText}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-400/20 rounded-full animate-float"></div>
        <div
          className="absolute -top-1 -right-3 w-3 h-3 bg-purple-400/20 rounded-full animate-float"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute -bottom-2 -left-1 w-5 h-5 bg-pink-400/20 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute -bottom-1 -right-2 w-2 h-2 bg-emerald-400/20 rounded-full animate-float"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>
    </div>
  );
}
