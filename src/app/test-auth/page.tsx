"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function TestAuthPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string>("")

  const testSignup = async () => {
    setLoading(true)
    setResult("")

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: "테스트 사용자",
          email: `test${Date.now()}@example.com`,
          phone: "010-1234-5678",
          password: "test123456"
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult("✅ 회원가입 성공: " + JSON.stringify(data, null, 2))
      } else {
        setResult("❌ 회원가입 실패: " + JSON.stringify(data, null, 2))
      }
    } catch (error) {
      setResult("❌ 에러: " + error)
    } finally {
      setLoading(false)
    }
  }

  const testLogin = async () => {
    setLoading(true)
    setResult("")

    try {
      // 가장 최근에 생성된 사용자로 로그인 (실제로는 회원가입 후 반환된 이메일 사용)
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: "test1727081045167@example.com", // 실제 존재하는 계정으로 테스트
          password: "test123456"
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult("✅ 로그인 성공: " + JSON.stringify(data, null, 2))
      } else {
        setResult("❌ 로그인 실패: " + JSON.stringify(data, null, 2))
      }
    } catch (error) {
      setResult("❌ 에러: " + error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">인증 API 테스트</h1>

        <div className="space-y-4 mb-8">
          <Button
            onClick={testSignup}
            disabled={loading}
            className="w-full"
          >
            {loading ? "테스트 중..." : "회원가입 테스트"}
          </Button>

          <Button
            onClick={testLogin}
            disabled={loading}
            variant="outline"
            className="w-full"
          >
            {loading ? "테스트 중..." : "로그인 테스트"}
          </Button>
        </div>

        {result && (
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-semibold mb-2">결과:</h3>
            <pre className="text-sm overflow-auto whitespace-pre-wrap">
              {result}
            </pre>
          </div>
        )}

        <div className="mt-8 text-sm text-gray-600">
          <p>📍 현재 서버: http://localhost:3001</p>
          <p>📧 테스트 이메일: test@example.com</p>
          <p>🔑 테스트 비밀번호: test123456</p>
        </div>
      </div>
    </div>
  )
}