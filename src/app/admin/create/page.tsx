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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline" size="sm" className="gap-2 border-gray-400 text-gray-800 bg-white hover:bg-gray-100 font-medium shadow-sm">
                <ArrowLeft className="h-4 w-4" />
                돌아가기
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">새 매물 등록</h1>
              <p className="text-gray-600">매물 정보를 입력하여 새로운 매물을 등록하세요</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 기본 정보 */}
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                기본 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title" className="text-sm font-medium text-gray-900 mb-2 block">매물명 *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="예: 강남역 프리미엄 오피스"
                  required
                  className="border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-900 mb-2 block">매물 설명</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="매물에 대한 자세한 설명을 입력하세요"
                  rows={4}
                  className="border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="property_type" className="text-sm font-medium text-gray-900 mb-2 block">매물 유형 *</Label>
                  <Select onValueChange={(value) => handleInputChange('property_type', value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="매물 유형을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="office">사무실</SelectItem>
                      <SelectItem value="retail">상가</SelectItem>
                      <SelectItem value="building">통건물</SelectItem>
                      <SelectItem value="residential">주택형</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status" className="text-sm font-medium text-gray-900 mb-2 block">상태</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">활성</SelectItem>
                      <SelectItem value="inactive">비활성</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 가격 정보 */}
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                가격 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="price_deposit" className="text-sm font-medium text-gray-900 mb-2 block">보증금 (만원) *</Label>
                  <Input
                    id="price_deposit"
                    type="number"
                    value={formData.price_deposit}
                    onChange={(e) => handleInputChange('price_deposit', e.target.value)}
                    placeholder="10000"
                    required
                    className="border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="price_monthly" className="text-sm font-medium text-gray-900 mb-2 block">월세 (만원)</Label>
                  <Input
                    id="price_monthly"
                    type="number"
                    value={formData.price_monthly}
                    onChange={(e) => handleInputChange('price_monthly', e.target.value)}
                    placeholder="300"
                    className="border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 면적 및 층수 */}
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Square className="h-5 w-5 text-purple-600" />
                </div>
                면적 및 층수
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="exclusive_m2" className="text-sm font-medium text-gray-900 mb-2 block">전용면적 (㎡) *</Label>
                  <Input
                    id="exclusive_m2"
                    type="number"
                    step="0.01"
                    value={formData.exclusive_m2}
                    onChange={(e) => handleInputChange('exclusive_m2', e.target.value)}
                    placeholder="165.3"
                    required
                    className="border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="floor" className="text-sm font-medium text-gray-900 mb-2 block">해당 층 *</Label>
                  <Input
                    id="floor"
                    type="number"
                    value={formData.floor}
                    onChange={(e) => handleInputChange('floor', e.target.value)}
                    placeholder="15"
                    required
                    className="border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="building_floor" className="text-sm font-medium text-gray-900 mb-2 block">건물 총 층수</Label>
                  <Input
                    id="building_floor"
                    type="number"
                    value={formData.building_floor}
                    onChange={(e) => handleInputChange('building_floor', e.target.value)}
                    placeholder="20"
                    className="border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 위치 정보 */}
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
                <div className="p-2 bg-red-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-red-600" />
                </div>
                위치 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="address_road" className="text-sm font-medium text-gray-900 mb-2 block">도로명 주소 *</Label>
                <Input
                  id="address_road"
                  value={formData.address_road}
                  onChange={(e) => handleInputChange('address_road', e.target.value)}
                  placeholder="서울특별시 강남구 테헤란로 123"
                  required
                  className="border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <Label htmlFor="address_jibun" className="text-sm font-medium text-gray-900 mb-2 block">지번 주소</Label>
                <Input
                  id="address_jibun"
                  value={formData.address_jibun}
                  onChange={(e) => handleInputChange('address_jibun', e.target.value)}
                  placeholder="서울특별시 강남구 역삼동 123-45"
                  className="border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <Label htmlFor="address_detail" className="text-sm font-medium text-gray-900 mb-2 block">상세 주소</Label>
                <Input
                  id="address_detail"
                  value={formData.address_detail}
                  onChange={(e) => handleInputChange('address_detail', e.target.value)}
                  placeholder="15층 1501호"
                  className="border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="latitude" className="text-sm font-medium text-gray-900 mb-2 block">위도</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="0.000001"
                    value={formData.latitude}
                    onChange={(e) => handleInputChange('latitude', e.target.value)}
                    placeholder="37.4979"
                    className="border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="longitude" className="text-sm font-medium text-gray-900 mb-2 block">경도</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="0.000001"
                    value={formData.longitude}
                    onChange={(e) => handleInputChange('longitude', e.target.value)}
                    placeholder="127.0276"
                    className="border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 이미지 업로드 */}
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Upload className="h-5 w-5 text-orange-600" />
                </div>
                이미지 업로드
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={uploadedImages}
                onChange={handleImageUpload}
                onRemove={handleImageRemove}
                maxFiles={10}
              />
              {uploadingImages && (
                <div className="mt-4 text-center text-sm text-blue-600 font-medium">
                  이미지 업로드 중...
                </div>
              )}
            </CardContent>
          </Card>

          {/* 제출 버튼 */}
          <div className="flex justify-end gap-4 pt-6">
            <Link href="/admin">
              <Button type="button" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                취소
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={loading || uploadingImages}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {uploadingImages ? "이미지 업로드 중..." : "등록 중..."}
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  매물 등록
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}