"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Building, MapPin, Phone, Mail, Clock, CheckCircle, Star, Users, ArrowRight } from "lucide-react"

const inquirySchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  phone: z.string().min(10, "올바른 연락처를 입력해주세요"),
  email: z.string().email("올바른 이메일을 입력해주세요").optional().or(z.literal("")),
  property_type: z.string().min(1, "희망 매물 유형을 선택해주세요"),
  location: z.string().min(1, "희망 지역을 입력해주세요"),
  budget_min: z.number().min(0, "최소 예산을 입력해주세요").optional(),
  budget_max: z.number().min(0, "최대 예산을 입력해주세요").optional(),
  area_min: z.number().min(0, "최소 면적을 입력해주세요").optional(),
  area_max: z.number().min(0, "최대 면적을 입력해주세요").optional(),
  move_in_date: z.string().optional(),
  message: z.string().min(10, "10자 이상의 상세 요청사항을 입력해주세요"),
})

type InquiryForm = z.infer<typeof inquirySchema>

const propertyTypes = [
  { value: "office", label: "사무실" },
  { value: "retail", label: "상가" },
  { value: "whole_building", label: "통건물" },
  { value: "residential", label: "주택형 사무실" },
]

const popularAreas = [
  "강남구 역삼동", "강남구 논현동", "강남구 삼성동", "서초구 서초동",
  "송파구 잠실동", "광진구 건대입구", "성동구 성수동", "마포구 상암동"
]

