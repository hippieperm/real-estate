"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DebugTestPage() {
  const [debugData, setDebugData] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchDebugData = async () => {
    try {
      const response = await fetch("/api/debug/listings");
      const data = await response.json();
      setDebugData(data);
      console.log("Debug data:", data);
    } catch (error) {
      console.error("Debug fetch error:", error);
    }
  };

  const testSearchAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          limit: 10,
          sort_by: "created_at",
        }),
      });
      const data = await response.json();
      setSearchResults(data);
      console.log("Search results:", data);
    } catch (error) {
      console.error("Search test error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebugData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">디버깅 테스트 페이지</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>데이터베이스 상태</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={fetchDebugData} className="w-full">
                데이터베이스 상태 확인
              </Button>
              {debugData && (
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>전체 매물:</strong> {debugData.totalCount}
                  </p>
                  <p>
                    <strong>활성 매물:</strong> {debugData.activeCount}
                  </p>
                  <p>
                    <strong>created_by 있음:</strong>{" "}
                    {debugData.summary.withCreatedBy}
                  </p>
                  <p>
                    <strong>created_by 없음:</strong>{" "}
                    {debugData.summary.withoutCreatedBy}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>검색 API 테스트</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={testSearchAPI}
                disabled={loading}
                className="w-full"
              >
                {loading ? "검색 중..." : "검색 API 테스트"}
              </Button>
              {searchResults && (
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>검색 결과 수:</strong>{" "}
                    {searchResults.listings?.length || 0}
                  </p>
                  <p>
                    <strong>전체 수:</strong> {searchResults.total || 0}
                  </p>
                  <p>
                    <strong>페이지:</strong> {searchResults.page || 1}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {debugData && debugData.listings && (
          <Card>
            <CardHeader>
              <CardTitle>매물 목록 (최근 5개)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {debugData.listings.slice(0, 5).map((listing: any) => (
                  <div
                    key={listing.id}
                    className="p-3 border rounded-lg text-sm"
                  >
                    <p>
                      <strong>제목:</strong> {listing.title}
                    </p>
                    <p>
                      <strong>상태:</strong> {listing.status}
                    </p>
                    <p>
                      <strong>생성자:</strong> {listing.created_by || "없음"}
                    </p>
                    <p>
                      <strong>생성일:</strong>{" "}
                      {new Date(listing.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

