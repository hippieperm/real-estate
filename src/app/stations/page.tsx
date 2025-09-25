"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Train,
  ArrowRight,
  Search,
  MapPin,
  Users,
  Building2,
  Star,
  Filter,
  Grid3X3,
  List,
  Map,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// 지하철역 데이터 타입 정의
interface Station {
  id: number;
  name: string;
  line: string;
  location: any;
  listing_count: number;
  avg_price?: number;
  popular?: boolean;
}

// 지하철 노선별 색상 정의
const lineColors: Record<string, { bg: string; text: string; border: string }> =
  {
    "1호선": {
      bg: "bg-blue-600",
      text: "text-blue-600",
      border: "border-blue-200",
    },
    "2호선": {
      bg: "bg-green-600",
      text: "text-green-600",
      border: "border-green-200",
    },
    "3호선": {
      bg: "bg-orange-600",
      text: "text-orange-600",
      border: "border-orange-200",
    },
    "4호선": {
      bg: "bg-blue-800",
      text: "text-blue-800",
      border: "border-blue-200",
    },
    "5호선": {
      bg: "bg-purple-600",
      text: "text-purple-600",
      border: "border-purple-200",
    },
    "6호선": {
      bg: "bg-yellow-600",
      text: "text-yellow-600",
      border: "border-yellow-200",
    },
    "7호선": {
      bg: "bg-emerald-600",
      text: "text-emerald-600",
      border: "border-emerald-200",
    },
    "8호선": {
      bg: "bg-pink-600",
      text: "text-pink-600",
      border: "border-pink-200",
    },
    "9호선": {
      bg: "bg-amber-600",
      text: "text-amber-600",
      border: "border-amber-200",
    },
  };

export default function StationsPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [filteredStations, setFilteredStations] = useState<Station[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLine, setSelectedLine] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 지하철역 데이터 로드
  useEffect(() => {
    const fetchStations = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/stations");
        const data = await response.json();

        if (response.ok) {
          setStations(data.stations);
          setFilteredStations(data.stations);
          setError(null);
        } else {
          setError(data.error || "지하철역 데이터를 불러오는데 실패했습니다");
        }
      } catch (error) {
        console.error("Error fetching stations:", error);
        setError("네트워크 오류가 발생했습니다");
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  // 검색 및 필터링
  useEffect(() => {
    let filtered = stations;

    // 검색어 필터링
    if (searchTerm) {
      filtered = filtered.filter(
        (station) =>
          station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          station.line.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 노선 필터링
    if (selectedLine !== "all") {
      filtered = filtered.filter((station) => station.line === selectedLine);
    }

    setFilteredStations(filtered);
  }, [searchTerm, selectedLine, stations]);

  // 고유한 노선 목록 가져오기
  const uniqueLines = Array.from(
    new Set(stations.map((station) => station.line))
  ).sort();

  const formatPrice = (price: number) => {
    return `${new Intl.NumberFormat("ko-KR").format(price / 10000)}만원`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Animated Background */}
      <div className="fixed inset-0 gradient-mesh opacity-20 -z-10"></div>
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl animate-float"></div>
      <div
        className="absolute top-40 right-20 w-32 h-32 bg-purple-400/20 rounded-full blur-xl animate-float"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute bottom-20 left-20 w-24 h-24 bg-pink-400/20 rounded-full blur-xl animate-float"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="relative z-10">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center mb-8 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-glow">
                <Train className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-slate-800 mb-4">
                지하철역별 검색
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                서울의 주요 지하철역별로 역세권 프리미엄 사무실과 상가를
                찾아보세요
              </p>
            </div>

            {/* Search and Filter */}
            <div className="max-w-2xl mx-auto animate-slide-in-up">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="지하철역명, 노선을 검색해보세요..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-14 pl-12 pr-4 text-lg bg-white/90 border-slate-300 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200 text-slate-900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="px-3 py-1">
                총 {filteredStations.length}개 역
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                평균 매물{" "}
                {stations.length > 0
                  ? Math.round(
                      stations.reduce((sum, s) => sum + s.listing_count, 0) /
                        stations.length
                    )
                  : 0}
                개
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="flex items-center gap-2"
              >
                <Grid3X3 className="h-4 w-4" />
                그리드
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="flex items-center gap-2"
              >
                <List className="h-4 w-4" />
                리스트
              </Button>
            </div>
          </div>

          {/* Line Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={selectedLine === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLine("all")}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              전체
            </Button>
            {uniqueLines.map((line) => {
              const colors = lineColors[line] || {
                bg: "bg-gray-600",
                text: "text-gray-600",
                border: "border-gray-200",
              };
              return (
                <Button
                  key={line}
                  variant={selectedLine === line ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLine(line)}
                  className={`flex items-center gap-2 ${
                    selectedLine === line
                      ? `${colors.bg} text-white border-0`
                      : `${colors.text} ${colors.border}`
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${colors.bg}`}></div>
                  {line}
                </Button>
              );
            })}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Train className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                지하철역 데이터를 불러오는 중...
              </h3>
              <p className="text-slate-600">잠시만 기다려주세요</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                오류가 발생했습니다
              </h3>
              <p className="text-slate-600 mb-4">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="gradient-blue text-white border-0 shadow-glow hover:shadow-lg transition-all duration-300"
              >
                다시 시도
              </Button>
            </div>
          )}

          {/* Stations Grid/List */}
          {!loading && !error && (
            <div
              className={cn(
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              )}
            >
              {filteredStations.map((station, index) => {
                const colors = lineColors[station.line] || {
                  bg: "bg-gray-600",
                  text: "text-gray-600",
                  border: "border-gray-200",
                };
                return (
                  <Card
                    key={station.id}
                    className={cn(
                      "group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border-white/50 bg-white/90 backdrop-blur-sm",
                      viewMode === "list" && "flex flex-row"
                    )}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardHeader
                      className={cn(
                        "relative overflow-hidden",
                        viewMode === "list" && "flex-1"
                      )}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Train className="h-4 w-4 text-blue-600" />
                            <span className="text-sm text-slate-600">
                              지하철역
                            </span>
                          </div>
                          {station.popular && (
                            <Badge className="bg-gradient-to-r from-orange-400 to-pink-500 text-white border-0">
                              <Star className="h-3 w-3 mr-1" />
                              인기
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl text-slate-800 mb-2">
                          {station.name}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge className={`text-white ${colors.bg} border-0`}>
                            {station.line}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent
                      className={cn(
                        "space-y-4",
                        viewMode === "list" && "flex-1"
                      )}
                    >
                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg mx-auto mb-2">
                            <Building2 className="h-4 w-4 text-blue-600" />
                          </div>
                          <p className="text-xs text-slate-600">매물수</p>
                          <p className="text-sm font-semibold text-slate-800">
                            {station.listing_count.toLocaleString()}개
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg mx-auto mb-2">
                            <MapPin className="h-4 w-4 text-green-600" />
                          </div>
                          <p className="text-xs text-slate-600">역세권</p>
                          <p className="text-sm font-semibold text-slate-800">
                            도보 10분
                          </p>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button
                        className="w-full gradient-blue text-white border-0 shadow-glow hover:shadow-lg transition-all duration-300 group-hover:scale-105"
                        onClick={() =>
                          (window.location.href = `/list?stations=${station.id}`)
                        }
                      >
                        매물 보기
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredStations.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                검색 결과가 없습니다
              </h3>
              <p className="text-slate-600">다른 키워드로 검색해보세요</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
