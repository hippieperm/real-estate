"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  X, 
  Heart, 
  Share2, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Building2, 
  Square, 
  Calendar,
  Eye,
  Wifi,
  Car,
  Camera,
  ChevronLeft,
  ChevronRight,
  Star,
  User,
  CheckCircle,
  Coffee,
  TreePine,
  Sun,
  Zap
} from "lucide-react"
import { formatPrice, formatArea } from "@/lib/utils"

interface ListingDetailModalProps {
  listing: any
  isOpen: boolean
  onClose: () => void
}

const sampleImages = [
  "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1571624436279-b272aff752b5?w=800&h=600&fit=crop", 
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
]

const amenities = [
  { icon: Wifi, label: "와이파이", available: true },
  { icon: Car, label: "주차 가능", available: true },
  { icon: Building2, label: "엘리베이터", available: true },
  { icon: Coffee, label: "카페 근처", available: true },
  { icon: TreePine, label: "공원 인접", available: false },
  { icon: Sun, label: "채광 우수", available: true },
  { icon: Zap, label: "고속 인터넷", available: true },
]

export function ListingDetailModal({ listing, isOpen, onClose }: ListingDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  if (!isOpen || !listing) return null

  // 실제 이미지가 있으면 사용하고, 없으면 더미 이미지 사용
  const images = listing.listing_images && listing.listing_images.length > 0 
    ? listing.listing_images.map((img: any) => img.path)
    : sampleImages

  console.log('Images debug:', {
    hasListingImages: listing.listing_images && listing.listing_images.length > 0,
    listingImagesLength: listing.listing_images?.length,
    finalImagesLength: images.length,
    showNavigation: images.length > 1
  })

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsFavorite(!isFavorite)}
            className="bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg"
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-600'}`} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg"
          >
            <Share2 className="h-5 w-5 text-slate-600" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            className="bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg"
          >
            <X className="h-5 w-5 text-slate-600" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* Image Gallery */}
          <div className="relative bg-slate-100">
            <img
              src={images[currentImageIndex]}
              alt={listing.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = sampleImages[0]; // 에러 시 첫 번째 더미 이미지로 대체
              }}
            />
            
            {/* Image Navigation */}
            {images.length > 1 && (
              <>
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-slate-700 rounded-full shadow-lg border border-slate-200 z-20 w-12 h-12 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105"
                     onClick={prevImage}>
                  <ChevronLeft className="h-5 w-5" />
                </div>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-slate-700 rounded-full shadow-lg border border-slate-200 z-20 w-12 h-12 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105"
                     onClick={nextImage}>
                  <ChevronRight className="h-5 w-5" />
                </div>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
              <Camera className="h-4 w-4" />
              {currentImageIndex + 1} / {images.length}
            </div>

            {/* Property Status Badge */}
            <div className="absolute top-4 left-4">
              <Badge className="bg-green-500 text-white">
                임대 가능
              </Badge>
            </div>
          </div>

          {/* Details Panel */}
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Title & Basic Info */}
                <div className="space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">
                      {listing.title}
                    </h1>
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="h-4 w-4" />
                      <span>{listing.address_road}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold text-slate-900">
                          {formatPrice(listing.price_deposit)}만원
                        </div>
                        {listing.price_monthly && (
                          <div className="text-lg text-slate-600">
                            월 {formatPrice(listing.price_monthly)}만원
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-500">전용면적</div>
                        <div className="text-xl font-semibold text-slate-800">
                          {formatArea(listing.exclusive_m2)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="p-4 text-center bg-gradient-to-b from-blue-50 to-blue-100 border-blue-200">
                      <Square className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                      <div className="text-sm text-blue-700">전용면적</div>
                      <div className="font-semibold text-slate-800">{formatArea(listing.exclusive_m2)}</div>
                    </Card>
                    <Card className="p-4 text-center bg-gradient-to-b from-green-50 to-green-100 border-green-200">
                      <Building2 className="h-6 w-6 text-green-600 mx-auto mb-2" />
                      <div className="text-sm text-green-700">층수</div>
                      <div className="font-semibold text-slate-800">{listing.floor}층</div>
                    </Card>
                    <Card className="p-4 text-center bg-gradient-to-b from-purple-50 to-purple-100 border-purple-200">
                      <Calendar className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                      <div className="text-sm text-purple-700">준공년도</div>
                      <div className="font-semibold text-slate-800">2018년</div>
                    </Card>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-slate-200">
                  <div className="flex space-x-8">
                    {[
                      { id: "overview", label: "개요" },
                      { id: "amenities", label: "편의시설" },
                      { id: "location", label: "위치정보" }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                          activeTab === tab.id
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div>
                  {activeTab === "overview" && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-2">매물 설명</h3>
                        <p className="text-slate-600 leading-relaxed">
                          교통이 편리한 역세권에 위치한 깨끗하고 모던한 사무공간입니다. 
                          최신 시설과 쾌적한 환경으로 업무 효율성을 극대화할 수 있습니다. 
                          주변에 다양한 편의시설이 있어 직원들의 만족도가 높습니다.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-3">주요 특징</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            "역세권 위치 (도보 3분)",
                            "최신 인테리어",
                            "개별 에어컨",
                            "보안 시설 완비",
                            "승강기 2대",
                            "주차 가능 (유료)"
                          ].map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-slate-600">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "amenities" && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-slate-900">편의시설</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {amenities.map((amenity, index) => {
                          const Icon = amenity.icon
                          return (
                            <div
                              key={index}
                              className={`flex items-center gap-3 p-3 rounded-lg ${
                                amenity.available
                                  ? "bg-green-50 text-green-700"
                                  : "bg-slate-50 text-slate-400"
                              }`}
                            >
                              <Icon className="h-5 w-5" />
                              <span className="text-sm font-medium">{amenity.label}</span>
                              {amenity.available && (
                                <CheckCircle className="h-4 w-4 ml-auto" />
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {activeTab === "location" && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-slate-900">위치 정보</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <span className="text-slate-600">지하철역</span>
                          <span className="font-medium">강남역 도보 5분</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <span className="text-slate-600">버스정류장</span>
                          <span className="font-medium">도보 2분</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <span className="text-slate-600">주요 시설</span>
                          <span className="font-medium">백화점, 은행, 카페</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Agent Info */}
                <Card className="p-4 bg-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900">김부동산 공인중개사</div>
                      <div className="text-sm text-slate-600">전문 상업용 부동산</div>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="text-sm text-slate-500 ml-1">(4.9)</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="border-t border-slate-200 p-6 bg-white">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-12 gap-2 bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300"
                >
                  <Phone className="h-4 w-4" />
                  전화 문의
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 h-12 gap-2 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300"
                >
                  <MessageSquare className="h-4 w-4" />
                  메시지
                </Button>
                <Button
                  className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                >
                  상담 신청
                </Button>
              </div>
              
              {/* View Stats */}
              <div className="flex items-center justify-center gap-4 mt-4 text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  조회 {Math.floor(Math.random() * 500) + 100}
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  찜 {Math.floor(Math.random() * 50) + 10}
                </div>
                <div className="text-slate-400">•</div>
                <div>오늘 업데이트</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}