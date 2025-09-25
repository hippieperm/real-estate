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
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    titleColor: 'text-yellow-800',
    border: 'border-yellow-200',
    bg: 'bg-yellow-50'
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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />
        
        <div className="relative transform overflow-hidden rounded-2xl bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
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

          <div className="sm:flex sm:items-start">
            {/* Icon */}
            <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${style.iconBg} sm:mx-0 sm:h-10 sm:w-10`}>
              <Icon className={`h-6 w-6 ${style.iconColor}`} />
            </div>

            {/* Content */}
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 className={`text-base font-semibold leading-6 ${style.titleColor}`}>
                {title}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  {message}
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <Button
              onClick={handleConfirm}
              className={`inline-flex w-full justify-center rounded-xl px-3 py-2 text-sm font-semibold shadow-sm sm:ml-3 sm:w-auto transition-all duration-200 ${
                type === 'success' 
                  ? 'bg-green-600 hover:bg-green-500 text-white' 
                  : type === 'error'
                  ? 'bg-red-600 hover:bg-red-500 text-white'
                  : type === 'warning'
                  ? 'bg-yellow-600 hover:bg-yellow-500 text-white'
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              {confirmText}
            </Button>

            {onConfirm && (
              <Button
                variant="outline"
                onClick={onClose}
                className="mt-3 inline-flex w-full justify-center rounded-xl px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto transition-all duration-200"
              >
                {cancelText}
              </Button>
            )}
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