"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Search,
  Building2,
  Users,
  TrendingUp,
  Star,
  Filter,
  Grid3X3,
  List,
  ArrowRight,
  Map,
} from "lucide-react";
import { cn } from "@/lib/utils";

// 지역 데이터 (실제로는 API에서 가져올 데이터)
const regions = [
  {
    id: 1,
    name: "강남구",
    district: "서울특별시",
    buildingCount: 1247,
    avgPrice: 850000,
    trend: "+12%",
    popular: true,
    image: "/api/placeholder/400/200",
    description: "강남의 핵심 비즈니스 중심지",
    subRegions: ["역삼동", "삼성동", "청담동", "압구정동", "신사동", "논현동"],
  },
  {
    id: 2,
    name: "서초구",
    district: "서울특별시",
    buildingCount: 892,
    avgPrice: 720000,
    trend: "+8%",
    popular: true,
    image: "/api/placeholder/400/200",
    description: "법조타운과 IT 중심의 프리미엄 지역",
    subRegions: ["서초동", "방배동", "잠원동", "반포동", "내곡동"],
  },
  {
    id: 3,
    name: "송파구",
    district: "서울특별시",
    buildingCount: 654,
    avgPrice: 680000,
    trend: "+15%",
    popular: false,
    image: "/api/placeholder/400/200",
    description: "잠실과 올림픽공원을 중심으로 한 신도시",
    subRegions: ["잠실동", "문정동", "가락동", "석촌동", "방이동", "송파동"],
  },
  {
    id: 4,
    name: "마포구",
    district: "서울특별시",
    buildingCount: 423,
    avgPrice: 520000,
    trend: "+6%",
    popular: false,
    image: "/api/placeholder/400/200",
    description: "홍대와 상암동을 중심으로 한 창업 허브",
    subRegions: ["홍대", "상암동", "합정동", "성산동", "공덕동", "대흥동"],
  },
  {
    id: 5,
    name: "영등포구",
    district: "서울특별시",
    buildingCount: 387,
    avgPrice: 480000,
    trend: "+4%",
    popular: false,
    image: "/api/placeholder/400/200",
    description: "여의도 금융센터와 연결된 비즈니스 지역",
    subRegions: ["여의도", "영등포동", "당산동", "문래동", "신길동"],
  },
  {
    id: 6,
    name: "중구",
    district: "서울특별시",
    buildingCount: 298,
    avgPrice: 450000,
    trend: "+3%",
    popular: false,
    image: "/api/placeholder/400/200",
    description: "서울의 심장부, 전통과 현대가 공존하는 지역",
    subRegions: ["명동", "을지로", "회현동", "중림동", "봉래동"],
  },
];

export default function RegionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filteredRegions, setFilteredRegions] = useState(regions);

  useEffect(() => {
    const filtered = regions.filter(
      (region) =>
        region.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        region.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        region.subRegions.some((sub) =>
          sub.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    setFilteredRegions(filtered);
  }, [searchTerm]);

  const formatPrice = (price: number) => {
    return `${(price / 10000).toFixed(0)}만원`;
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
                <Map className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-slate-800 mb-4">
                지역별 검색
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                서울의 주요 비즈니스 지역별로 프리미엄 사무실과 상가를
                찾아보세요
              </p>
            </div>

            {/* Search and Filter */}
            <div className="max-w-2xl mx-auto animate-slide-in-up">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="지역명, 구, 동을 검색해보세요..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-14 pl-12 pr-4 text-lg bg-white/90 border-slate-300 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200"
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
                총 {filteredRegions.length}개 지역
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                평균 임대료{" "}
                {formatPrice(
                  regions.reduce((sum, r) => sum + r.avgPrice, 0) /
                    regions.length
                )}
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

          {/* Regions Grid/List */}
          <div
            className={cn(
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            )}
          >
            {filteredRegions.map((region, index) => (
              <Card
                key={region.id}
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
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-slate-600">
                          {region.district}
                        </span>
                      </div>
                      {region.popular && (
                        <Badge className="bg-gradient-to-r from-orange-400 to-pink-500 text-white border-0">
                          <Star className="h-3 w-3 mr-1" />
                          인기
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl text-slate-800 mb-2">
                      {region.name}
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      {region.description}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent
                  className={cn("space-y-4", viewMode === "list" && "flex-1")}
                >
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg mx-auto mb-2">
                        <Building2 className="h-4 w-4 text-blue-600" />
                      </div>
                      <p className="text-xs text-slate-600">건물수</p>
                      <p className="text-sm font-semibold text-slate-800">
                        {region.buildingCount.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg mx-auto mb-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </div>
                      <p className="text-xs text-slate-600">평균가격</p>
                      <p className="text-sm font-semibold text-slate-800">
                        {formatPrice(region.avgPrice)}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg mx-auto mb-2">
                        <Users className="h-4 w-4 text-purple-600" />
                      </div>
                      <p className="text-xs text-slate-600">상승률</p>
                      <p className="text-sm font-semibold text-green-600">
                        {region.trend}
                      </p>
                    </div>
                  </div>

                  {/* Sub Regions */}
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-2">
                      주요 동네
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {region.subRegions.slice(0, 4).map((subRegion) => (
                        <Badge
                          key={subRegion}
                          variant="outline"
                          className="text-xs"
                        >
                          {subRegion}
                        </Badge>
                      ))}
                      {region.subRegions.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{region.subRegions.length - 4}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    className="w-full gradient-blue text-white border-0 shadow-glow hover:shadow-lg transition-all duration-300 group-hover:scale-105"
                    onClick={() =>
                      (window.location.href = `/list?region=${region.name}`)
                    }
                  >
                    매물 보기
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredRegions.length === 0 && (
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
