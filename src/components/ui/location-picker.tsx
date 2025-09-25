"use client"

import { Button } from '@/components/ui/button'
import { MapPin } from 'lucide-react'

interface LocationPickerProps {
  onLocationSelect: (location: {
    address: string
    latitude: number
    longitude: number
    roadAddress?: string
    jibunAddress?: string
  }) => void
  initialAddress?: string
  className?: string
}

export function LocationPicker({ onLocationSelect, initialAddress = '', className }: LocationPickerProps) {




  const openLocationWindow = () => {
    const popup = window.open(
      '/location-picker',
      'location-picker',
      'width=1400,height=900,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,status=no'
    )
    
    if (popup) {
      const messageHandler = (event: MessageEvent) => {
        if (event.data.type === 'LOCATION_SELECTED') {
          onLocationSelect(event.data.location)
          window.removeEventListener('message', messageHandler)
        }
      }
      
      window.addEventListener('message', messageHandler)
      
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          window.removeEventListener('message', messageHandler)
          clearInterval(checkClosed)
        }
      }, 1000)
    }
  }



  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={openLocationWindow}
        className={`h-16 w-full justify-between text-left border-2 border-dashed border-blue-300 hover:border-blue-500 bg-white hover:bg-blue-50/30 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 group ${className}`}
      >
        <div className="flex items-center flex-1 min-w-0">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mr-4 group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-200 shadow-md flex-shrink-0">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-base font-bold text-gray-900 mb-1">
              {initialAddress ? '✅ 선택된 위치' : '📍 위치 선택'}
            </div>
            <div className="text-sm font-medium text-gray-700 truncate pr-4">
              {initialAddress ? (
                <span className="text-blue-700 bg-blue-50 px-2 py-1 rounded-md">
                  {initialAddress}
                </span>
              ) : (
                <span className="text-gray-600">
                  지도에서 클릭하거나 주소를 검색하세요
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center shadow-md group-hover:shadow-lg transition-all duration-200 flex-shrink-0">
          지도 열기
          <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Button>

    </>
  )
}