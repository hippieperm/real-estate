"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TestUserPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("test123456");
  const [name, setName] = useState("테스트 사용자");

  const createTestUser = async () => {
    setLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/auth/create-test-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(
          "✅ 테스트 사용자 생성 성공: " + JSON.stringify(data, null, 2)
        );
      } else {
        setResult("❌ 사용자 생성 실패: " + JSON.stringify(data, null, 2));
      }
    } catch (error) {
      setResult("❌ 에러: " + error);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult("✅ 로그인 성공: " + JSON.stringify(data, null, 2));
      } else {
        setResult("❌ 로그인 실패: " + JSON.stringify(data, null, 2));
      }
    } catch (error) {
      setResult("❌ 에러: " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>테스트 사용자 생성 및 로그인</CardTitle>
            <CardDescription>
              이메일 확인 없이 테스트 사용자를 생성하고 로그인을 테스트합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">이메일</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">비밀번호</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="test123456"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">이름</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="테스트 사용자"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={createTestUser}
                disabled={loading}
                className="flex-1"
              >
                {loading ? "생성 중..." : "테스트 사용자 생성"}
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
              <h3 className="font-medium text-blue-900 mb-2">해결 방법:</h3>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. 위에서 테스트 사용자를 생성하세요</li>
                <li>2. 생성된 계정으로 로그인을 테스트하세요</li>
                <li>
                  3. 또는 Supabase 대시보드에서 이메일 확인을 비활성화하세요
                </li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
