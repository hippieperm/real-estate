"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
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
  Upload,
  Loader
} from "lucide-react"
import Link from "next/link"

export default function EditListingPage() {
  const router = useRouter()
  const params = useParams()
  const listingId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])
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

  useEffect(() => {
    if (listingId) {
      fetchListing()
    }
  }, [listingId])

  const fetchListing = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/listings/${listingId}`)
      
      if (response.ok) {
        const data = await response.json()
        const listing = data.listing
        
        setFormData({
          title: listing.title || '',
          description: listing.description || '',
          property_type: listing.property_type || '',
          price_deposit: listing.price_deposit?.toString() || '',
          price_monthly: listing.price_monthly?.toString() || '',
          exclusive_m2: listing.exclusive_m2?.toString() || '',
          floor: listing.floor?.toString() || '',
          building_floor: listing.building_floor?.toString() || '',
          address_road: listing.address_road || '',
          address_jibun: listing.address_jibun || '',
          address_detail: listing.address_detail || '',
          latitude: listing.latitude?.toString() || '',
          longitude: listing.longitude?.toString() || '',
          status: listing.status || 'active'
        })
      } else {
        alert('매물을 찾을 수 없습니다.')
        router.push('/admin')
      }
    } catch (error) {
      console.error('Fetch error:', error)
      alert('매물 정보를 불러오는 중 오류가 발생했습니다.')
      router.push('/admin')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/listings/${listingId}`, {
        method: 'PUT',
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

      if (response.ok) {
        alert('매물이 성공적으로 수정되었습니다!')
        router.push('/admin')
      } else {
        const error = await response.json()
        alert(`수정에 실패했습니다: ${error.message}`)
      }
    } catch (error) {
      console.error('Update error:', error)
      alert('수정 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Loader className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">매물 정보를 불러오는 중...</h3>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                돌아가기
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">매물 수정</h1>
              <p className="text-slate-600">매물 정보를 수정하세요</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 기본 정보 */}
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                기본 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">매물명 *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="예: 강남역 프리미엄 오피스"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">매물 설명</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="매물에 대한 자세한 설명을 입력하세요"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="property_type">매물 유형 *</Label>
                <Select value={formData.property_type} onValueChange={(value) => handleInputChange('property_type', value)} required>
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
                <Label htmlFor="status">상태</Label>
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
            </CardContent>
          </Card>

          {/* 가격 정보 */}
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                가격 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price_deposit">보증금 (만원) *</Label>
                  <Input
                    id="price_deposit"
                    type="number"
                    value={formData.price_deposit}
                    onChange={(e) => handleInputChange('price_deposit', e.target.value)}
                    placeholder="10000"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price_monthly">월세 (만원)</Label>
                  <Input
                    id="price_monthly"
                    type="number"
                    value={formData.price_monthly}
                    onChange={(e) => handleInputChange('price_monthly', e.target.value)}
                    placeholder="300"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 면적 및 층수 */}
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Square className="h-5 w-5 text-purple-600" />
                면적 및 층수
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="exclusive_m2">전용면적 (㎡) *</Label>
                  <Input
                    id="exclusive_m2"
                    type="number"
                    step="0.01"
                    value={formData.exclusive_m2}
                    onChange={(e) => handleInputChange('exclusive_m2', e.target.value)}
                    placeholder="165.3"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="floor">해당 층 *</Label>
                  <Input
                    id="floor"
                    type="number"
                    value={formData.floor}
                    onChange={(e) => handleInputChange('floor', e.target.value)}
                    placeholder="15"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="building_floor">건물 총 층수</Label>
                  <Input
                    id="building_floor"
                    type="number"
                    value={formData.building_floor}
                    onChange={(e) => handleInputChange('building_floor', e.target.value)}
                    placeholder="20"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 위치 정보 */}
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-red-600" />
                위치 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address_road">도로명 주소 *</Label>
                <Input
                  id="address_road"
                  value={formData.address_road}
                  onChange={(e) => handleInputChange('address_road', e.target.value)}
                  placeholder="서울특별시 강남구 테헤란로 123"
                  required
                />
              </div>

              <div>
                <Label htmlFor="address_jibun">지번 주소</Label>
                <Input
                  id="address_jibun"
                  value={formData.address_jibun}
                  onChange={(e) => handleInputChange('address_jibun', e.target.value)}
                  placeholder="서울특별시 강남구 역삼동 123-45"
                />
              </div>

              <div>
                <Label htmlFor="address_detail">상세 주소</Label>
                <Input
                  id="address_detail"
                  value={formData.address_detail}
                  onChange={(e) => handleInputChange('address_detail', e.target.value)}
                  placeholder="15층 1501호"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude">위도</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="0.000001"
                    value={formData.latitude}
                    onChange={(e) => handleInputChange('latitude', e.target.value)}
                    placeholder="37.4979"
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">경도</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="0.000001"
                    value={formData.longitude}
                    onChange={(e) => handleInputChange('longitude', e.target.value)}
                    placeholder="127.0276"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 제출 버튼 */}
          <div className="flex justify-end gap-4">
            <Link href="/admin">
              <Button type="button" variant="outline">
                취소
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-glow hover:shadow-lg transition-all duration-300"
            >
              {saving ? (
                "수정 중..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  매물 수정
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}