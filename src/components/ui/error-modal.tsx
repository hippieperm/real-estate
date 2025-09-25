"use client";

import { useEffect, useState } from "react";
import { XCircle, X, AlertTriangle, RefreshCw, ShieldAlert, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
  showRetryButton?: boolean;
  type?: "error" | "warning" | "info";
}

export function ErrorModal({
  isOpen,
  onClose,
  title = "오류 발생",
  message = "문제가 발생했습니다. 다시 시도해주세요.",
  onRetry,
  retryText = "다시 시도",
  showRetryButton = true,
  type = "error",
}: ErrorModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [shakeAnimation, setShakeAnimation] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => {
        setShowAnimation(true);
        setShakeAnimation(true);
        setTimeout(() => setShakeAnimation(false), 500);
      }, 100);
    } else {
      setShowAnimation(false);
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    }
    onClose();
  };

  const getIconAndColors = () => {
    switch (type) {
      case "warning":
        return {
          Icon: AlertTriangle,
          gradient: "from-amber-400 to-orange-500",
          pulseColor: "bg-amber-400/30",
          innerPulseColor: "bg-amber-400/20",
          decorativeColor: "amber",
          buttonGradient: "from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
        };
      case "info":
        return {
          Icon: Info,
          gradient: "from-blue-400 to-cyan-500",
          pulseColor: "bg-blue-400/30",
          innerPulseColor: "bg-blue-400/20",
          decorativeColor: "blue",
          buttonGradient: "from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
        };
      default:
        return {
          Icon: XCircle,
          gradient: "from-red-400 to-rose-500",
          pulseColor: "bg-red-400/30",
          innerPulseColor: "bg-red-400/20",
          decorativeColor: "red",
          buttonGradient: "from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700"
        };
    }
  };

  const { Icon, gradient, pulseColor, innerPulseColor, decorativeColor, buttonGradient } = getIconAndColors();

  if (!isVisible) return null;

  return (
    <>
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        
        @keyframes error-bounce {
          0% {
            transform: scale(0) rotate(-45deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.1) rotate(10deg);
          }
          75% {
            transform: scale(0.95) rotate(-5deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .shake-animation {
          animation: shake 0.5s ease-in-out;
        }
        
        .error-icon-bounce {
          animation: error-bounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        .float-animation {
          animation: float 3s ease-in-out infinite;
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

        {/* Modal */}
        <div
          className={cn(
            "relative bg-gradient-to-br from-white via-red-50/20 to-pink-50/20 rounded-3xl shadow-2xl border border-white/60 backdrop-blur-xl max-w-md w-full mx-4 transform transition-all duration-500",
            showAnimation
              ? "scale-100 opacity-100 translate-y-0"
              : "scale-95 opacity-0 translate-y-8",
            shakeAnimation && type === "error" && "shake-animation"
          )}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/20 rounded-3xl pointer-events-none" />

          {/* Decorative Background Blobs */}
          <div className={cn(
            "absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl",
            type === "error" && "bg-gradient-to-br from-red-300/30 via-rose-300/30 to-pink-300/30",
            type === "warning" && "bg-gradient-to-br from-amber-300/30 via-orange-300/30 to-yellow-300/30",
            type === "info" && "bg-gradient-to-br from-blue-300/30 via-cyan-300/30 to-sky-300/30"
          )} />
          <div className={cn(
            "absolute -bottom-20 -left-20 w-40 h-40 rounded-full blur-3xl",
            type === "error" && "bg-gradient-to-tr from-pink-300/30 via-red-300/30 to-orange-300/30",
            type === "warning" && "bg-gradient-to-tr from-yellow-300/30 via-amber-300/30 to-orange-300/30",
            type === "info" && "bg-gradient-to-tr from-cyan-300/30 via-blue-300/30 to-indigo-300/30"
          )} />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/50 hover:bg-white/70 transition-all duration-200 z-10 backdrop-blur-sm"
          >
            <X className="h-4 w-4 text-slate-600" />
          </button>

          {/* Content */}
          <div className="relative p-8 text-center">
            {/* Error Icon */}
            <div className="relative mb-8">
              {/* Background Glow */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={cn("w-24 h-24 rounded-full blur-2xl", pulseColor, "animate-pulse")} />
              </div>
              
              {/* Main Icon */}
              <div className={cn(
                "relative w-24 h-24 bg-gradient-to-br rounded-full flex items-center justify-center mx-auto shadow-xl error-icon-bounce",
                gradient
              )}>
                <Icon className="h-12 w-12 text-white" strokeWidth={2.5} />
              </div>
              
              {/* Warning Shield for error type */}
              {type === "error" && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <ShieldAlert className="h-5 w-5 text-red-500" />
                </div>
              )}
            </div>

            {/* Title */}
            <h2 className={cn(
              "text-3xl font-bold mb-4",
              type === "error" && "bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 bg-clip-text text-transparent",
              type === "warning" && "bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent",
              type === "info" && "bg-gradient-to-r from-blue-600 via-cyan-600 to-sky-600 bg-clip-text text-transparent"
            )}>
              {title}
            </h2>

            {/* Message */}
            <p className="text-slate-600 mb-8 leading-relaxed px-4">
              {message}
            </p>

            {/* Error Details (if error type) */}
            {type === "error" && (
              <div className="mb-6 p-4 bg-red-50/50 border border-red-200/50 rounded-xl backdrop-blur-sm">
                <div className="flex items-center justify-center space-x-2 text-sm text-red-700">
                  <AlertTriangle className="h-4 w-4" />
                  <span>문제가 지속되면 고객센터로 문의해주세요</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {showRetryButton && onRetry && (
                <Button
                  onClick={handleRetry}
                  className={cn(
                    "w-full h-12 bg-gradient-to-r text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] font-semibold",
                    buttonGradient
                  )}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {retryText}
                </Button>
              )}
              <Button
                onClick={onClose}
                variant="outline"
                className="w-full h-12 border-2 border-slate-300 bg-white/80 text-slate-700 hover:bg-white hover:text-slate-900 hover:border-slate-400 transition-all duration-300 font-semibold backdrop-blur-sm"
              >
                확인
              </Button>
            </div>

            {/* Bottom Decoration */}
            <div className="mt-6 flex justify-center space-x-2">
              <div className={cn(
                "w-8 h-1 rounded-full",
                type === "error" && "bg-gradient-to-r from-red-400 to-rose-400",
                type === "warning" && "bg-gradient-to-r from-amber-400 to-orange-400",
                type === "info" && "bg-gradient-to-r from-blue-400 to-cyan-400"
              )} />
              <div className={cn(
                "w-8 h-1 rounded-full",
                type === "error" && "bg-gradient-to-r from-rose-400 to-pink-400",
                type === "warning" && "bg-gradient-to-r from-orange-400 to-yellow-400",
                type === "info" && "bg-gradient-to-r from-cyan-400 to-sky-400"
              )} />
              <div className={cn(
                "w-8 h-1 rounded-full",
                type === "error" && "bg-gradient-to-r from-pink-400 to-red-400",
                type === "warning" && "bg-gradient-to-r from-yellow-400 to-amber-400",
                type === "info" && "bg-gradient-to-r from-sky-400 to-blue-400"
              )} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}