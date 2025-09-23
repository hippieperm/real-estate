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

export default function FixUserPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  const [email, setEmail] = useState("1231@123.com");

  const fixUser = async () => {
    setLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/auth/fix-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult("✅ 사용자 수정 성공: " + JSON.stringify(data, null, 2));
      } else {
        setResult("❌ 사용자 수정 실패: " + JSON.stringify(data, null, 2));
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
          password: "123456", // 기본 비밀번호
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
            <CardTitle>사용자 이메일 확인 수정</CardTitle>
            <CardDescription>
              기존 사용자의 이메일 확인 상태를 강제로 완료 처리합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">이메일</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="1231@123.com"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={fixUser} disabled={loading} className="flex-1">
                {loading ? "수정 중..." : "이메일 확인 완료 처리"}
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

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-900 mb-2">사용 방법:</h3>
              <ol className="text-sm text-green-800 space-y-1">
                <li>1. 위에서 이메일 확인을 완료 처리하세요</li>
                <li>2. 그 후 로그인을 테스트하세요</li>
                <li>3. 이제 정상적으로 로그인할 수 있습니다!</li>
              </ol>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-medium text-yellow-900 mb-2">주의사항:</h3>
              <p className="text-sm text-yellow-800">
                이 기능은 SUPABASE_SERVICE_ROLE_KEY가 올바르게 설정되어 있어야
                작동합니다. .env.local 파일에서 환경 변수를 확인해주세요.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
