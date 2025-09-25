"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, MapPin, X, DollarSign, Square, Plus, Minus, Loader2, AlertTriangle, RefreshCw } from "lucide-react";
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
  const [depositMinValue, setDepositMinValue] = useState("0");
  const [depositMaxValue, setDepositMaxValue] = useState("100,000");
  const [pyeongMinValue, setPyeongMinValue] = useState("0");
  const [pyeongMaxValue, setPyeongMaxValue] = useState("500");
  const [showFilters, setShowFilters] = useState(true);
  const [selectedListing, setSelectedListing] = useState<any>(null);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markers = useRef<any[]>([]);
  const [mapZoomLevel, setMapZoomLevel] = useState(5);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [loadingTimeout, setLoadingTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 로딩 타임아웃 설정 (10초)
    const timeout = setTimeout(() => {
      setMapError('지도 로딩이 너무 오래 걸립니다. 페이지를 새로고침 해주세요.');
    }, 10000);
    setLoadingTimeout(timeout);

    // 카카오 맵 API 키 확인
    if (!process.env.NEXT_PUBLIC_KAKAO_MAP_KEY) {
      setMapError('카카오 맵 API 키가 설정되지 않았습니다.');
      return;
    }

    // Load Kakao Maps SDK
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=services,clusterer`;
    script.async = true;

    script.onerror = () => {
      clearTimeout(timeout);
      setMapError('카카오 맵 SDK 로드에 실패했습니다. 인터넷 연결을 확인해주세요.');
    };

    script.onload = () => {
      try {
        window.kakao.maps.load(() => {
        if (mapRef.current) {
          const options = {
            center: new window.kakao.maps.LatLng(37.5065, 127.0543), // Gangnam
            level: 5,
            // 부드러운 확대/축소를 위한 설정
            draggable: true,
            scrollwheel: true,
            disableDoubleClick: false,
            disableDoubleClickZoom: false,
          };
          mapInstance.current = new window.kakao.maps.Map(
            mapRef.current,
            options
          );
          
          // 확대/축소 애니메이션 설정
          mapInstance.current.setZoomable(true);
          
          // 부드러운 지도 이동을 위한 커스텀 컨트롤 추가 (안전하게)
          try {
            if (window.kakao.maps.MapTypeControl) {
              const mapTypeControl = new window.kakao.maps.MapTypeControl();
              mapInstance.current.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);
            }
            
            if (window.kakao.maps.ZoomControl) {
              const zoomControl = new window.kakao.maps.ZoomControl();
              mapInstance.current.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);
            }
          } catch (controlError) {
            console.warn('Map controls could not be added:', controlError);
          }
          
          // 부드러운 줌 변경 이벤트 (안전하게 등록)
          try {
            window.kakao.maps.event.addListener(mapInstance.current, 'zoom_start', function() {
              if (mapRef.current) {
                mapRef.current.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
              }
            });
            
            window.kakao.maps.event.addListener(mapInstance.current, 'zoom_changed', function() {
              const level = mapInstance.current.getLevel();
              setMapZoomLevel(level);
              
              if (mapRef.current) {
                mapRef.current.style.transform = `scale(${1 + (level - 5) * 0.01})`;
                setTimeout(() => {
                  if (mapRef.current) {
                    mapRef.current.style.transform = 'scale(1)';
                  }
                }, 300);
              }
            });
            
            window.kakao.maps.event.addListener(mapInstance.current, 'dragstart', function() {
              if (mapRef.current) {
                mapRef.current.style.transition = 'transform 0.2s ease-out';
              }
            });
            
            window.kakao.maps.event.addListener(mapInstance.current, 'dragend', function() {
              if (mapRef.current) {
                mapRef.current.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
                mapRef.current.style.transform = 'scale(0.999)';
                setTimeout(() => {
                  if (mapRef.current) {
                    mapRef.current.style.transform = 'scale(1)';
                  }
                }, 100);
              }
            });
          } catch (eventError) {
            console.warn('Map event listeners could not be added:', eventError);
          }

          // 지도 로드 완료 후 부드러운 페이드인 효과
          clearTimeout(timeout);
          setTimeout(() => {
            if (mapRef.current) {
              mapRef.current.style.opacity = '1';
              mapRef.current.style.transition = 'opacity 0.5s ease-in-out, transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
              setIsMapLoaded(true);
            }
          }, 100);
          
          // Initial search
          searchListings();
        }
        });
      } catch (error) {
        clearTimeout(timeout);
        console.error('Kakao Maps initialization error:', error);
        setMapError('지도 초기화 중 오류가 발생했습니다.');
      }
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
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

  // 포맷팅 핸들러 함수들
  const handleDepositMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, "");
    const formatted = value
      ? new Intl.NumberFormat("ko-KR").format(Number(value))
      : "";
    setDepositMinValue(formatted);
    setFilters({ ...filters, min_deposit: Number(value) || 0 });
  };

  const handleDepositMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, "");
    const formatted = value
      ? new Intl.NumberFormat("ko-KR").format(Number(value))
      : "";
    setDepositMaxValue(formatted);
    setFilters({ ...filters, max_deposit: Number(value) || 100000 });
  };

  const handlePyeongMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, "");
    const formatted = value
      ? new Intl.NumberFormat("ko-KR").format(Number(value))
      : "";
    setPyeongMinValue(formatted);
    setFilters({ ...filters, min_pyeong: Number(value) || 0 });
  };

  const handlePyeongMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, "");
    const formatted = value
      ? new Intl.NumberFormat("ko-KR").format(Number(value))
      : "";
    setPyeongMaxValue(formatted);
    setFilters({ ...filters, max_pyeong: Number(value) || 500 });
  };

  // 부드러운 줌 인/아웃 함수
  const handleZoomIn = () => {
    if (mapInstance.current && mapZoomLevel > 1) {
      const newLevel = mapZoomLevel - 1;
      try {
        // 애니메이션 옵션이 지원되는지 확인하고 사용
        if (typeof mapInstance.current.setLevel === 'function') {
          mapInstance.current.setLevel(newLevel);
          setMapZoomLevel(newLevel);
        }
      } catch (error) {
        console.warn('Zoom in failed:', error);
      }
    }
  };

  const handleZoomOut = () => {
    if (mapInstance.current && mapZoomLevel < 14) {
      const newLevel = mapZoomLevel + 1;
      try {
        if (typeof mapInstance.current.setLevel === 'function') {
          mapInstance.current.setLevel(newLevel);
          setMapZoomLevel(newLevel);
        }
      } catch (error) {
        console.warn('Zoom out failed:', error);
      }
    }
  };

  // 현재 위치로 부드럽게 이동
  const moveToCurrentLocation = () => {
    if (navigator.geolocation && mapInstance.current) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          try {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const moveLatLng = new window.kakao.maps.LatLng(lat, lng);
            
            // 부드러운 이동 애니메이션
            if (typeof mapInstance.current.panTo === 'function') {
              mapInstance.current.panTo(moveLatLng);
            } else if (typeof mapInstance.current.setCenter === 'function') {
              mapInstance.current.setCenter(moveLatLng);
            }
          } catch (error) {
            console.warn('Move to location failed:', error);
          }
        },
        (error) => {
          console.warn("위치 정보를 가져올 수 없습니다:", error);
        }
      );
    }
  };

  const updateMapMarkers = (listings: any[]) => {
    if (!mapInstance.current || !window.kakao) return;

    // Clear existing markers
    markers.current.forEach((marker) => marker.setMap(null));
    markers.current = [];

    // Create marker clusterer (안전하게)
    let clusterer = null;
    try {
      if (window.kakao.maps.MarkerClusterer) {
        clusterer = new window.kakao.maps.MarkerClusterer({
          map: mapInstance.current,
          averageCenter: true,
          minLevel: 3,
        });
      }
    } catch (clustererError) {
      console.warn('MarkerClusterer could not be created:', clustererError);
    }

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

    if (clusterer) {
      clusterer.addMarkers(newMarkers);
    }
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
                    value={depositMinValue}
                    onChange={handleDepositMinChange}
                    placeholder="최소 보증금"
                    className="h-11 text-center bg-white border-2 border-slate-400 focus:border-blue-500 focus:ring-blue-500/20 placeholder:text-slate-600 placeholder:font-medium shadow-sm text-slate-900"
                  />
                </div>
                <span className="text-slate-500 font-medium">~</span>
                <div className="flex-1">
                  <Input
                    value={depositMaxValue}
                    onChange={handleDepositMaxChange}
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
                    value={pyeongMinValue}
                    onChange={handlePyeongMinChange}
                    placeholder="최소 면적"
                    className="h-11 text-center bg-white border-2 border-slate-400 focus:border-green-500 focus:ring-green-500/20 placeholder:text-slate-600 placeholder:font-medium shadow-sm text-slate-900"
                  />
                </div>
                <span className="text-slate-500 font-medium">~</span>
                <div className="flex-1">
                  <Input
                    value={pyeongMaxValue}
                    onChange={handlePyeongMaxChange}
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
                        보증금{" "}
                        {new Intl.NumberFormat("ko-KR").format(
                          listing.price_deposit
                        )}
                        만원
                      </div>
                      {listing.price_monthly && (
                        <div className="text-sm text-slate-600">
                          월{" "}
                          {new Intl.NumberFormat("ko-KR").format(
                            listing.price_monthly
                          )}
                          만원
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
        {/* 지도 로딩 상태 */}
        {!isMapLoaded && !mapError && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center z-20 rounded-r-lg">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">지도 로딩 중...</h3>
                <p className="text-slate-600 text-sm">카카오 지도를 불러오고 있습니다</p>
              </div>
            </div>
          </div>
        )}
        
        {/* 지도 로딩 에러 상태 */}
        {mapError && (
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center z-20 rounded-r-lg">
            <div className="text-center space-y-6 max-w-md px-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">지도 로딩 실패</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{mapError}</p>
              </div>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      setMapError(null);
                      setIsMapLoaded(false);
                      window.location.reload();
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    다시 시도
                  </Button>
                  <Button
                    onClick={() => {
                      setMapError(null);
                      setIsMapLoaded(true); // 기본 지도 표시
                    }}
                    variant="outline"
                    className="border-slate-300 hover:bg-slate-50"
                  >
                    목록으로 보기
                  </Button>
                </div>
                <div className="text-xs text-slate-500">
                  네트워크 문제나 API 키 설정을 확인해주세요
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 실제 지도 또는 대체 컨텐츠 */}
        {mapError && isMapLoaded ? (
          // 지도 로딩 실패 시 매물 그리드 표시
          <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-r-lg p-6 overflow-auto">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 mb-2">매물 목록</h3>
              <p className="text-slate-600">지도 대신 매물을 목록 형태로 확인하세요</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {listings.map((listing, index) => (
                <Card
                  key={listing.id}
                  className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-white/50 bg-white/90 backdrop-blur-sm group cursor-pointer"
                  onClick={() => setSelectedListing(listing)}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-slate-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {listing.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-lg text-slate-800">
                        보증금 {new Intl.NumberFormat("ko-KR").format(listing.price_deposit)}만원
                      </div>
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
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          // 정상적인 지도
          <div
            ref={mapRef}
            className="w-full h-full rounded-r-lg overflow-hidden transition-all duration-300"
            style={{ 
              opacity: 0,
              filter: 'blur(0px)',
              transform: 'scale(1)'
            }}
          />
        )}
        
        {/* 커스텀 줌 컨트롤 */}
        {isMapLoaded && (
          <div className="absolute right-6 top-1/2 transform -translate-y-1/2 z-10 space-y-2">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-slate-200/50 overflow-hidden">
              <Button
                size="icon"
                variant="ghost"
                onClick={handleZoomIn}
                disabled={mapZoomLevel <= 1}
                className="h-12 w-12 rounded-none border-b border-slate-200/50 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <div className="px-4 py-2 text-center text-xs font-medium text-slate-600 bg-slate-50/50">
                {mapZoomLevel}
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleZoomOut}
                disabled={mapZoomLevel >= 14}
                className="h-12 w-12 rounded-none border-t border-slate-200/50 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 disabled:opacity-50"
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
            
            {/* 현재 위치 버튼 */}
            <Button
              size="icon"
              variant="outline"
              onClick={moveToCurrentLocation}
              className="h-12 w-12 bg-white/95 backdrop-blur-sm border-slate-200/50 shadow-lg hover:shadow-xl hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all duration-300"
              title="현재 위치로 이동"
            >
              <MapPin className="h-4 w-4" />
            </Button>
          </div>
        )}

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
                    보증금{" "}
                    {new Intl.NumberFormat("ko-KR").format(
                      selectedListing.price_deposit
                    )}
                    만원
                  </div>
                  {selectedListing.price_monthly && (
                    <div className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                      월{" "}
                      {new Intl.NumberFormat("ko-KR").format(
                        selectedListing.price_monthly
                      )}
                      만원
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
