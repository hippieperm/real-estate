"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function QuickTestPage() {
  const [email, setEmail] = useState("1231@123.com")
  const [password, setPassword] = useState("password123")
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  const quickSignup = async () => {
    setLoading(true)
    setResult("")

    try {
      console.log("현재 URL:", window.location.origin)
      console.log("API 호출:", `${window.location.origin}/api/auth/signup`)

      const response = await fetch(`${window.location.origin}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: "Quick Test User",
          email: email,
          phone: "010-1234-5678",
          password: password
        }),
      })

      const data = await response.json()
      console.log("회원가입 응답:", data)

      if (response.ok) {
        setResult("✅ 회원가입 성공!")
      } else {
        setResult(`❌ 회원가입 실패: ${data.error}`)
      }
    } catch (error) {
      console.error(error)
      setResult(`❌ 에러: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const quickLogin = async () => {
    setLoading(true)
    setResult("")

    try {
      console.log("현재 URL:", window.location.origin)
      console.log("API 호출:", `${window.location.origin}/api/auth/login`)

      const response = await fetch(`${window.location.origin}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        }),
      })

      const data = await response.json()
      console.log("로그인 응답:", data)

      if (response.ok) {
        setResult("✅ 로그인 성공!")
      } else {
        setResult(`❌ 로그인 실패: ${data.error}`)
      }
    } catch (error) {
      console.error(error)
      setResult(`❌ 에러: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const fixUser = async () => {
    setLoading(true)
    setResult("")

    try {
      console.log("기존 사용자 이메일 확인 상태 수정:", email)

      const response = await fetch(`${window.location.origin}/api/auth/fix-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email
        }),
      })

      const data = await response.json()
      console.log("사용자 수정 응답:", data)

      if (response.ok) {
        setResult("✅ 사용자 이메일 확인 완료! 이제 로그인 가능합니다.")
      } else {
        setResult(`❌ 사용자 수정 실패: ${data.error}`)
      }
    } catch (error) {
      console.error(error)
      setResult(`❌ 에러: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">빠른 인증 테스트</h1>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">이메일</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일 입력"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">비밀번호</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
            />
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <Button
            onClick={quickSignup}
            disabled={loading}
            className="w-full"
          >
            {loading ? "처리 중..." : "회원가입"}
          </Button>

          <Button
            onClick={fixUser}
            disabled={loading}
            variant="secondary"
            className="w-full"
          >
            {loading ? "처리 중..." : "기존 계정 이메일 확인"}
          </Button>

          <Button
            onClick={quickLogin}
            disabled={loading}
            variant="outline"
            className="w-full"
          >
            {loading ? "처리 중..." : "로그인"}
          </Button>
        </div>

        {result && (
          <div className="p-3 bg-gray-50 rounded text-sm">
            {result}
          </div>
        )}

        <div className="mt-6 text-xs text-gray-500">
          <p>현재 페이지: {typeof window !== 'undefined' ? window.location.href : 'loading...'}</p>
          <p>API 경로: /api/auth/signup, /api/auth/login</p>
        </div>
      </div>
    </div>
  )
}