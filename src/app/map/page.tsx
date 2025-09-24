"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, MapPin, X, DollarSign, Square } from "lucide-react";
import { formatPrice, formatArea } from "@/lib/utils";

declare global {
  interface Window {
    kakao: any;
  }
}

export default function MapSearchPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    query: "",
    min_deposit: 0,
    max_deposit: 100000,
    min_pyeong: 0,
    max_pyeong: 500,
    property_type: [],
    themes: [],
  });
  const [showFilters, setShowFilters] = useState(true);
  const [selectedListing, setSelectedListing] = useState<any>(null);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markers = useRef<any[]>([]);

  useEffect(() => {
    // Load Kakao Maps SDK
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=services,clusterer`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        if (mapRef.current) {
          const options = {
            center: new window.kakao.maps.LatLng(37.5065, 127.0543), // Gangnam
            level: 5,
          };
          mapInstance.current = new window.kakao.maps.Map(
            mapRef.current,
            options
          );

          // Initial search
          searchListings();
        }
      });
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      markers.current.forEach((marker) => marker.setMap(null));
    };
  }, []);

  const searchListings = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...filters,
          limit: 100,
        }),
      });

      const data = await response.json();
      setListings(data.listings || []);

      // Update markers on map
      updateMapMarkers(data.listings || []);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateMapMarkers = (listings: any[]) => {
    if (!mapInstance.current || !window.kakao) return;

    // Clear existing markers
    markers.current.forEach((marker) => marker.setMap(null));
    markers.current = [];

    // Create marker clusterer
    const clusterer = new window.kakao.maps.MarkerClusterer({
      map: mapInstance.current,
      averageCenter: true,
      minLevel: 3,
    });

    const newMarkers = listings.map((listing) => {
      // Parse location (would need actual coordinates from PostGIS)
      const lat = 37.5065 + (Math.random() - 0.5) * 0.05;
      const lng = 127.0543 + (Math.random() - 0.5) * 0.1;

      const markerPosition = new window.kakao.maps.LatLng(lat, lng);

      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
      });

      window.kakao.maps.event.addListener(marker, "click", () => {
        setSelectedListing(listing);
      });

      return marker;
    });

    clusterer.addMarkers(newMarkers);
    markers.current = newMarkers;
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Left Panel - Filters and Results */}
      <div
        className={`${
          showFilters ? "w-96" : "w-0"
        } transition-all duration-300 bg-white/95 backdrop-blur-sm border-r border-slate-200/50 overflow-hidden shadow-xl`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-200/50 bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">지도 검색</h2>
                <p className="text-blue-100 text-sm">
                  원하는 지역의 매물을 찾아보세요
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="지역, 역, 매물명 검색..."
                value={filters.query}
                onChange={(e) =>
                  setFilters({ ...filters, query: e.target.value })
                }
                onKeyPress={(e) => e.key === "Enter" && searchListings()}
                className="h-12 pl-12 pr-4 text-base bg-white border-2 border-slate-400 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 placeholder:text-slate-600 placeholder:font-medium shadow-sm text-slate-900"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-slate-200/50 space-y-6 bg-slate-50/50">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-3">
                <DollarSign className="h-4 w-4 text-blue-600" />
                보증금 (만원)
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Input
                    type="number"
                    value={filters.min_deposit}
                    onChange={(e) =>
                      setFilters({ ...filters, min_deposit: +e.target.value })
                    }
                    placeholder="최소 보증금"
                    className="h-11 text-center bg-white border-2 border-slate-400 focus:border-blue-500 focus:ring-blue-500/20 placeholder:text-slate-600 placeholder:font-medium shadow-sm text-slate-900"
                  />
                </div>
                <span className="text-slate-500 font-medium">~</span>
                <div className="flex-1">
                  <Input
                    type="number"
                    value={filters.max_deposit}
                    onChange={(e) =>
                      setFilters({ ...filters, max_deposit: +e.target.value })
                    }
                    placeholder="최대 보증금"
                    className="h-11 text-center bg-white border-2 border-slate-400 focus:border-blue-500 focus:ring-blue-500/20 placeholder:text-slate-600 placeholder:font-medium shadow-sm text-slate-900"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-3">
                <Square className="h-4 w-4 text-green-600" />
                전용면적 (평)
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Input
                    type="number"
                    value={filters.min_pyeong}
                    onChange={(e) =>
                      setFilters({ ...filters, min_pyeong: +e.target.value })
                    }
                    placeholder="최소 면적"
                    className="h-11 text-center bg-white border-2 border-slate-400 focus:border-green-500 focus:ring-green-500/20 placeholder:text-slate-600 placeholder:font-medium shadow-sm text-slate-900"
                  />
                </div>
                <span className="text-slate-500 font-medium">~</span>
                <div className="flex-1">
                  <Input
                    type="number"
                    value={filters.max_pyeong}
                    onChange={(e) =>
                      setFilters({ ...filters, max_pyeong: +e.target.value })
                    }
                    placeholder="최대 면적"
                    className="h-11 text-center bg-white border-2 border-slate-400 focus:border-green-500 focus:ring-green-500/20 placeholder:text-slate-600 placeholder:font-medium shadow-sm text-slate-900"
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={searchListings}
              className="w-full h-12 gradient-blue text-white border-0 shadow-glow hover:shadow-lg transition-all duration-300 font-semibold"
            >
              <Search className="mr-2 h-4 w-4" />
              매물 검색
            </Button>
          </div>

          {/* Results List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">
                검색 결과
              </h3>
              <Badge variant="secondary" className="px-3 py-1">
                {listings.length}개
              </Badge>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Search className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  검색 중...
                </h3>
                <p className="text-slate-600">매물을 찾고 있습니다</p>
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  검색 결과가 없습니다
                </h3>
                <p className="text-slate-600">다른 조건으로 검색해보세요</p>
              </div>
            ) : (
              listings.map((listing, index) => (
                <Card
                  key={listing.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-white/50 bg-white/90 backdrop-blur-sm group"
                  onClick={() => setSelectedListing(listing)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base font-semibold text-slate-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {listing.title}
                      </CardTitle>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {listing.property_type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-lg text-slate-800">
                        보증금 {formatPrice(listing.price_deposit)}만원
                      </div>
                      {listing.price_monthly && (
                        <div className="text-sm text-slate-600">
                          월 {formatPrice(listing.price_monthly)}만원
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        전용 {formatArea(listing.exclusive_m2)}
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {listing.floor}층
                      </div>
                    </div>

                    <div className="text-sm text-slate-500 line-clamp-1 flex items-center gap-2">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      {listing.address_road}
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <div className="text-xs text-blue-600 font-medium group-hover:text-blue-700">
                        클릭하여 지도에서 확인 →
                      </div>
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
        className="absolute left-4 top-4 z-10 bg-white/90 backdrop-blur-sm border-slate-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        onClick={() => setShowFilters(!showFilters)}
      >
        {showFilters ? (
          <X className="h-4 w-4" />
        ) : (
          <Filter className="h-4 w-4" />
        )}
      </Button>

      {/* Map */}
      <div className="flex-1 relative">
        <div
          ref={mapRef}
          className="w-full h-full rounded-r-lg overflow-hidden"
        />

        {/* Map Info Overlay */}
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border border-slate-200/50">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span className="font-medium">{listings.length}개 매물</span>
            </div>
          </div>
        </div>

        {/* Selected Listing Card */}
        {selectedListing && (
          <div className="absolute bottom-6 left-6 right-6 max-w-md mx-auto animate-slide-in-up">
            <Card className="shadow-2xl border-white/50 bg-white/95 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold text-slate-800 line-clamp-2">
                      {selectedListing.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {selectedListing.property_type}
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-700 text-xs">
                        {selectedListing.floor}층
                      </Badge>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setSelectedListing(null)}
                    className="hover:bg-slate-100 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xl text-slate-800">
                    보증금 {formatPrice(selectedListing.price_deposit)}만원
                  </div>
                  {selectedListing.price_monthly && (
                    <div className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                      월 {formatPrice(selectedListing.price_monthly)}만원
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-slate-600">
                      전용 {formatArea(selectedListing.exclusive_m2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-slate-600">
                      공급 {formatArea(selectedListing.supply_m2)}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-slate-500 flex items-center gap-2">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="line-clamp-1">
                    {selectedListing.address_road}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <a
                    href={`/listing/${selectedListing.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full gradient-blue text-white border-0 shadow-glow hover:shadow-lg transition-all duration-300">
                      상세보기
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
