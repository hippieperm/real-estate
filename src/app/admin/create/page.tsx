"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/ui/image-upload"
import { 
  ArrowLeft, 
  Save, 
  Building2,
  MapPin,
  DollarSign,
  Square,
  Upload
} from "lucide-react"
import Link from "next/link"

export default function CreateListingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    property_type: '',
    price_deposit: '',
    price_monthly: '',
    exclusive_m2: '',
    floor: '',
    building_floor: '',
    address_road: '',
    address_jibun: '',
    address_detail: '',
    latitude: '',
    longitude: '',
    status: 'active'
  })

  const formatNumber = (value: string) => {
    const numericValue = value.replace(/,/g, '')
    if (numericValue === '' || isNaN(Number(numericValue))) return value
    return Number(numericValue).toLocaleString('ko-KR')
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNumberInputChange = (field: string, value: string) => {
    const numericValue = value.replace(/,/g, '')
    setFormData(prev => ({
      ...prev,
      [field]: numericValue
    }))
  }

  const handleImageUpload = (files: File[]) => {
    setSelectedImages(prev => [...prev, ...files])
  }

  const handleImageRemove = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const uploadImages = async (listingId: string) => {
    if (selectedImages.length === 0) return []

    setUploadingImages(true)
    try {
      const formData = new FormData()
      selectedImages.forEach(file => {
        formData.append('files', file)
      })
      formData.append('listingId', listingId)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        return result.images
      } else {
        throw new Error('이미지 업로드 실패')
      }
    } catch (error) {
      console.error('Upload error:', error)
      throw error
    } finally {
      setUploadingImages(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 1. 매물 생성
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price_deposit: Number(formData.price_deposit),
          price_monthly: formData.price_monthly ? Number(formData.price_monthly) : null,
          exclusive_m2: Number(formData.exclusive_m2),
          floor: Number(formData.floor),
          building_floor: formData.building_floor ? Number(formData.building_floor) : null,
          latitude: formData.latitude ? Number(formData.latitude) : null,
          longitude: formData.longitude ? Number(formData.longitude) : null,
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || '매물 등록에 실패했습니다')
      }

      const { listing } = await response.json()

      // 2. 이미지 업로드 (선택사항)
      if (selectedImages.length > 0) {
        try {
          await uploadImages(listing.id)
        } catch (imageError) {
          console.error('Image upload error:', imageError)
          // 이미지 업로드 실패해도 매물 등록은 성공으로 처리
        }
      }

      alert('매물이 성공적으로 등록되었습니다!')
      router.push('/admin')

    } catch (error) {
      console.error('Create error:', error)
      alert(`등록에 실패했습니다: ${error.message || error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center gap-6">
            <Link href="/admin">
              <Button variant="outline" size="sm" className="gap-2 border-gray-300 text-gray-700 bg-white/90 hover:bg-white hover:border-gray-400 font-medium shadow-md hover:shadow-lg transition-all duration-200">
                <ArrowLeft className="h-4 w-4" />
                돌아가기
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">새 매물 등록</h1>
              <p className="text-lg text-gray-600">매물 정보를 입력하여 새로운 매물을 등록하세요</p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              실시간 저장
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">1</div>
                <span className="text-sm font-medium text-gray-900">기본정보</span>
              </div>
              <div className="w-16 h-px bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-sm font-medium">2</div>
                <span className="text-sm font-medium text-gray-500">위치정보</span>
              </div>
              <div className="w-16 h-px bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-sm font-medium">3</div>
                <span className="text-sm font-medium text-gray-500">이미지</span>
              </div>
            </div>
          </div>

          {/* 기본 정보 */}
          <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50 opacity-50"></div>
            <CardHeader className="pb-6 relative">
              <CardTitle className="flex items-center gap-4 text-2xl font-bold text-gray-900">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                기본 정보
                <div className="ml-auto">
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                    <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-blue-300 rounded-full"></div>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 relative">
              <div className="group">
                <Label htmlFor="title" className="text-sm font-semibold text-gray-800 mb-3 block flex items-center gap-2">
                  매물명 
                  <span className="text-red-500">*</span>
                  <div className="w-1 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="예: 강남역 프리미엄 오피스"
                  required
                  className="h-12 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                />
              </div>

              <div className="group">
                <Label htmlFor="description" className="text-sm font-semibold text-gray-800 mb-3 block flex items-center gap-2">
                  매물 설명
                  <div className="w-1 h-1 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="매물에 대한 자세한 설명을 입력하세요"
                  rows={4}
                  className="border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group">
                  <Label htmlFor="property_type" className="text-sm font-semibold text-gray-800 mb-3 block flex items-center gap-2">
                    매물 유형 
                    <span className="text-red-500">*</span>
                    <div className="w-1 h-1 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </Label>
                  <Select onValueChange={(value) => handleInputChange('property_type', value)} required>
                    <SelectTrigger className="h-12 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                      <SelectValue placeholder="매물 유형을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="office">🏢 사무실</SelectItem>
                      <SelectItem value="retail">🏪 상가</SelectItem>
                      <SelectItem value="building">🏬 통건물</SelectItem>
                      <SelectItem value="residential">🏠 주택형</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="group">
                  <Label htmlFor="status" className="text-sm font-semibold text-gray-800 mb-3 block flex items-center gap-2">
                    상태
                    <div className="w-1 h-1 bg-yellow-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger className="h-12 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="active">✅ 활성</SelectItem>
                      <SelectItem value="inactive">⭕ 비활성</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 가격 정보 */}
          <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-50/50 to-emerald-50/50 opacity-50"></div>
            <CardHeader className="pb-6 relative">
              <CardTitle className="flex items-center gap-4 text-2xl font-bold text-gray-900">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                가격 정보
                <div className="ml-auto">
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                    <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-green-300 rounded-full"></div>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group">
                  <Label htmlFor="price_deposit" className="text-sm font-semibold text-gray-800 mb-3 block flex items-center gap-2">
                    💰 보증금 (만원) 
                    <span className="text-red-500">*</span>
                    <div className="w-1 h-1 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </Label>
                  <Input
                    id="price_deposit"
                    type="text"
                    value={formatNumber(formData.price_deposit)}
                    onChange={(e) => handleNumberInputChange('price_deposit', e.target.value)}
                    placeholder="10,000"
                    required
                    className="h-12 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                  />
                </div>
                <div className="group">
                  <Label htmlFor="price_monthly" className="text-sm font-semibold text-gray-800 mb-3 block flex items-center gap-2">
                    📅 월세 (만원)
                    <div className="w-1 h-1 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </Label>
                  <Input
                    id="price_monthly"
                    type="text"
                    value={formData.price_monthly ? formatNumber(formData.price_monthly) : ''}
                    onChange={(e) => handleNumberInputChange('price_monthly', e.target.value)}
                    placeholder="300"
                    className="h-12 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 면적 및 층수 */}
          <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 to-pink-50/50 opacity-50"></div>
            <CardHeader className="pb-6 relative">
              <CardTitle className="flex items-center gap-4 text-2xl font-bold text-gray-900">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg">
                  <Square className="h-6 w-6 text-white" />
                </div>
                면적 및 층수
                <div className="ml-auto">
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-purple-300 rounded-full"></div>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 relative">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="group">
                  <Label htmlFor="exclusive_m2" className="text-sm font-semibold text-gray-800 mb-3 block flex items-center gap-2">
                    📐 전용면적 (㎡) 
                    <span className="text-red-500">*</span>
                    <div className="w-1 h-1 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </Label>
                  <Input
                    id="exclusive_m2"
                    type="text"
                    value={formData.exclusive_m2 ? formatNumber(formData.exclusive_m2) : ''}
                    onChange={(e) => handleNumberInputChange('exclusive_m2', e.target.value)}
                    placeholder="165.3"
                    required
                    className="h-12 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                  />
                </div>
                <div className="group">
                  <Label htmlFor="floor" className="text-sm font-semibold text-gray-800 mb-3 block flex items-center gap-2">
                    🏢 해당 층 
                    <span className="text-red-500">*</span>
                    <div className="w-1 h-1 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </Label>
                  <Input
                    id="floor"
                    type="text"
                    value={formData.floor ? formatNumber(formData.floor) : ''}
                    onChange={(e) => handleNumberInputChange('floor', e.target.value)}
                    placeholder="15"
                    required
                    className="h-12 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                  />
                </div>
                <div className="group">
                  <Label htmlFor="building_floor" className="text-sm font-semibold text-gray-800 mb-3 block flex items-center gap-2">
                    🏗️ 건물 총 층수
                    <div className="w-1 h-1 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </Label>
                  <Input
                    id="building_floor"
                    type="text"
                    value={formData.building_floor ? formatNumber(formData.building_floor) : ''}
                    onChange={(e) => handleNumberInputChange('building_floor', e.target.value)}
                    placeholder="20"
                    className="h-12 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 위치 정보 */}
          <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-50/50 to-orange-50/50 opacity-50"></div>
            <CardHeader className="pb-6 relative">
              <CardTitle className="flex items-center gap-4 text-2xl font-bold text-gray-900">
                <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                위치 정보
                <div className="ml-auto">
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                    <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-red-300 rounded-full"></div>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 relative">
              <div className="group">
                <Label htmlFor="address_road" className="text-sm font-semibold text-gray-800 mb-3 block flex items-center gap-2">
                  🗺️ 도로명 주소 
                  <span className="text-red-500">*</span>
                  <div className="w-1 h-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Label>
                <Input
                  id="address_road"
                  value={formData.address_road}
                  onChange={(e) => handleInputChange('address_road', e.target.value)}
                  placeholder="서울특별시 강남구 테헤란로 123"
                  required
                  className="h-12 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                />
              </div>

              <div className="group">
                <Label htmlFor="address_jibun" className="text-sm font-semibold text-gray-800 mb-3 block flex items-center gap-2">
                  📍 지번 주소
                  <div className="w-1 h-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Label>
                <Input
                  id="address_jibun"
                  value={formData.address_jibun}
                  onChange={(e) => handleInputChange('address_jibun', e.target.value)}
                  placeholder="서울특별시 강남구 역삼동 123-45"
                  className="h-12 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                />
              </div>

              <div className="group">
                <Label htmlFor="address_detail" className="text-sm font-semibold text-gray-800 mb-3 block flex items-center gap-2">
                  🏢 상세 주소
                  <div className="w-1 h-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Label>
                <Input
                  id="address_detail"
                  value={formData.address_detail}
                  onChange={(e) => handleInputChange('address_detail', e.target.value)}
                  placeholder="15층 1501호"
                  className="h-12 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group">
                  <Label htmlFor="latitude" className="text-sm font-semibold text-gray-800 mb-3 block flex items-center gap-2">
                    🌎 위도
                    <div className="w-1 h-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="0.000001"
                    value={formData.latitude}
                    onChange={(e) => handleInputChange('latitude', e.target.value)}
                    placeholder="37.4979"
                    className="h-12 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                  />
                </div>
                <div className="group">
                  <Label htmlFor="longitude" className="text-sm font-semibold text-gray-800 mb-3 block flex items-center gap-2">
                    🌍 경도
                    <div className="w-1 h-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="0.000001"
                    value={formData.longitude}
                    onChange={(e) => handleInputChange('longitude', e.target.value)}
                    placeholder="127.0276"
                    className="h-12 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 이미지 업로드 */}
          <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-50/50 to-yellow-50/50 opacity-50"></div>
            <CardHeader className="pb-6 relative">
              <CardTitle className="flex items-center gap-4 text-2xl font-bold text-gray-900">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                이미지 업로드
                <div className="ml-auto">
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
                    <div className="w-1 h-1 bg-orange-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-orange-300 rounded-full"></div>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <ImageUpload
                value={uploadedImages}
                onChange={handleImageUpload}
                onRemove={handleImageRemove}
                maxFiles={10}
              />
              {uploadingImages && (
                <div className="mt-6 flex items-center justify-center gap-3 p-4 bg-blue-50 rounded-xl">
                  <div className="w-5 h-5 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
                  <span className="text-sm text-blue-700 font-medium">이미지 업로드 중...</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 제출 버튼 */}
          <div className="flex justify-between items-center pt-12">
            <div className="text-sm text-gray-500">
              * 표시된 필드는 필수 입력 사항입니다
            </div>
            <div className="flex gap-4">
              <Link href="/admin">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="h-12 px-8 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200"
                >
                  취소
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={loading || uploadingImages}
                className="h-12 px-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>{uploadingImages ? "이미지 업로드 중..." : "등록 중..."}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="h-5 w-5" />
                    <span>매물 등록</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}