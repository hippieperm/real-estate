"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  SlidersHorizontal,
  Grid,
  List,
  Heart,
} from "lucide-react";
import { formatPrice, formatArea } from "@/lib/utils";
import Link from "next/link";

const sortOptions = [
  { value: "created_at", label: "최신순" },
  { value: "price_deposit", label: "보증금 낮은순" },
  { value: "price_monthly", label: "월세 낮은순" },
  { value: "pyeong_exclusive", label: "면적 작은순" },
];

const propertyTypes = [
  { value: "office", label: "사무실" },
  { value: "retail", label: "상가" },
  { value: "whole_building", label: "통건물" },
  { value: "residential", label: "주택형" },
];

export default function ListSearchPage() {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [filters, setFilters] = useState({
    query: searchParams.get("query") || "",
    property_type: searchParams.get("property_type")?.split(",") || [],
    min_deposit: Number(searchParams.get("min_deposit")) || 0,
    max_deposit: Number(searchParams.get("max_deposit")) || 100000,
    min_monthly: Number(searchParams.get("min_monthly")) || 0,
    max_monthly: Number(searchParams.get("max_monthly")) || 10000,
    min_pyeong: Number(searchParams.get("min_pyeong")) || 0,
    max_pyeong: Number(searchParams.get("max_pyeong")) || 500,
    sort_by: searchParams.get("sort_by") || "created_at",
  });

  useEffect(() => {
    searchListings();
  }, [page]);

  const searchListings = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...filters,
          page,
          limit: 20,
        }),
      });

      const data = await response.json();

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Input
                placeholder="지역, 역, 매물명 검색"
                value={filters.query}
                onChange={(e) =>
                  setFilters({ ...filters, query: e.target.value })
                }
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="pr-10 text-slate-900"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-0 top-0"
                onClick={handleSearch}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              필터
            </Button>

            <div className="flex border rounded-md">
              <Button
                size="sm"
                variant={viewMode === "grid" ? "default" : "ghost"}
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === "list" ? "default" : "ghost"}
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-6 p-4 bg-white rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium">매물 유형</label>
                <div className="mt-2 space-y-2">
                  {propertyTypes.map((type) => (
                    <label key={type.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.property_type.includes(type.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters({
                              ...filters,
                              property_type: [
                                ...filters.property_type,
                                type.value,
                              ],
                            });
                          } else {
                            setFilters({
                              ...filters,
                              property_type: filters.property_type.filter(
                                (t) => t !== type.value
                              ),
                            });
                          }
                        }}
                        className="mr-2"
                      />
                      {type.label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">보증금 (만원)</label>
                <div className="mt-2 space-y-2">
                  <Input
                    type="number"
                    placeholder="최소"
                    value={filters.min_deposit}
                    onChange={(e) =>
                      setFilters({ ...filters, min_deposit: +e.target.value })
                    }
                    className="text-slate-900"
                  />
                  <Input
                    type="number"
                    placeholder="최대"
                    value={filters.max_deposit}
                    onChange={(e) =>
                      setFilters({ ...filters, max_deposit: +e.target.value })
                    }
                    className="text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">월세 (만원)</label>
                <div className="mt-2 space-y-2">
                  <Input
                    type="number"
                    placeholder="최소"
                    value={filters.min_monthly}
                    onChange={(e) =>
                      setFilters({ ...filters, min_monthly: +e.target.value })
                    }
                    className="text-slate-900"
                  />
                  <Input
                    type="number"
                    placeholder="최대"
                    value={filters.max_monthly}
                    onChange={(e) =>
                      setFilters({ ...filters, max_monthly: +e.target.value })
                    }
                    className="text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">전용면적 (평)</label>
                <div className="mt-2 space-y-2">
                  <Input
                    type="number"
                    placeholder="최소"
                    value={filters.min_pyeong}
                    onChange={(e) =>
                      setFilters({ ...filters, min_pyeong: +e.target.value })
                    }
                    className="text-slate-900"
                  />
                  <Input
                    type="number"
                    placeholder="최대"
                    value={filters.max_pyeong}
                    onChange={(e) =>
                      setFilters({ ...filters, max_pyeong: +e.target.value })
                    }
                    className="text-slate-900"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({
                    query: "",
                    property_type: [],
                    min_deposit: 0,
                    max_deposit: 100000,
                    min_monthly: 0,
                    max_monthly: 10000,
                    min_pyeong: 0,
                    max_pyeong: 500,
                    sort_by: "created_at",
                  });
                }}
              >
                초기화
              </Button>
              <Button onClick={handleSearch}>적용</Button>
            </div>
          </div>
        )}

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-lg font-semibold">
              검색결과 {total.toLocaleString()}건
            </p>
            {filters.query && (
              <p className="text-sm text-gray-600">
                &quot;{filters.query}&quot; 검색결과
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm">정렬:</label>
            <select
              value={filters.sort_by}
              onChange={(e) => {
                setFilters({ ...filters, sort_by: e.target.value });
                handleSearch();
              }}
              className="border rounded px-2 py-1"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Grid/List */}
        {loading && page === 1 ? (
          <div className="text-center py-12">
            <p>검색 중...</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">검색 결과가 없습니다.</p>
            <p className="text-sm text-gray-400 mt-2">
              다른 조건으로 검색해보세요.
            </p>
          </div>
        ) : (
          <>
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {listings.map((listing) => (
                <Link key={listing.id} href={`/listing/${listing.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    {viewMode === "grid" ? (
                      <>
                        <div className="aspect-video bg-gray-200 relative overflow-hidden">
                          <img
                            src="https://via.placeholder.com/400x300"
                            alt={listing.title}
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute top-2 right-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="bg-white/80"
                            >
                              <Heart className="h-4 w-4" />
                            </Button>
                          </div>
                          {listing.listing_themes?.length > 0 && (
                            <div className="absolute top-2 left-2">
                              <Badge className="bg-primary text-white">
                                {
                                  listing.listing_themes[0].theme_categories
                                    .label_ko
                                }
                              </Badge>
                            </div>
                          )}
                        </div>
                        <CardHeader>
                          <CardTitle className="text-lg line-clamp-1">
                            {listing.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="font-semibold text-lg">
                              보증금 {formatPrice(listing.price_deposit)}만원
                              {listing.price_monthly &&
                                ` / 월 ${formatPrice(
                                  listing.price_monthly
                                )}만원`}
                            </div>
                            <div className="text-sm">
                              전용 {formatArea(listing.exclusive_m2)} ·{" "}
                              {listing.floor}층
                            </div>
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {listing.address_road}
                            </div>
                          </div>
                        </CardContent>
                      </>
                    ) : (
                      <div className="flex">
                        <div className="w-48 h-32 bg-gray-200 relative overflow-hidden">
                          <img
                            src="https://via.placeholder.com/192x128"
                            alt={listing.title}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg line-clamp-1">
                                {listing.title}
                              </h3>
                              <div className="font-semibold text-lg mt-1">
                                보증금 {formatPrice(listing.price_deposit)}만원
                                {listing.price_monthly &&
                                  ` / 월 ${formatPrice(
                                    listing.price_monthly
                                  )}만원`}
                              </div>
                              <div className="text-sm mt-2">
                                전용 {formatArea(listing.exclusive_m2)} · 공급{" "}
                                {formatArea(listing.supply_m2)} ·{" "}
                                {listing.floor}층
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                {listing.address_road}
                              </div>
                            </div>
                            <Button size="icon" variant="ghost">
                              <Heart className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                </Link>
              ))}
            </div>

            {/* Load More */}
            {listings.length < total && (
              <div className="text-center mt-8">
                <Button
                  onClick={loadMore}
                  disabled={loading}
                  variant="outline"
                  size="lg"
                >
                  {loading ? "로딩 중..." : "더 보기"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
