"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Building, MapPin, Phone, Mail, Clock } from "lucide-react"

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

export default function InquiryPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [selectedPropertyType, setSelectedPropertyType] = useState("")

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
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Card>
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold mb-2">문의가 접수되었습니다</h1>
              <p className="text-gray-600 mb-6">
                전문 상담사가 24시간 내에 연락드리겠습니다.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>• 평일 09:00 ~ 18:00 우선 상담</p>
                <p>• 주말/공휴일은 다음 영업일에 연락</p>
                <p>• 급한 문의는 02-1234-5678로 전화주세요</p>
              </div>
              <div className="mt-8">
                <Button onClick={() => setIsSubmitted(false)} className="mr-4">
                  추가 문의하기
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/'}>
                  홈으로 돌아가기
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">임대·임차 매물 의뢰</h1>
          <p className="text-gray-600 text-lg mb-6">
            원하시는 조건을 알려주시면, 전문가가 맞춤 매물을 찾아드립니다
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span>24시간 내 연락</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-blue-600" />
              <span>맞춤 매물 추천</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-blue-600" />
              <span>전문가 상담</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Info */}
          <Card>
            <CardHeader>
              <CardTitle>연락처 정보</CardTitle>
              <CardDescription>문의 응답을 위한 연락처를 입력해주세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">이름 *</label>
                  <Input
                    {...register("name")}
                    placeholder="이름을 입력하세요"
                    className="mt-1"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium">연락처 *</label>
                  <Input
                    {...register("phone")}
                    placeholder="010-0000-0000"
                    className="mt-1"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">이메일 (선택)</label>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="example@email.com"
                  className="mt-1"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Property Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>희망 조건</CardTitle>
              <CardDescription>원하시는 매물 조건을 선택해주세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Property Type */}
              <div>
                <label className="text-sm font-medium">매물 유형 *</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {propertyTypes.map((type) => (
                    <Button
                      key={type.value}
                      type="button"
                      variant={selectedPropertyType === type.value ? "default" : "outline"}
                      onClick={() => {
                        setSelectedPropertyType(type.value)
                        setValue("property_type", type.value)
                      }}
                      className="h-12"
                    >
                      {type.label}
                    </Button>
                  ))}
                </div>
                {errors.property_type && (
                  <p className="text-red-500 text-xs mt-1">{errors.property_type.message}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="text-sm font-medium">희망 지역 *</label>
                <Input
                  {...register("location")}
                  placeholder="예: 강남구 역삼동, 테헤란로 인근"
                  className="mt-1"
                />
                <div className="flex flex-wrap gap-1 mt-2">
                  {popularAreas.map((area) => (
                    <Badge
                      key={area}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-white"
                      onClick={() => setValue("location", area)}
                    >
                      {area}
                    </Badge>
                  ))}
                </div>
                {errors.location && (
                  <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>
                )}
              </div>

              {/* Budget */}
              <div>
                <label className="text-sm font-medium">예산 (보증금, 만원)</label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <Input
                    {...register("budget_min", { valueAsNumber: true })}
                    type="number"
                    placeholder="최소 예산"
                    min="0"
                  />
                  <Input
                    {...register("budget_max", { valueAsNumber: true })}
                    type="number"
                    placeholder="최대 예산"
                    min="0"
                  />
                </div>
              </div>

              {/* Area */}
              <div>
                <label className="text-sm font-medium">희망 면적 (평)</label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <Input
                    {...register("area_min", { valueAsNumber: true })}
                    type="number"
                    placeholder="최소 면적"
                    min="0"
                  />
                  <Input
                    {...register("area_max", { valueAsNumber: true })}
                    type="number"
                    placeholder="최대 면적"
                    min="0"
                  />
                </div>
              </div>

              {/* Move-in Date */}
              <div>
                <label className="text-sm font-medium">입주 희망일</label>
                <Input
                  {...register("move_in_date")}
                  type="date"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Message */}
          <Card>
            <CardHeader>
              <CardTitle>상세 요청사항</CardTitle>
              <CardDescription>추가 요구사항이나 특별한 조건이 있으시면 자세히 적어주세요</CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                {...register("message")}
                placeholder="예: 주차 가능한 곳, 엘리베이터 있는 건물, 24시간 출입 가능, 인테리어 상태 양호한 곳 등"
                className="w-full px-3 py-2 border border-input rounded-md resize-none"
                rows={5}
              />
              {errors.message && (
                <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
              )}
            </CardContent>
          </Card>

          {/* Privacy Notice */}
          <Card>
            <CardContent className="text-sm text-gray-600">
              <h4 className="font-semibold mb-2">개인정보 처리 안내</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>수집된 개인정보는 매물 상담 및 연락 목적으로만 사용됩니다.</li>
                <li>개인정보는 문의 처리 완료 후 1년간 보관 후 삭제됩니다.</li>
                <li>정보 제공을 거부할 수 있으나, 이 경우 상담 서비스 이용이 제한됩니다.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="text-center">
            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="px-12"
            >
              {isSubmitting ? '전송 중...' : '문의하기'}
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              문의 후 24시간 내에 전문가가 연락드립니다
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}