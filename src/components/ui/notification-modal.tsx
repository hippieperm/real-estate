"use client"

import { Fragment, useState } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { Button } from './button'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

interface NotificationModalProps {
  isOpen: boolean
  onClose: () => void
  type: NotificationType
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
}

const notificationStyles = {
  success: {
    icon: CheckCircle,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    titleColor: 'text-green-800',
    border: 'border-green-200',
    bg: 'bg-green-50'
  },
  error: {
    icon: XCircle,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    titleColor: 'text-red-800',
    border: 'border-red-200',
    bg: 'bg-red-50'
  },
  warning: {
    icon: AlertTriangle,
    iconBg: 'bg-gradient-to-r from-red-100 to-orange-100',
    iconColor: 'text-red-600',
    titleColor: 'text-red-800',
    border: 'border-red-300',
    bg: 'bg-gradient-to-br from-red-50 to-orange-50'
  },
  info: {
    icon: Info,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    titleColor: 'text-blue-800',
    border: 'border-blue-200',
    bg: 'bg-blue-50'
  }
}

export function NotificationModal({
  isOpen,
  onClose,
  type,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm
}: NotificationModalProps) {
  if (!isOpen) return null

  const style = notificationStyles[type]
  const Icon = style.icon

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    } else {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        <div className={`relative transform overflow-hidden rounded-3xl px-8 pb-8 pt-8 text-left shadow-2xl transition-all w-full max-w-md ${style.bg} ${style.border} border-2`}>
          {/* Close button */}
          <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex flex-col items-center text-center">
            {/* Icon */}
            <div className={`flex h-20 w-20 items-center justify-center rounded-full ${style.iconBg} mb-6 shadow-lg`}>
              <Icon className={`h-10 w-10 ${style.iconColor} animate-pulse`} />
            </div>

            {/* Content */}
            <div className="w-full">
              <h3 className={`text-2xl font-bold leading-6 ${style.titleColor} mb-4`}>
                {title}
              </h3>
              <div className="mb-6">
                <p className="text-lg text-gray-700 font-medium leading-relaxed">
                  {message}
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 w-full">
            {onConfirm && (
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 h-14 text-lg font-bold text-gray-700 hover:text-gray-800 bg-white border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 rounded-2xl transition-all duration-300 hover:scale-105"
              >
                {cancelText}
              </Button>
            )}
            <Button
              onClick={handleConfirm}
              className={`flex-1 h-14 text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg ${type === 'success'
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                : type === 'error'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white'
                  : type === 'warning'
                    ? 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                }`}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Custom hook for easier usage
export function useNotificationModal() {
  const [modal, setModal] = useState<{
    isOpen: boolean
    type: NotificationType
    title: string
    message: string
    onConfirm?: () => void
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  })

  const showNotification = (
    type: NotificationType,
    title: string,
    message: string,
    onConfirm?: () => void
  ) => {
    setModal({
      isOpen: true,
      type,
      title,
      message,
      onConfirm
    })
  }

  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }))
  }

  const showSuccess = (title: string, message: string) =>
    showNotification('success', title, message)

  const showError = (title: string, message: string) =>
    showNotification('error', title, message)

  const showWarning = (title: string, message: string, onConfirm?: () => void) =>
    showNotification('warning', title, message, onConfirm)

  const showInfo = (title: string, message: string) =>
    showNotification('info', title, message)

  return {
    modal,
    closeModal,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}