// 전화번호 포맷팅 함수
const formatPhoneNumber = (value: string) => {
  // 숫자만 추출
  const phoneNumber = value.replace(/[^\d]/g, '')

  // 길이에 따라 포맷팅
  if (phoneNumber.length <= 3) {
    return phoneNumber
  } else if (phoneNumber.length <= 7) {
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`
  } else if (phoneNumber.length <= 11) {
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7)}`
  }

  // 11자리 초과시 자르기
  return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`
}

export default function InquiryPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [selectedPropertyType, setSelectedPropertyType] = useState("")
  const [phoneValue, setPhoneValue] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<InquiryForm>({
    resolver: zodResolver(inquirySchema),
  })

  // 전화번호 입력 핸들러
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhoneValue(formatted)
    setValue("phone", formatted)
  }

  const onSubmit = async (data: InquiryForm) => {
    setIsSubmitting(true)

    try {
      const inquiryData = {
        name: data.name,
        phone: data.phone,
        message: `
희망 매물 유형: ${propertyTypes.find(pt => pt.value === data.property_type)?.label}
희망 지역: ${data.location}
예산: ${data.budget_min || 0}만원 ~ ${data.budget_max || '제한없음'}만원
희망 면적: ${data.area_min || 0}평 ~ ${data.area_max || '제한없음'}평
입주 희망일: ${data.move_in_date || '협의'}
이메일: ${data.email || '없음'}

상세 요청사항:
${data.message}
        `.trim(),
        source: 'web' as const,
      }

      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryData),
      })

      if (response.ok) {
        setIsSubmitted(true)
        reset()
      } else {
        throw new Error('문의 전송에 실패했습니다')
      }
    } catch (error) {
      console.error('Inquiry submission error:', error)
      alert('문의 전송에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Animated Background */}
        <div className="fixed inset-0 gradient-mesh opacity-30 -z-10"></div>
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-400/20 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>

        <div className="relative z-10 min-h-screen flex items-center justify-center py-12">
          <div className="max-w-2xl mx-auto px-4">
            <Card className="glass border-white/50 shadow-elegant">
              <CardContent className="text-center py-16">
                <div className="relative mb-8">
                  <div className="w-20 h-20 gradient-blue rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
                    <CheckCircle className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-lg opacity-60"></div>
                </div>

                <h1 className="text-4xl font-bold mb-4 text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  문의가 접수되었습니다
                </h1>
                <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                  전문 상담사가 <span className="font-semibold text-blue-600">24시간 내</span>에 연락드리겠습니다.
                </p>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="text-slate-700">평일 09:00 ~ 18:00 우선 상담</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Phone className="h-4 w-4 text-purple-600" />
                      <span className="text-slate-700">주말/공휴일 다음 영업일</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Building className="h-4 w-4 text-emerald-600" />
                      <span className="text-slate-700">급한 문의: 02-1234-5678</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    className="gradient-blue text-white border-0 shadow-glow hover:shadow-lg transition-all duration-300 hover:scale-105 h-12 px-8"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    추가 문의하기
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.location.href = '/'}
                    className="glass border-white/50 hover:bg-white/20 transition-all duration-300 hover:scale-105 h-12 px-8"
                  >
                    홈으로 돌아가기
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Animated Background */}
      <div className="fixed inset-0 gradient-mesh opacity-30 -z-10"></div>
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl animate-float"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-purple-400/20 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-pink-400/20 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>

      {/* Hero Section */}
      <div className="relative z-10 pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-gradient bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                맞춤 매물
              </span>
              <br />
              <span className="text-slate-800">의뢰하기</span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-xl md:text-2xl text-slate-600 leading-relaxed mb-12">
              원하시는 조건을 알려주시면, <span className="font-semibold text-blue-600">전문가</span>가
              <span className="font-semibold text-purple-600"> 맞춤 매물</span>을 찾아드립니다
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
              <div className="glass border-white/50 rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:scale-105 animate-slide-in-left">
                <div className="relative mb-4">
                  <Clock className="h-12 w-12 text-blue-600 mx-auto" />
                  <div className="absolute -inset-2 bg-blue-500/20 rounded-lg blur-sm opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">빠른 응답</h3>
                <p className="text-slate-600">24시간 내 전문가 연락</p>
              </div>

              <div className="glass border-white/50 rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:scale-105 animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
                <div className="relative mb-4">
                  <Building className="h-12 w-12 text-purple-600 mx-auto" />
                  <div className="absolute -inset-2 bg-purple-500/20 rounded-lg blur-sm opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">맞춤 추천</h3>
                <p className="text-slate-600">조건에 딱 맞는 매물 선별</p>
              </div>

              <div className="glass border-white/50 rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:scale-105 animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
                <div className="relative mb-4">
                  <Users className="h-12 w-12 text-emerald-600 mx-auto" />
                  <div className="absolute -inset-2 bg-emerald-500/20 rounded-lg blur-sm opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">전문 상담</h3>
                <p className="text-slate-600">10년 경력 전문가 직접 상담</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-md mx-auto animate-slide-in-right">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">98%</div>
                <div className="text-sm text-slate-600 mt-1">고객 만족도</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">500+</div>
                <div className="text-sm text-slate-600 mt-1">성공 매칭</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">24h</div>
                <div className="text-sm text-slate-600 mt-1">평균 응답</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 pb-20">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Info */}
          <Card className="glass border-white/50 shadow-card hover:shadow-card-hover transition-all duration-300 animate-scale-in">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 gradient-blue rounded-lg flex items-center justify-center">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-slate-800">연락처 정보</CardTitle>
                  <CardDescription className="text-slate-600">문의 응답을 위한 연락처를 입력해주세요</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">이름 *</label>
                  <Input
                    {...register("name")}
                    placeholder="이름을 입력하세요"
                    className="h-12 bg-white/80 border-slate-200/50 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                      <span className="text-red-500">•</span>
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">연락처 *</label>
                  <Input
                    value={phoneValue}
                    onChange={handlePhoneChange}
                    placeholder="010-0000-0000"
                    maxLength={13}
                    className="h-12 bg-white border-slate-300 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200 text-slate-900 placeholder:text-slate-500"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                      <span className="text-red-500">•</span>
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">이메일 (선택)</label>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="example@email.com"
                  className="h-12 bg-white/80 border-slate-200/50 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                    <span className="text-red-500">•</span>
                    {errors.email.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Property Requirements */}
          <Card className="glass border-white/50 shadow-card hover:shadow-card-hover transition-all duration-300 animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 gradient-purple rounded-lg flex items-center justify-center">
                  <Building className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-slate-800">희망 조건</CardTitle>
                  <CardDescription className="text-slate-600">원하시는 매물 조건을 선택해주세요</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Property Type */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-3 block">매물 유형 *</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {propertyTypes.map((type) => (
                    <Button
                      key={type.value}
                      type="button"
                      variant={selectedPropertyType === type.value ? "default" : "outline"}
                      onClick={() => {
                        setSelectedPropertyType(type.value)
                        setValue("property_type", type.value)
                      }}
                      className={`h-14 transition-all duration-300 ${
                        selectedPropertyType === type.value
                          ? "gradient-blue text-white shadow-glow hover:shadow-lg border-0"
                          : "glass border-white/50 hover:bg-white/80 hover:scale-105"
                      }`}
                    >
                      {type.label}
                    </Button>
                  ))}
                </div>
                {errors.property_type && (
                  <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                    <span className="text-red-500">•</span>
                    {errors.property_type.message}
                  </p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-3 block">희망 지역 *</label>
                <Input
                  {...register("location")}
                  placeholder="예: 강남구 역삼동, 테헤란로 인근"
                  className="h-12 bg-white/80 border-slate-200/50 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200 mb-3"
                />
                <div className="flex flex-wrap gap-2">
                  {popularAreas.map((area) => (
                    <Badge
                      key={area}
                      variant="outline"
                      className="cursor-pointer hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 py-2 px-3 text-xs glass border-white/50"
                      onClick={() => setValue("location", area)}
                    >
                      {area}
                    </Badge>
                  ))}
                </div>
                {errors.location && (
                  <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                    <span className="text-red-500">•</span>
                    {errors.location.message}
                  </p>
                )}
              </div>

              {/* Budget */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-3 block">예산 (보증금, 만원)</label>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    {...register("budget_min", { valueAsNumber: true })}
                    type="number"
                    placeholder="최소 예산"
                    min="0"
                    className="h-12 bg-white/80 border-slate-200/50 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200"
                  />
                  <Input
                    {...register("budget_max", { valueAsNumber: true })}
                    type="number"
                    placeholder="최대 예산"
                    min="0"
                    className="h-12 bg-white/80 border-slate-200/50 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Area */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-3 block">희망 면적 (평)</label>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    {...register("area_min", { valueAsNumber: true })}
                    type="number"
                    placeholder="최소 면적"
                    min="0"
                    className="h-12 bg-white/80 border-slate-200/50 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200"
                  />
                  <Input
                    {...register("area_max", { valueAsNumber: true })}
                    type="number"
                    placeholder="최대 면적"
                    min="0"
                    className="h-12 bg-white/80 border-slate-200/50 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Move-in Date */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-3 block">입주 희망일</label>
                <Input
                  {...register("move_in_date")}
                  type="date"
                  className="h-12 bg-white/80 border-slate-200/50 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200"
                />
              </div>
            </CardContent>
          </Card>

          {/* Message */}
          <Card className="glass border-white/50 shadow-card hover:shadow-card-hover transition-all duration-300 animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 gradient-ocean rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-slate-800">상세 요청사항</CardTitle>
                  <CardDescription className="text-slate-600">추가 요구사항이나 특별한 조건이 있으시면 자세히 적어주세요</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <textarea
                {...register("message")}
                placeholder="예: 주차 가능한 곳, 엘리베이터 있는 건물, 24시간 출입 가능, 인테리어 상태 양호한 곳 등"
                className="w-full px-4 py-4 bg-white/80 border border-slate-200/50 rounded-xl resize-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200 text-slate-700 placeholder:text-slate-400"
                rows={6}
              />
              {errors.message && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <span className="text-red-500">•</span>
                  {errors.message.message}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Privacy Notice */}
          <Card className="glass border-white/50 shadow-card animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <CardContent className="py-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="h-4 w-4 text-slate-600" />
                </div>
                <div className="text-sm text-slate-600">
                  <h4 className="font-semibold text-slate-800 mb-3">개인정보 처리 안내</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1.5 w-1 h-1 rounded-full bg-blue-500 flex-shrink-0"></span>
                      <span>수집된 개인정보는 매물 상담 및 연락 목적으로만 사용됩니다.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1.5 w-1 h-1 rounded-full bg-blue-500 flex-shrink-0"></span>
                      <span>개인정보는 문의 처리 완료 후 1년간 보관 후 삭제됩니다.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1.5 w-1 h-1 rounded-full bg-blue-500 flex-shrink-0"></span>
                      <span>정보 제공을 거부할 수 있으나, 이 경우 상담 서비스 이용이 제한됩니다.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="text-center animate-scale-in" style={{ animationDelay: '0.4s' }}>
            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="gradient-blue text-white border-0 shadow-glow hover:shadow-lg transition-all duration-300 hover:scale-105 h-16 px-12 text-lg font-semibold"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                  전송 중...
                </>
              ) : (
                <>
                  <MessageSquare className="mr-3 h-5 w-5" />
                  문의하기
                  <ArrowRight className="ml-3 h-5 w-5" />
                </>
              )}
            </Button>
            <p className="text-slate-600 mt-4 flex items-center justify-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              문의 후 24시간 내에 전문가가 연락드립니다
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}