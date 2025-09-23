"use client";

import { useEffect, useState } from "react";
import { XCircle, X, AlertTriangle, RefreshCw } from "lucide-react";
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
}

export function ErrorModal({
  isOpen,
  onClose,
  title = "오류 발생",
  message = "문제가 발생했습니다. 다시 시도해주세요.",
  onRetry,
  retryText = "다시 시도",
  showRetryButton = true,
}: ErrorModalProps) {
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

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    }
    onClose();
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
          {/* Error Icon */}
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <XCircle className="h-10 w-10 text-white" />
            </div>
            {/* Pulse Animation */}
            <div className="absolute inset-0 w-20 h-20 bg-red-400/30 rounded-full mx-auto animate-ping"></div>
            <div className="absolute inset-2 w-16 h-16 bg-red-400/20 rounded-full mx-auto animate-pulse"></div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-slate-800 mb-3">{title}</h2>

          {/* Message */}
          <p className="text-slate-600 mb-8 leading-relaxed">{message}</p>

          {/* Action Buttons */}
          <div className="space-y-3">
            {showRetryButton && onRetry && (
              <Button
                onClick={handleRetry}
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-glow hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                {retryText}
              </Button>
            )}
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full h-12 border-2 border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-400 transition-all duration-300 font-semibold"
            >
              확인
            </Button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-red-400/20 rounded-full animate-float"></div>
        <div
          className="absolute -top-1 -right-3 w-3 h-3 bg-orange-400/20 rounded-full animate-float"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute -bottom-2 -left-1 w-5 h-5 bg-yellow-400/20 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute -bottom-1 -right-2 w-2 h-2 bg-red-400/20 rounded-full animate-float"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>
    </div>
  );
}
