"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Search, Filter, MapPin, X } from "lucide-react"
import { formatPrice, formatArea } from "@/lib/utils"

declare global {
  interface Window {
    kakao: any
  }
}

export default function MapSearchPage() {
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    query: "",
    min_deposit: 0,
    max_deposit: 100000,
    min_pyeong: 0,
    max_pyeong: 500,
    property_type: [],
    themes: [],
  })
  const [showFilters, setShowFilters] = useState(true)
  const [selectedListing, setSelectedListing] = useState<any>(null)

  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const markers = useRef<any[]>([])

  useEffect(() => {
    // Load Kakao Maps SDK
    const script = document.createElement('script')
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=services,clusterer`
    script.async = true

    script.onload = () => {
      window.kakao.maps.load(() => {
        if (mapRef.current) {
          const options = {
            center: new window.kakao.maps.LatLng(37.5065, 127.0543), // Gangnam
            level: 5,
          }
          mapInstance.current = new window.kakao.maps.Map(mapRef.current, options)

          // Initial search
          searchListings()
        }
      })
    }

    document.head.appendChild(script)

    return () => {
      // Cleanup
      markers.current.forEach(marker => marker.setMap(null))
    }
  }, [])

  const searchListings = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...filters,
          limit: 100,
        }),
      })

      const data = await response.json()
      setListings(data.listings || [])

      // Update markers on map
      updateMapMarkers(data.listings || [])

    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateMapMarkers = (listings: any[]) => {
    if (!mapInstance.current || !window.kakao) return

    // Clear existing markers
    markers.current.forEach(marker => marker.setMap(null))
    markers.current = []

    // Create marker clusterer
    const clusterer = new window.kakao.maps.MarkerClusterer({
      map: mapInstance.current,
      averageCenter: true,
      minLevel: 3,
    })

    const newMarkers = listings.map(listing => {
      // Parse location (would need actual coordinates from PostGIS)
      const lat = 37.5065 + (Math.random() - 0.5) * 0.05
      const lng = 127.0543 + (Math.random() - 0.5) * 0.1

      const markerPosition = new window.kakao.maps.LatLng(lat, lng)

      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
      })

      window.kakao.maps.event.addListener(marker, 'click', () => {
        setSelectedListing(listing)
      })

      return marker
    })

    clusterer.addMarkers(newMarkers)
    markers.current = newMarkers
  }

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Left Panel - Filters and Results */}
      <div className={`${showFilters ? 'w-96' : 'w-0'} transition-all duration-300 bg-white border-r overflow-hidden`}>
        <div className="h-full flex flex-col">
          {/* Search Bar */}
          <div className="p-4 border-b">
            <div className="relative">
              <Input
                placeholder="지역, 역, 매물명 검색"
                value={filters.query}
                onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && searchListings()}
                className="pr-10"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-0 top-0"
                onClick={searchListings}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="p-4 border-b space-y-4">
            <div>
              <label className="text-sm font-medium">보증금 (만원)</label>
              <div className="flex items-center gap-2 mt-2">
                <Input
                  type="number"
                  value={filters.min_deposit}
                  onChange={(e) => setFilters({ ...filters, min_deposit: +e.target.value })}
                  placeholder="최소"
                  className="w-24"
                />
                <span>~</span>
                <Input
                  type="number"
                  value={filters.max_deposit}
                  onChange={(e) => setFilters({ ...filters, max_deposit: +e.target.value })}
                  placeholder="최대"
                  className="w-24"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">전용면적 (평)</label>
              <div className="flex items-center gap-2 mt-2">
                <Input
                  type="number"
                  value={filters.min_pyeong}
                  onChange={(e) => setFilters({ ...filters, min_pyeong: +e.target.value })}
                  placeholder="최소"
                  className="w-24"
                />
                <span>~</span>
                <Input
                  type="number"
                  value={filters.max_pyeong}
                  onChange={(e) => setFilters({ ...filters, max_pyeong: +e.target.value })}
                  placeholder="최대"
                  className="w-24"
                />
              </div>
            </div>

            <Button onClick={searchListings} className="w-full">
              검색
            </Button>
          </div>

          {/* Results List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading ? (
              <div className="text-center py-8 text-gray-500">검색 중...</div>
            ) : listings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">검색 결과가 없습니다</div>
            ) : (
              listings.map(listing => (
                <Card
                  key={listing.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedListing(listing)}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm line-clamp-1">{listing.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <div className="font-semibold">
                      보증금 {formatPrice(listing.price_deposit)}만원
                      {listing.price_monthly && ` / 월 ${formatPrice(listing.price_monthly)}만원`}
                    </div>
                    <div className="text-sm text-gray-600">
                      전용 {formatArea(listing.exclusive_m2)} · {listing.floor}층
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-1">
                      {listing.address_road}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <Button
        size="icon"
        variant="outline"
        className="absolute left-2 top-2 z-10 bg-white"
        onClick={() => setShowFilters(!showFilters)}
      >
        {showFilters ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
      </Button>

      {/* Map */}
      <div className="flex-1 relative">
        <div ref={mapRef} className="w-full h-full" />

        {/* Selected Listing Card */}
        {selectedListing && (
          <div className="absolute bottom-4 left-4 right-4 max-w-md mx-auto">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{selectedListing.title}</CardTitle>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setSelectedListing(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="font-semibold text-lg">
                    보증금 {formatPrice(selectedListing.price_deposit)}만원
                    {selectedListing.price_monthly && ` / 월 ${formatPrice(selectedListing.price_monthly)}만원`}
                  </div>
                  <div>
                    전용 {formatArea(selectedListing.exclusive_m2)} ·
                    공급 {formatArea(selectedListing.supply_m2)} ·
                    {selectedListing.floor}층
                  </div>
                  <div className="text-sm text-gray-600">
                    {selectedListing.address_road}
                  </div>
                  <div className="pt-2">
                    <a href={`/listing/${selectedListing.id}`} target="_blank" rel="noopener noreferrer">
                      <Button className="w-full">상세보기</Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}