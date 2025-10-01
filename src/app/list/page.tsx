"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Search,
  Filter,
  SlidersHorizontal,
  Grid,
  List,
  Heart,
  MapPin,
  Eye,
  Star,
  TrendingUp,
  Building2,
  Home,
  Store,
  Briefcase,
  X,
  ChevronDown,
  Loader2,
  SortAsc,
  Calendar,
  Square,
  DollarSign,
} from "lucide-react";
import { formatPrice, formatArea } from "@/lib/utils";
import Link from "next/link";
import { ListingDetailModal } from "@/components/listing/ListingDetailModal";

const sortOptions = [
  { value: "created_at", label: "최신순", icon: Calendar },
  { value: "price_deposit", label: "보증금 낮은순", icon: DollarSign },
  { value: "price_monthly", label: "월세 낮은순", icon: TrendingUp },
  { value: "pyeong_exclusive", label: "면적 작은순", icon: Square },
];

const propertyTypes = [
  { value: "office", label: "사무실", icon: Briefcase, color: "blue" },
  { value: "retail", label: "상가", icon: Store, color: "green" },
  {
    value: "whole_building",
    label: "통건물",
    icon: Building2,
    color: "purple",
  },
  { value: "residential", label: "주택형", icon: Home, color: "orange" },
];

const quickFilters = [
  { label: "신축", value: "new" },
  { label: "역세권", value: "subway" },
  { label: "주차가능", value: "parking" },
  { label: "엘리베이터", value: "elevator" },
];

