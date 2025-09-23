"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SuccessModal } from "@/components/ui/success-modal";
import { ErrorModal } from "@/components/ui/error-modal";
import {
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("올바른 이메일을 입력해주세요"),
  password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);

    try {
      console.log("Attempting login for:", data.email);

      const response = await fetch(`${window.location.origin}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log(
        "Login response status:",
        response.status,
        response.statusText
      );

      const result = await response.json();
      console.log("Login response data:", result);

      if (!response.ok) {
        console.error("Login failed:", {
          status: response.status,
          statusText: response.statusText,
          result,
        });
        throw new Error(result.error || "로그인에 실패했습니다");
      }

      // 성공 모달 표시
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("로그인에 실패했습니다. 다시 시도해주세요.");
      }
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessModalConfirm = () => {
    setShowSuccessModal(false);
    window.location.href = "/";
  };

  const handleErrorModalRetry = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Animated Background */}
      <div className="fixed inset-0 gradient-mesh opacity-30 -z-10"></div>
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl animate-float"></div>
      <div
        className="absolute top-40 right-20 w-32 h-32 bg-purple-400/20 rounded-full blur-xl animate-float"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute bottom-20 left-20 w-24 h-24 bg-pink-400/20 rounded-full blur-xl animate-float"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          {/* Logo and Title */}
          <div className="text-center mb-8 animate-fade-in">
            <Link
              href="/"
              className="inline-flex items-center space-x-3 group mb-6"
            >
              <div className="relative">
                <Building2 className="h-10 w-10 text-blue-600 transition-transform group-hover:scale-110 duration-300" />
                <div className="absolute -inset-2 bg-blue-500/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <span className="text-2xl font-bold text-slate-800">
                알파카 리스
              </span>
            </Link>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">로그인</h1>
            <p className="text-slate-600">
              계정에 로그인하여 서비스를 이용하세요
            </p>
          </div>

          {/* Login Form */}
          <Card className="glass border-white/50 shadow-elegant animate-scale-in">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 gradient-blue rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
                <LogIn className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl text-slate-800">
                계정 로그인
              </CardTitle>
              <CardDescription className="text-slate-600">
                이메일과 비밀번호를 입력해주세요
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Email */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    이메일
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      {...register("email")}
                      type="email"
                      placeholder="example@email.com"
                      className="h-12 pl-10 bg-white border-slate-300 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200 text-slate-900 placeholder:text-slate-500"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                      <span className="text-red-500">•</span>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    비밀번호
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="비밀번호를 입력하세요"
                      className="h-12 pl-10 pr-10 bg-white border-slate-300 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200 text-slate-900 placeholder:text-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                      <span className="text-red-500">•</span>
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                    />
                    <span className="ml-2 text-sm text-slate-600">
                      로그인 상태 유지
                    </span>
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    비밀번호 찾기
                  </Link>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 gradient-blue text-white border-0 shadow-glow hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      로그인 중...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      로그인
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center">
                <div className="flex-1 border-t border-slate-200"></div>
                <span className="px-3 text-sm text-slate-500">또는</span>
                <div className="flex-1 border-t border-slate-200"></div>
              </div>

              {/* Social Login */}
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 glass border-white/50 hover:bg-white/80 transition-all duration-300"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google로 로그인
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 glass border-white/50 hover:bg-white/80 transition-all duration-300"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub로 로그인
                </Button>
              </div>

              {/* Sign Up Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-slate-600">
                  아직 계정이 없으신가요?{" "}
                  <Link
                    href="/auth/signup"
                    className="text-blue-600 hover:text-blue-500 font-semibold transition-colors"
                  >
                    회원가입하기
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center animate-slide-in-right">
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-xs text-slate-600">안전한 로그인</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Building2 className="h-4 w-4 text-purple-600" />
              </div>
              <p className="text-xs text-slate-600">프리미엄 매물</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <LogIn className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="text-xs text-slate-600">빠른 접속</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="로그인 성공!"
        message="알파카 리스에 성공적으로 로그인되었습니다. 이제 모든 서비스를 이용하실 수 있습니다."
        onConfirm={handleSuccessModalConfirm}
        confirmText="시작하기"
        showConfetti={true}
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="로그인 실패"
        message={errorMessage}
        onRetry={handleErrorModalRetry}
        retryText="다시 시도"
        showRetryButton={true}
      />
    </div>
  );
}
