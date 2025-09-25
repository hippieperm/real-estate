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
    console.log('initializeMap 시작')
    
    if (typeof window === 'undefined') {
      console.error('Window is undefined')
      setMapLoading(false)
      setMapError('브라우저 환경이 아닙니다.')
      return
    }

    if (!window.kakao) {
      console.error('Kakao object not found')
      setMapLoading(false)
      setMapError('Kakao Maps API가 로드되지 않았습니다.')
      return
    }

    // Kakao Maps API 완전 로딩 대기 (더 안정적인 방식)
    const initKakaoMap = () => {
      console.log('Kakao 상태 확인:', {
        kakao: !!window.kakao,
        maps: !!window.kakao?.maps,
        LatLng: !!window.kakao?.maps?.LatLng,
        Map: !!window.kakao?.maps?.Map
      })

      // 완전히 로드되지 않은 경우 kakao.maps.load() 사용
      if (!window.kakao.maps || !window.kakao.maps.LatLng) {
        console.log('Kakao Maps API 완전 로딩 대기중...')
        
        // kakao.maps.load가 없는 경우를 위한 폴백
        if (typeof window.kakao.maps?.load === 'function') {
          window.kakao.maps.load(() => {
            console.log('kakao.maps.load() 완료')
            // 로드 완료 후 다시 한번 확인
            setTimeout(() => {
              if (window.kakao.maps && window.kakao.maps.LatLng) {
                createMap()
              } else {
                console.error('kakao.maps.load() 후에도 LatLng를 사용할 수 없음')
                setMapLoading(false)
                setMapError('Kakao Maps API 초기화에 실패했습니다.')
              }
            }, 100)
          })
        } else {
          // kakao.maps.load가 없는 경우 재시도
          let retryCount = 0
          const maxRetries = 50
          
          const checkAndRetry = () => {
            if (window.kakao.maps && window.kakao.maps.LatLng) {
              createMap()
            } else if (retryCount < maxRetries) {
              retryCount++
              console.log(`재시도 ${retryCount}/${maxRetries}`)
              setTimeout(checkAndRetry, 100)
            } else {
              setMapLoading(false)
              setMapError('Kakao Maps API 로딩 타임아웃')
            }
          }
          
          checkAndRetry()
        }
      } else {
        console.log('Kakao Maps API 이미 준비됨')
        createMap()
      }
    }

    const createMap = () => {
      try {
        console.log('지도 생성 시작')
        
        // 필수 객체들이 모두 있는지 확인
        if (!window.kakao) {
          throw new Error('window.kakao 객체를 찾을 수 없습니다')
        }
        
        if (!window.kakao.maps) {
          throw new Error('window.kakao.maps 객체를 찾을 수 없습니다')
        }
        
        if (!window.kakao.maps.LatLng) {
          throw new Error('kakao.maps.LatLng 생성자를 찾을 수 없습니다')
        }
        
        if (!window.kakao.maps.Map) {
          throw new Error('kakao.maps.Map 생성자를 찾을 수 없습니다')
        }
        
        if (!mapRef.current) {
          throw new Error('지도를 표시할 DOM 요소를 찾을 수 없습니다')
        }

        const { kakao } = window
        
        // 지도 옵션
        const options = {
          center: new kakao.maps.LatLng(37.5665, 126.9780), // 서울 중심
          level: 3,
          mapTypeId: kakao.maps.MapTypeId.ROADMAP
        }

        console.log('Kakao Maps 객체 생성 시도')
        
        // 지도 생성
        const map = new kakao.maps.Map(mapRef.current, options)
        kakaoMapRef.current = map
        console.log('지도 생성 완료')

        // 지도 로딩 완료 후 처리
        kakao.maps.event.addListener(map, 'tilesloaded', () => {
          console.log('타일 로딩 완료')
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

        // 5초 후에도 로딩 중이면 강제로 로딩 완료
        setTimeout(() => {
          if (mapLoading) {
            console.log('5초 타임아웃으로 로딩 완료 처리')
            setMapLoading(false)
          }
        }, 5000)
        
      } catch (error) {
        console.error('지도 생성 에러:', error)
        setMapLoading(false)
        setMapError(`지도 초기화 실패: ${error.message || error}`)
      }
    }

    initKakaoMap()
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

      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="absolute inset-4 bg-white rounded-3xl shadow-3xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-500">
            {/* 헤더 */}
            <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 p-6 flex items-center justify-between text-white flex-shrink-0">
              <div className="absolute inset-0 bg-black/5"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold">위치 선택</h2>
                    <p className="text-blue-100 text-base mt-1">지도를 클릭하거나 주소를 검색하여 정확한 위치를 선택하세요</p>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                className="relative z-10 bg-white/10 hover:bg-white/20 border-white/20 text-white rounded-full w-12 h-12 p-0 transition-all duration-200"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* 검색 바 */}
            <div className="p-6 sm:p-8 bg-gray-50/50 border-b border-gray-200 flex-shrink-0">
              <div className="relative flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Input
                    placeholder="도로명 주소 입력 (예: 강남구 테헤란로 123)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pr-12 h-14 rounded-2xl text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 shadow-sm hover:shadow-md transition-all duration-200"
                  />
                  <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                </div>
                <Button
                  onClick={searchAddress}
                  disabled={isLoading}
                  className="h-14 px-8 rounded-2xl text-lg font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isLoading ? '검색중...' : '🔍 검색'}
                </Button>
              </div>

              {/* 검색 결과 */}
              {searchResults.length > 0 && (
                <div className="mt-6 max-h-48 overflow-y-auto bg-white border-2 border-gray-200 rounded-2xl shadow-xl">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => selectSearchResult(result)}
                      className="w-full text-left px-6 py-4 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors duration-200 group"
                    >
                      <div className="text-base font-semibold text-gray-900 truncate group-hover:text-blue-700">
                        📍 {result.road_address?.address_name || result.address_name}
                      </div>
                      {result.road_address && (
                        <div className="text-sm text-gray-500 mt-1 truncate">
                          지번: {result.address_name}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 지도 */}
            <div className="flex-1 relative min-h-[500px] sm:min-h-[600px] lg:min-h-[700px]">
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
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-lg p-6 rounded-3xl shadow-2xl border-2 border-white/50">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl shadow-lg">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-lg font-bold text-gray-900 truncate mb-2">
                        ✅ 위치가 선택되었습니다
                      </div>
                      <div className="text-base font-semibold text-gray-800 truncate">
                        {selectedLocation.roadAddress || selectedLocation.address}
                      </div>
                      {selectedLocation.jibunAddress && selectedLocation.roadAddress && (
                        <div className="text-sm text-gray-600 mt-1 truncate">
                          지번: {selectedLocation.jibunAddress}
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-2 font-mono bg-gray-100 px-3 py-1 rounded-lg">
                        위도: {selectedLocation.latitude.toFixed(6)}, 경도: {selectedLocation.longitude.toFixed(6)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 푸터 */}
            <div className="p-6 sm:p-8 bg-gray-50/50 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-4 flex-shrink-0">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="h-14 px-8 bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-2xl font-semibold shadow-sm hover:shadow-md transition-all duration-200 order-2 sm:order-1"
              >
                취소
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={!selectedLocation}
                className="h-14 px-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 order-1 sm:order-2"
              >
                {selectedLocation ? '✅ 선택 완료' : '위치를 선택해주세요'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}