export default function ListSearchPage() {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [stationInfo, setStationInfo] = useState<any>(null);

  const [filters, setFilters] = useState({
    query: searchParams.get("query") || "",
    property_type: searchParams.get("property_type")?.split(",") || [],
    min_deposit: Number(searchParams.get("min_deposit")) || 0,
    max_deposit: Number(searchParams.get("max_deposit")) || 1000000,
    min_monthly: Number(searchParams.get("min_monthly")) || 0,
    max_monthly: Number(searchParams.get("max_monthly")) || 100000,
    min_pyeong: Number(searchParams.get("min_pyeong")) || 0,
    max_pyeong: Number(searchParams.get("max_pyeong")) || 10000,
    sort_by: searchParams.get("sort_by") || "created_at",
    stations: searchParams.get("stations")
      ? [Number(searchParams.get("stations"))]
      : [],
  });

  const [depositRange, setDepositRange] = useState([
    filters.min_deposit,
    filters.max_deposit,
  ]);
  const [monthlyRange, setMonthlyRange] = useState([
    filters.min_monthly,
    filters.max_monthly,
  ]);
  const [pyeongRange, setPyeongRange] = useState([
    filters.min_pyeong,
    filters.max_pyeong,
  ]);

  useEffect(() => {
    searchListings();
  }, [page]);

  // 역 정보 가져오기
  useEffect(() => {
    const stationId = searchParams.get("stations");
    if (stationId) {
      fetchStationInfo(stationId);
    }
  }, [searchParams]);

  const fetchStationInfo = async (stationId: string) => {
    try {
      const response = await fetch(`/api/stations/${stationId}`);
      if (response.ok) {
        const data = await response.json();
        setStationInfo(data.station);
      }
    } catch (error) {
      console.error("Failed to fetch station info:", error);
    }
  };

  const searchListings = async () => {
    setLoading(true);

    try {
      // 필터 정리: 기본값/최대값은 undefined로 보내서 필터링 안함
      const cleanedFilters: any = {
        query: filters.query || undefined,
        property_type: filters.property_type.length > 0 ? filters.property_type : undefined,
        min_deposit: filters.min_deposit > 0 ? filters.min_deposit : undefined,
        max_deposit: filters.max_deposit < 1000000 ? filters.max_deposit : undefined,
        min_monthly: filters.min_monthly > 0 ? filters.min_monthly : undefined,
        max_monthly: filters.max_monthly < 100000 ? filters.max_monthly : undefined,
        min_pyeong: filters.min_pyeong > 0 ? filters.min_pyeong : undefined,
        max_pyeong: filters.max_pyeong < 10000 ? filters.max_pyeong : undefined,
        sort_by: filters.sort_by,
        stations: filters.stations?.length > 0 ? filters.stations : undefined,
      };

      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...cleanedFilters,
          page,
          limit: 20,
        }),
      });

      const data = await response.json();
      console.log("List page search results:", {
        response: response.status,
        data,
        listingsCount: data.listings?.length,
        total: data.total,
      });

      if (page === 1) {
        setListings(data.listings || []);
      } else {
        setListings((prev) => [...prev, ...(data.listings || [])]);
      }

      setTotal(data.total || 0);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    searchListings();
  };

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const updateFiltersFromRange = () => {
    setFilters({
      ...filters,
      min_deposit: depositRange[0],
      max_deposit: depositRange[1],
      min_monthly: monthlyRange[0],
      max_monthly: monthlyRange[1],
      min_pyeong: pyeongRange[0],
      max_pyeong: pyeongRange[1],
    });
  };

  const resetFilters = () => {
    const resetState = {
      query: "",
      property_type: [],
      min_deposit: 0,
      max_deposit: 1000000,
      min_monthly: 0,
      max_monthly: 100000,
      min_pyeong: 0,
      max_pyeong: 10000,
      sort_by: "created_at",
    };
    setFilters(resetState);
    setDepositRange([0, 1000000]);
    setMonthlyRange([0, 100000]);
    setPyeongRange([0, 10000]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/5 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute top-40 right-20 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/4 w-80 h-80 bg-emerald-400/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Modern Hero Header */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {stationInfo ? (
                <>
                  <span className="inline-block animate-fade-in-up">
                    {stationInfo.name}
                  </span>
                  <br />
                  <span
                    className="inline-block animate-fade-in-up bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent"
                    style={{ animationDelay: "0.2s" }}
                  >
                    역세권 매물
                  </span>
                </>
              ) : (
                <>
                  <span className="inline-block animate-fade-in-up">
                    완벽한 공간을
                  </span>
                  <br />
                  <span
                    className="inline-block animate-fade-in-up bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent"
                    style={{ animationDelay: "0.2s" }}
                  >
                    찾아보세요
                  </span>
                </>
              )}
            </h1>
            <p
              className="text-xl text-blue-100 animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              {stationInfo
                ? `${stationInfo.line} ${
                    stationInfo.name
                  } 주변 ${total.toLocaleString()}개의 프리미엄 매물`
                : `${total.toLocaleString()}개의 프리미엄 매물이 기다리고 있습니다`}
            </p>
          </div>

          {/* Enhanced Search Bar */}
          <div
            className="max-w-4xl mx-auto animate-fade-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      placeholder="원하는 지역, 역, 매물명을 검색해보세요..."
                      value={filters.query}
                      onChange={(e) =>
                        setFilters({ ...filters, query: e.target.value })
                      }
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      className="h-14 pl-12 pr-4 text-lg bg-white border-2 border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl shadow-sm text-slate-900 placeholder:text-slate-500"
                    />
                  </div>
                  <Button
                    onClick={handleSearch}
                    disabled={loading}
                    className="h-14 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-semibold"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <Search className="mr-2 h-5 w-5" />
                        검색
                      </>
                    )}
                  </Button>
                </div>

                {/* Quick Filters */}
                <div className="flex flex-wrap gap-2">
                  {quickFilters.map((filter, index) => {
                    const colors = [
                      "bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200",
                      "bg-green-100 border-green-300 text-green-700 hover:bg-green-200",
                      "bg-purple-100 border-purple-300 text-purple-700 hover:bg-purple-200",
                      "bg-orange-100 border-orange-300 text-orange-700 hover:bg-orange-200",
                    ];
                    return (
                      <Button
                        key={filter.value}
                        variant="outline"
                        size="sm"
                        className={`rounded-full transition-all duration-200 ${
                          colors[index % colors.length]
                        }`}
                      >
                        {filter.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Enhanced Filter Controls */}
        <div className="flex items-center justify-between mb-8 animate-fade-in-up">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant={showFilters ? "default" : "outline"}
              className="gap-2 h-12 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              <SlidersHorizontal className="h-4 w-4" />
              상세 필터
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </Button>

            {/* Active Filters Display */}
            <div className="flex items-center gap-2">
              {filters.property_type.length > 0 && (
                <Badge variant="secondary" className="px-3 py-1 rounded-full">
                  {filters.property_type.length}개 유형 선택
                  <X
                    className="ml-2 h-3 w-3 cursor-pointer"
                    onClick={() =>
                      setFilters({ ...filters, property_type: [] })
                    }
                  />
                </Badge>
              )}
              {filters.query && (
                <Badge variant="secondary" className="px-3 py-1 rounded-full">
                  "{filters.query}"
                  <X
                    className="ml-2 h-3 w-3 cursor-pointer"
                    onClick={() => setFilters({ ...filters, query: "" })}
                  />
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={filters.sort_by}
                onChange={(e) => {
                  setFilters({ ...filters, sort_by: e.target.value });
                  handleSearch();
                }}
                className="appearance-none bg-white border-2 border-slate-200 rounded-xl px-4 py-3 pr-10 text-slate-700 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200 shadow-sm"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <SortAsc className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-white border-2 border-slate-200 rounded-xl p-1 shadow-sm">
              <Button
                size="sm"
                variant={viewMode === "grid" ? "default" : "ghost"}
                onClick={() => setViewMode("grid")}
                className="rounded-lg transition-all duration-200"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === "list" ? "default" : "ghost"}
                onClick={() => setViewMode("list")}
                className="rounded-lg transition-all duration-200"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="mb-8 animate-slide-down">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {/* Property Types */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      매물 유형
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {propertyTypes.map((type) => {
                        const Icon = type.icon;
                        const isSelected = filters.property_type.includes(
                          type.value
                        );
                        const getButtonStyles = () => {
                          if (isSelected) {
                            switch (type.color) {
                              case "blue":
                                return "bg-blue-100 border-blue-300 text-blue-800 shadow-md";
                              case "green":
                                return "bg-green-100 border-green-300 text-green-800 shadow-md";
                              case "purple":
                                return "bg-purple-100 border-purple-300 text-purple-800 shadow-md";
                              case "orange":
                                return "bg-orange-100 border-orange-300 text-orange-800 shadow-md";
                              default:
                                return "bg-slate-100 border-slate-300 text-slate-800 shadow-md";
                            }
                          } else {
                            switch (type.color) {
                              case "blue":
                                return "bg-white border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-800";
                              case "green":
                                return "bg-white border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 hover:text-green-800";
                              case "purple":
                                return "bg-white border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-800";
                              case "orange":
                                return "bg-white border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-800";
                              default:
                                return "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800";
                            }
                          }
                        };

                        return (
                          <Button
                            key={type.value}
                            variant="outline"
                            onClick={() => {
                              if (isSelected) {
                                setFilters({
                                  ...filters,
                                  property_type: filters.property_type.filter(
                                    (t) => t !== type.value
                                  ),
                                });
                              } else {
                                setFilters({
                                  ...filters,
                                  property_type: [
                                    ...filters.property_type,
                                    type.value,
                                  ],
                                });
                              }
                            }}
                            className={`h-12 justify-start gap-3 rounded-xl transition-all duration-200 ${getButtonStyles()}`}
                          >
                            <Icon className="h-4 w-4" />
                            {type.label}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Price Ranges */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        보증금 (만원)
                      </h3>
                      <div className="px-3 relative">
                        {/* Range Display Tooltip */}
                        <div className="flex justify-center mb-2">
                          <div className="bg-slate-800 text-white px-3 py-1 rounded-lg text-sm font-medium shadow-lg">
                            {depositRange[0] === 0 && depositRange[1] === 1000000
                              ? "전체"
                              : `${formatPrice(depositRange[0])}${
                                  depositRange[0] < 10000 ? "만" : ""
                                } ~ ${formatPrice(depositRange[1])}${
                                  depositRange[1] < 10000 ? "만" : ""
                                }`}
                          </div>
                        </div>
                        <Slider
                          value={depositRange}
                          onValueChange={setDepositRange}
                          max={1000000}
                          step={10000}
                          className="mb-4"
                        />
                        <div className="flex justify-between text-sm text-slate-500">
                          <span>최소</span>
                          <span>25억</span>
                          <span>50억</span>
                          <span>최대</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        월세 (만원)
                      </h3>
                      <div className="px-3 relative">
                        {/* Range Display Tooltip */}
                        <div className="flex justify-center mb-2">
                          <div className="bg-slate-800 text-white px-3 py-1 rounded-lg text-sm font-medium shadow-lg">
                            {monthlyRange[0] === 0 && monthlyRange[1] === 100000
                              ? "전체"
                              : `${formatPrice(monthlyRange[0])}${
                                  monthlyRange[0] < 10000 ? "만" : ""
                                } ~ ${formatPrice(monthlyRange[1])}${
                                  monthlyRange[1] < 10000 ? "만" : ""
                                }`}
                          </div>
                        </div>
                        <Slider
                          value={monthlyRange}
                          onValueChange={setMonthlyRange}
                          max={100000}
                          step={1000}
                          className="mb-4"
                        />
                        <div className="flex justify-between text-sm text-slate-500">
                          <span>최소</span>
                          <span>2,500만</span>
                          <span>5,000만</span>
                          <span>최대</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Area Range */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
                      <Square className="h-5 w-5 text-purple-600" />
                      전용면적 (평)
                    </h3>
                    <div className="px-3">
                      <Slider
                        value={pyeongRange}
                        onValueChange={setPyeongRange}
                        max={10000}
                        step={50}
                        className="mb-4"
                      />
                      <div className="flex justify-between text-sm text-slate-600">
                        <span>{pyeongRange[0]}평</span>
                        <span>{pyeongRange[1]}평</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filter Actions */}
                <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-200">
                  <Button
                    variant="outline"
                    onClick={resetFilters}
                    className="gap-2 rounded-xl bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300 transition-all duration-200"
                  >
                    <X className="h-4 w-4" />
                    필터 초기화
                  </Button>

                  <Button
                    onClick={() => {
                      updateFiltersFromRange();
                      handleSearch();
                    }}
                    className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl px-8"
                  >
                    <Search className="h-4 w-4" />
                    필터 적용
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results Section */}
        {loading && page === 1 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              검색 중...
            </h3>
            <p className="text-slate-600">최적의 매물을 찾고 있습니다</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-slate-600 mb-6">다른 검색 조건을 시도해보세요</p>
            <Button
              onClick={resetFilters}
              variant="outline"
              className="rounded-xl"
            >
              필터 초기화
            </Button>
          </div>
        ) : (
          <>
            {/* Results Grid/List */}
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {listings.map((listing, index) => (
                <div
                  key={listing.id}
                  className="animate-fade-in-up group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Card
                    className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] bg-white/90 backdrop-blur-sm group-hover:bg-white cursor-pointer"
                    onClick={() => {
                      setSelectedListing(listing);
                      setShowDetailModal(true);
                    }}
                  >
                    {viewMode === "grid" ? (
                      <>
                        {/* Image Section */}
                        <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
                          <img
                            src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop"
                            alt={listing.title}
                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                          {/* Favorite Button */}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              toggleFavorite(listing.id);
                            }}
                            className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-200 transform hover:scale-110"
                          >
                            <Heart
                              className={`h-5 w-5 ${
                                favorites.has(listing.id)
                                  ? "fill-red-500 text-red-500"
                                  : "text-slate-600"
                              }`}
                            />
                          </button>

                          {/* Badge */}
                          {listing.listing_themes?.length > 0 && (
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg">
                                {
                                  listing.listing_themes[0].theme_categories
                                    .label_ko
                                }
                              </Badge>
                            </div>
                          )}

                          {/* View Count */}
                          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs">
                            <Eye className="h-3 w-3" />
                            {Math.floor(Math.random() * 200) + 50}
                          </div>
                        </div>

                        {/* Content Section */}
                        <CardContent className="p-5">
                          <div className="space-y-3">
                            <h3 className="font-bold text-lg text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                              {listing.title}
                            </h3>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-2xl font-bold text-slate-900">
                                  {formatPrice(listing.price_deposit)}
                                  <span className="text-sm font-normal text-slate-600 ml-1">
                                    만원
                                  </span>
                                </span>
                                {listing.price_monthly && (
                                  <span className="text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
                                    월 {formatPrice(listing.price_monthly)}만원
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-4 text-sm text-slate-600">
                                <div className="flex items-center gap-1">
                                  <Square className="h-4 w-4 text-blue-500" />
                                  전용 {formatArea(listing.exclusive_m2)}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Building2 className="h-4 w-4 text-green-500" />
                                  {listing.floor}층
                                </div>
                              </div>

                              <div className="flex items-center gap-1 text-sm text-slate-500">
                                <MapPin className="h-4 w-4" />
                                <span className="line-clamp-1">
                                  {listing.address_road}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </>
                    ) : (
                      /* List View */
                      <div className="flex p-4">
                        <div className="w-48 h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl overflow-hidden relative flex-shrink-0">
                          <img
                            src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=130&fit=crop"
                            alt={listing.title}
                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>

                        <div className="flex-1 ml-6 flex justify-between">
                          <div className="space-y-2">
                            <h3 className="font-bold text-xl text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                              {listing.title}
                            </h3>

                            <div className="flex items-center gap-4">
                              <span className="text-2xl font-bold text-slate-900">
                                {formatPrice(listing.price_deposit)}만원
                              </span>
                              {listing.price_monthly && (
                                <span className="text-lg text-slate-600">
                                  / 월 {formatPrice(listing.price_monthly)}만원
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-6 text-sm text-slate-600">
                              <div className="flex items-center gap-1">
                                <Square className="h-4 w-4 text-blue-500" />
                                전용 {formatArea(listing.exclusive_m2)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Square className="h-4 w-4 text-green-500" />
                                공급 {formatArea(listing.supply_m2)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Building2 className="h-4 w-4 text-purple-500" />
                                {listing.floor}층
                              </div>
                            </div>

                            <div className="flex items-center gap-1 text-sm text-slate-500">
                              <MapPin className="h-4 w-4" />
                              <span>{listing.address_road}</span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end justify-between">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                toggleFavorite(listing.id);
                              }}
                              className="w-10 h-10 bg-slate-100 hover:bg-red-50 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110"
                            >
                              <Heart
                                className={`h-5 w-5 ${
                                  favorites.has(listing.id)
                                    ? "fill-red-500 text-red-500"
                                    : "text-slate-400"
                                }`}
                              />
                            </button>

                            <div className="flex items-center gap-1 text-xs text-slate-400">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>4.{Math.floor(Math.random() * 9) + 1}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              ))}
            </div>

            {/* Enhanced Load More */}
            {listings.length < total && (
              <div className="text-center mt-12">
                <Button
                  onClick={loadMore}
                  disabled={loading}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-12 h-14"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      로딩 중...
                    </>
                  ) : (
                    <>
                      더 많은 매물 보기
                      <ChevronDown className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
                <p className="text-sm text-slate-500 mt-4">
                  {listings.length} / {total} 매물
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Listing Detail Modal */}
      <ListingDetailModal
        listing={selectedListing}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
      />
    </div>
  );
}
