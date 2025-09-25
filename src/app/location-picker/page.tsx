"use client"

import { useEffect, useState, useRef } from 'react'

export default function LocationPickerPage() {
  const [selectedLocation, setSelectedLocation] = useState<any>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const markerRef = useRef<any>(null)
  const kakaoMapRef = useRef<any>(null)

  useEffect(() => {
    const loadMap = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          if (!mapRef.current) return

          const options = {
            center: new window.kakao.maps.LatLng(37.5665, 126.9780),
            level: 3,
            mapTypeId: window.kakao.maps.MapTypeId.ROADMAP
          }

          const map = new window.kakao.maps.Map(mapRef.current, options)
          kakaoMapRef.current = map

          window.kakao.maps.event.addListener(map, 'click', (mouseEvent: any) => {
            const latlng = mouseEvent.latLng
            addMarker(latlng)
            searchAddressByCoordinates(latlng.getLat(), latlng.getLng())
          })
        })
      } else {
        setTimeout(loadMap, 100)
      }
    }

    loadMap()
  }, [])

  const addMarker = (position: any) => {
    if (!kakaoMapRef.current) return

    if (markerRef.current) {
      markerRef.current.setMap(null)
    }

    const marker = new window.kakao.maps.Marker({ position })
    marker.setMap(kakaoMapRef.current)
    markerRef.current = marker
  }

  const searchAddressByCoordinates = (lat: number, lng: number) => {
    if (!window.kakao) return

    const geocoder = new window.kakao.maps.services.Geocoder()

    geocoder.coord2Address(lng, lat, (result: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const address = result[0]
        const location = {
          latitude: lat,
          longitude: lng,
          roadAddress: address.road_address?.address_name || '',
          jibunAddress: address.address?.address_name || '',
          address: address.road_address?.address_name || address.address?.address_name || ''
        }
        setSelectedLocation(location)
      }
    })
  }

  const searchAddress = () => {
    const query = (document.getElementById('searchInput') as HTMLInputElement)?.value.trim()
    if (!query || !window.kakao) return

    const geocoder = new window.kakao.maps.services.Geocoder()

    geocoder.addressSearch(query, (result: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
        showSearchResults(result)
      }
    })
  }

  const showSearchResults = (results: any[]) => {
    const container = document.getElementById('searchResults')
    if (!container) return

    container.innerHTML = results.map((result, index) => `
      <div class="result-item" data-index="${index}">
        <div style="font-weight:bold;margin-bottom:4px;">📍 ${result.road_address?.address_name || result.address_name}</div>
        ${result.road_address ? `<div style="color:#64748b;font-size:14px;">지번: ${result.address_name}</div>` : ''}
      </div>
    `).join('')

    container.style.display = 'block'

    container.querySelectorAll('.result-item').forEach((item, index) => {
      item.addEventListener('click', () => selectResult(results[index]))
    })
  }

  const selectResult = (result: any) => {
    const lat = parseFloat(result.y)
    const lng = parseFloat(result.x)

    const position = new window.kakao.maps.LatLng(lat, lng)
    kakaoMapRef.current?.setCenter(position)
    addMarker(position)

    const location = {
      latitude: lat,
      longitude: lng,
      roadAddress: result.road_address?.address_name || '',
      jibunAddress: result.address_name || '',
      address: result.road_address?.address_name || result.address_name || ''
    }

    setSelectedLocation(location)

    const searchResults = document.getElementById('searchResults')
    const searchInput = document.getElementById('searchInput') as HTMLInputElement
    if (searchResults) searchResults.style.display = 'none'
    if (searchInput) searchInput.value = ''
  }

  const handleConfirm = () => {
    if (selectedLocation && window.opener) {
      window.opener.postMessage({
        type: 'LOCATION_SELECTED',
        location: selectedLocation
      }, '*')
      window.close()
    }
  }

  useEffect(() => {
    const searchBtn = document.getElementById('searchBtn')
    const searchInput = document.getElementById('searchInput')

    searchBtn?.addEventListener('click', searchAddress)
    searchInput?.addEventListener('keypress', (e: any) => {
      if (e.key === 'Enter') searchAddress()
    })

    return () => {
      searchBtn?.removeEventListener('click', searchAddress)
    }
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', color: 'white', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>🗺️ 위치 선택</h1>
        <p style={{ opacity: 0.9, fontSize: '16px' }}>지도를 클릭하거나 주소를 검색하여 정확한 위치를 선택하세요</p>
      </div>

      <div style={{ padding: '24px', background: 'rgba(255,255,255,0.9)', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          <input
            id="searchInput"
            type="text"
            placeholder="도로명 주소를 입력하세요 (예: 강남구 테헤란로 123)"
            style={{ flex: 1, height: '64px', padding: '0 24px', border: '2px solid #e2e8f0', borderRadius: '24px', fontSize: '18px', outline: 'none' }}
          />
          <button
            id="searchBtn"
            style={{ height: '64px', padding: '0 32px', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white', border: 'none', borderRadius: '24px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            🔍 주소 검색
          </button>
        </div>
        <div id="searchResults" style={{ maxHeight: '200px', overflowY: 'auto', background: 'white', border: '2px solid #e2e8f0', borderRadius: '16px', marginTop: '16px', display: 'none' }} />
      </div>

      <div style={{ flex: 1, position: 'relative' }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

        {selectedLocation && (
          <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px', background: 'rgba(255,255,255,0.95)', padding: '24px', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                📍
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px' }}>✅ 위치가 선택되었습니다</h3>
                <p style={{ fontSize: '16px', color: '#475569', marginBottom: '4px' }}>{selectedLocation.address}</p>
                <p style={{ fontSize: '12px', color: '#94a3b8', fontFamily: 'monospace' }}>
                  위도: {selectedLocation.latitude.toFixed(6)}, 경도: {selectedLocation.longitude.toFixed(6)}
                </p>
              </div>
            </div>
          </div>
        )}

        <div style={{ position: 'absolute', top: '24px', right: '24px', display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 10 }}>
          <button
            onClick={() => window.close()}
            style={{ padding: '16px 24px', background: 'rgba(255,255,255,0.9)', color: '#64748b', border: '2px solid #e2e8f0', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}
          >
            ❌ 취소
          </button>
          <button
            id="confirmBtn"
            onClick={handleConfirm}
            disabled={!selectedLocation}
            style={{
              padding: '16px 24px',
              background: selectedLocation ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : '#e2e8f0',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              fontWeight: 'bold',
              cursor: selectedLocation ? 'pointer' : 'not-allowed',
              fontSize: '16px',
              minWidth: '200px',
              opacity: selectedLocation ? 1 : 0.5
            }}
          >
            {selectedLocation ? '✅ 선택 완료' : '📍 위치 선택'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .result-item {
          padding: 16px 24px;
          border-bottom: 1px solid #f1f5f9;
          cursor: pointer;
          transition: all 0.3s;
        }
        .result-item:hover {
          background: #f8fafc;
        }
        .result-item:last-child {
          border-bottom: none;
        }
      `}</style>
    </div>
  )
}