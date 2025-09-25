"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, MapPin, X } from 'lucide-react'

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
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedLocation, setSelectedLocation] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [mapLoading, setMapLoading] = useState(true)
  const [mapError, setMapError] = useState<string | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const kakaoMapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)

  useEffect(() => {
    if (isOpen && mapRef.current) {
      setMapLoading(true)
      setMapError(null)
      
      // Kakao Maps API 로딩 대기
      let retryCount = 0
      const maxRetries = 50 // 5초 대기
      
      const initMap = () => {
        if (window.kakao && window.kakao.maps) {
          initializeMap()
        } else if (retryCount < maxRetries) {
          retryCount++
          setTimeout(initMap, 100)
        } else {
          setMapLoading(false)
          setMapError('지도를 로드할 수 없습니다. 페이지를 새로고침해주세요.')
        }
      }
      initMap()
    }
  }, [isOpen])

  const initializeMap = () => {
    if (typeof window === 'undefined' || !window.kakao || !window.kakao.maps) {
      console.error('Kakao Maps API not loaded')
      setMapLoading(false)
      setMapError('지도 API를 로드할 수 없습니다.')
      return
    }

    try {
      const { kakao } = window
      
      // 지도 옵션
      const options = {
        center: new kakao.maps.LatLng(37.5665, 126.9780), // 서울 중심
        level: 3,
        mapTypeId: kakao.maps.MapTypeId.ROADMAP
      }

      // 지도 생성
      const map = new kakao.maps.Map(mapRef.current, options)
      kakaoMapRef.current = map

      // 지도 로딩 완료 후 처리
      kakao.maps.event.addListener(map, 'tilesloaded', () => {
        setMapLoading(false)
        setMapError(null)
        
        // 크기 재조정
        setTimeout(() => {
          if (map) {
            map.relayout()
          }
        }, 100)
      })

      // 지도 클릭 이벤트
      kakao.maps.event.addListener(map, 'click', (mouseEvent: any) => {
        const latlng = mouseEvent.latLng
        addMarker(latlng)
        searchAddressByCoordinates(latlng.getLat(), latlng.getLng())
      })

      // 3초 후에도 로딩 중이면 강제로 로딩 완료
      setTimeout(() => {
        if (mapLoading) {
          setMapLoading(false)
        }
      }, 3000)
      
    } catch (error) {
      console.error('Error initializing map:', error)
      setMapLoading(false)
      setMapError('지도 초기화에 실패했습니다.')
    }
  }

  const addMarker = (position: any) => {
    if (!kakaoMapRef.current) return

    const { kakao } = window
    
    // 기존 마커 제거
    if (markerRef.current) {
      markerRef.current.setMap(null)
    }

    // 새 마커 생성
    const marker = new kakao.maps.Marker({
      position: position
    })

    marker.setMap(kakaoMapRef.current)
    markerRef.current = marker
  }

  const searchAddressByCoordinates = (lat: number, lng: number) => {
    if (!window.kakao) return

    const { kakao } = window
    const geocoder = new kakao.maps.services.Geocoder()

    geocoder.coord2Address(lng, lat, (result: any, status: any) => {
      if (status === kakao.maps.services.Status.OK) {
        const address = result[0]
        setSelectedLocation({
          latitude: lat,
          longitude: lng,
          roadAddress: address.road_address?.address_name || '',
          jibunAddress: address.address?.address_name || '',
          address: address.road_address?.address_name || address.address?.address_name || ''
        })
      }
    })
  }

  const searchAddress = async () => {
    if (!searchTerm.trim() || !window.kakao) return

    setIsLoading(true)
    const { kakao } = window
    const geocoder = new kakao.maps.services.Geocoder()

    geocoder.addressSearch(searchTerm, (result: any, status: any) => {
      setIsLoading(false)
      
      if (status === kakao.maps.services.Status.OK) {
        setSearchResults(result)
      } else {
        setSearchResults([])
      }
    })
  }

  const selectSearchResult = (result: any) => {
    const lat = parseFloat(result.y)
    const lng = parseFloat(result.x)
    
    if (kakaoMapRef.current) {
      const position = new window.kakao.maps.LatLng(lat, lng)
      kakaoMapRef.current.setCenter(position)
      addMarker(position)
    }

    setSelectedLocation({
      latitude: lat,
      longitude: lng,
      roadAddress: result.road_address?.address_name || '',
      jibunAddress: result.address_name || '',
      address: result.road_address?.address_name || result.address_name || ''
    })

    setSearchResults([])
    setSearchTerm('')
  }

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation)
      setIsOpen(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchAddress()
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(true)}
        className={`h-12 w-full justify-between text-left border-2 border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/50 hover:bg-blue-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group ${className}`}
      >
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg mr-3 group-hover:bg-blue-200 transition-colors">
            <MapPin className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">
              {initialAddress ? '선택된 위치' : '위치 선택'}
            </div>
            <div className="text-xs text-gray-500 truncate max-w-[300px]">
              {initialAddress || '지도에서 클릭하거나 주소를 검색하세요'}
            </div>
          </div>
        </div>
        <div className="text-xs text-blue-600 font-medium flex items-center">
          지도 열기
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* 헤더 */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">위치 선택</h2>
                <p className="text-sm text-gray-500 hidden sm:block">지도를 클릭하거나 주소를 검색하세요</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="p-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* 검색 바 */}
            <div className="p-4 border-b border-gray-100 flex-shrink-0">
              <div className="relative flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative">
                  <Input
                    placeholder="도로명 주소 입력 (예: 강남구 테헤란로 123)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pr-10 h-10 sm:h-12 rounded-xl text-sm"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <Button
                  onClick={searchAddress}
                  disabled={isLoading}
                  className="h-10 sm:h-12 px-4 sm:px-6 rounded-xl text-sm"
                >
                  {isLoading ? '검색중...' : '검색'}
                </Button>
              </div>

              {/* 검색 결과 */}
              {searchResults.length > 0 && (
                <div className="mt-3 max-h-32 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => selectSearchResult(result)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {result.road_address?.address_name || result.address_name}
                      </div>
                      {result.road_address && (
                        <div className="text-xs text-gray-500 mt-1 truncate">
                          지번: {result.address_name}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 지도 */}
            <div className="flex-1 relative min-h-[300px] sm:min-h-[400px]">
              <div ref={mapRef} className="w-full h-full" />
              
              {/* 로딩 상태 */}
              {mapLoading && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 text-sm">지도를 로딩중입니다...</p>
                  </div>
                </div>
              )}

              {/* 에러 상태 */}
              {mapError && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MapPin className="h-6 w-6 text-red-500" />
                    </div>
                    <p className="text-red-600 text-sm font-medium mb-2">지도 로딩 실패</p>
                    <p className="text-gray-500 text-xs mb-4">{mapError}</p>
                    <Button
                      onClick={() => {
                        setMapError(null)
                        if (isOpen && mapRef.current) {
                          setMapLoading(true)
                          initializeMap()
                        }
                      }}
                      size="sm"
                      className="text-xs"
                    >
                      다시 시도
                    </Button>
                  </div>
                </div>
              )}
              
              {/* 선택된 위치 정보 */}
              {selectedLocation && !mapLoading && !mapError && (
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-3 sm:p-4 rounded-xl shadow-lg border border-gray-200">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                        {selectedLocation.roadAddress || selectedLocation.address}
                      </div>
                      {selectedLocation.jibunAddress && selectedLocation.roadAddress && (
                        <div className="text-xs text-gray-500 mt-1 truncate">
                          지번: {selectedLocation.jibunAddress}
                        </div>
                      )}
                      <div className="text-xs text-gray-400 mt-1 hidden sm:block">
                        위도: {selectedLocation.latitude.toFixed(6)}, 경도: {selectedLocation.longitude.toFixed(6)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 푸터 */}
            <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3 flex-shrink-0">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="px-6 order-2 sm:order-1"
              >
                취소
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={!selectedLocation}
                className="px-6 bg-blue-600 hover:bg-blue-700 order-1 sm:order-2"
              >
                선택 완료
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}