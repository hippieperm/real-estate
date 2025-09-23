"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestFixPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  const testFixUser = async () => {
    setLoading(true);
    setResult("");

    try {
      console.log("Testing fix user API...");

      const response = await fetch("/api/auth/fix-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "1231@123.com",
        }),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        setResult("✅ 사용자 수정 성공: " + JSON.stringify(data, null, 2));
      } else {
        setResult("❌ 사용자 수정 실패: " + JSON.stringify(data, null, 2));
      }
    } catch (error) {
      console.error("Error:", error);
      setResult("❌ 에러: " + error);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    setResult("");

    try {
      console.log("Testing login...");

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "1231@123.com",
          password: "123456",
        }),
      });

      console.log("Login response status:", response.status);
      const data = await response.json();
      console.log("Login response data:", data);

      if (response.ok) {
        setResult("✅ 로그인 성공: " + JSON.stringify(data, null, 2));
      } else {
        setResult("❌ 로그인 실패: " + JSON.stringify(data, null, 2));
      }
    } catch (error) {
      console.error("Login error:", error);
      setResult("❌ 로그인 에러: " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>사용자 수정 및 로그인 테스트</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                onClick={testFixUser}
                disabled={loading}
                className="flex-1"
              >
                {loading ? "수정 중..." : "사용자 수정 테스트"}
              </Button>

              <Button
                onClick={testLogin}
                disabled={loading}
                variant="outline"
                className="flex-1"
              >
                {loading ? "로그인 중..." : "로그인 테스트"}
              </Button>
            </div>

            {result && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <pre className="text-sm whitespace-pre-wrap">{result}</pre>
              </div>
            )}

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">테스트 순서:</h3>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. 먼저 "사용자 수정 테스트" 버튼을 클릭하세요</li>
                <li>2. 성공하면 "로그인 테스트" 버튼을 클릭하세요</li>
                <li>3. 브라우저 개발자 도구의 Console 탭을 확인하세요</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
