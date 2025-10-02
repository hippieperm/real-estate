import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice, formatArea } from "@/lib/utils"
import { createServerComponentClient } from "@/lib/supabase-server"
import {
  MapPin,
  Train,
  Building,
  Calendar,
  Phone,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  MessageSquare
} from "lucide-react"
import Link from "next/link"
import ImageGallery from "@/components/listing/ImageGallery"
import InquiryModal from "@/components/listing/InquiryModal"

interface Props {
  params: {
    id: string
  }
}

async function getListing(id: string) {
  const supabase = await createServerComponentClient()

  const { data: listing, error } = await supabase
    .from('listings')
    .select(`
      *,
      listing_images(path, sort_order),
      listing_stations(
        station_id,
        distance_m,
        stations(name, line)
      ),
      listing_regions(
        region_id,
        regions(sido, sigungu, dong)
      ),
      listing_themes(
        theme_id,
        theme_categories(key, label_ko)
      ),
      profiles:created_by(
        name,
        phone,
        company
      )
    `)
    .eq('id', id)
    .eq('status', 'active')
    .single()

  if (error || !listing) {
    return null
  }

  return listing
}

async function getSimilarListings(listing: any) {
  const supabase = await createServerComponentClient()

  const { data } = await supabase
    .from('listings')
    .select(`
      *,
      listing_images(path, sort_order)
    `)
    .eq('status', 'active')
    .eq('property_type', listing.property_type)
    .neq('id', listing.id)
    .gte('pyeong_exclusive', listing.pyeong_exclusive * 0.7)
    .lte('pyeong_exclusive', listing.pyeong_exclusive * 1.3)
    .limit(4)

  return data || []
}

export default async function ListingDetailPage({ params }: Props) {
  const listing = await getListing(params.id)

  if (!listing) {
    notFound()
  }

  const similarListings = await getSimilarListings(listing)

  const images = listing.listing_images
    ?.sort((a: any, b: any) => a.sort_order - b.sort_order)
    .map((img: any) => img.path) || []

  const nearbyStations = listing.listing_stations
    ?.sort((a: any, b: any) => a.distance_m - b.distance_m)
    .slice(0, 3) || []

  const themes = listing.listing_themes?.map((lt: any) => lt.theme_categories) || []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Image Gallery */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto">
          <ImageGallery images={images} title={listing.title} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Price */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{listing.title}</CardTitle>
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <MapPin className="h-4 w-4" />
                      <span>{listing.address_road}</span>
                    </div>
                    {themes.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {themes.map((theme: any) => (
                          <Badge key={theme.key} variant="outline">
                            {theme.label_ko}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="outline">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-3xl font-bold text-primary">
                  보증금 {formatPrice(listing.price_deposit)}만원
                  {listing.price_monthly && (
                    <div className="text-xl mt-1">
                      월세 {formatPrice(listing.price_monthly)}만원
                    </div>
                  )}
                </div>
              </CardHeader>
            </Card>

            {/* Property Details */}
            <Card>
              <CardHeader>
                <CardTitle>매물 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">전용면적</p>
                    <p className="font-semibold">{formatArea(listing.exclusive_m2)}</p>
                    <p className="text-xs text-gray-500">{listing.exclusive_m2?.toFixed(1)}㎡</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">공급면적</p>
                    <p className="font-semibold">{formatArea(listing.supply_m2)}</p>
                    <p className="text-xs text-gray-500">{listing.supply_m2?.toFixed(1)}㎡</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">층수</p>
                    <p className="font-semibold">{listing.floor}층</p>
                    <p className="text-xs text-gray-500">총 {listing.floors_total}층</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">매물 유형</p>
                    <p className="font-semibold">
                      {listing.property_type === 'office' && '사무실'}
                      {listing.property_type === 'retail' && '상가'}
                      {listing.property_type === 'whole_building' && '통건물'}
                      {listing.property_type === 'residential' && '주택형'}
                    </p>
                  </div>
                  {listing.price_maintenance && (
                    <div>
                      <p className="text-sm text-gray-600">관리비</p>
                      <p className="font-semibold">{formatPrice(listing.price_maintenance / 10000)}만원</p>
                      <p className="text-xs text-gray-500">월</p>
                    </div>
                  )}
                  {listing.built_year && (
                    <div>
                      <p className="text-sm text-gray-600">준공년도</p>
                      <p className="font-semibold">{listing.built_year}년</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">대로변</p>
                    <p className="font-semibold">{listing.near_boulevard ? '예' : '아니오'}</p>
                  </div>
                </div>

                {listing.tags && listing.tags.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm text-gray-600 mb-2">특징</p>
                    <div className="flex flex-wrap gap-2">
                      {listing.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Description */}
            {listing.description && (
              <Card>
                <CardHeader>
                  <CardTitle>상세 설명</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-gray-700">
                    {listing.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Location Info */}
            <Card>
              <CardHeader>
                <CardTitle>위치 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold mb-2">주소</p>
                    <p>{listing.address_road}</p>
                    {listing.address_jibun && (
                      <p className="text-sm text-gray-600">{listing.address_jibun}</p>
                    )}
                  </div>

                  {nearbyStations.length > 0 && (
                    <div>
                      <p className="font-semibold mb-2">인근 지하철역</p>
                      <div className="space-y-2">
                        {nearbyStations.map((ls: any) => (
                          <div key={ls.station_id} className="flex items-center gap-2">
                            <Train className="h-4 w-4 text-blue-600" />
                            <span>{ls.stations.name}역</span>
                            <Badge variant="outline" className="text-xs">
                              {ls.stations.line}
                            </Badge>
                            <span className="text-sm text-gray-600">
                              도보 {Math.round(ls.distance_m / 80)}분 ({ls.distance_m}m)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Map placeholder */}
                <div className="mt-4 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">지도 표시 영역</p>
                </div>
              </CardContent>
            </Card>

            {/* Similar Listings */}
            {similarListings.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>유사한 매물</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {similarListings.map((similar: any) => (
                      <Link key={similar.id} href={`/listing/${similar.id}`}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                          <div className="aspect-video bg-gray-200">
                            {similar.images && similar.images.length > 0 ? (
                              <img
                                src={similar.images[0].path}
                                alt={similar.title}
                                className="object-cover w-full h-full rounded-t-lg"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Building className="h-10 w-10 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <CardContent className="p-3">
                            <p className="font-semibold line-clamp-1">{similar.title}</p>
                            <p className="font-semibold text-primary">
                              {formatPrice(similar.price_deposit)}만원
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatArea(similar.exclusive_m2)}
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>문의하기</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {listing.profiles && (
                  <div>
                    <p className="font-semibold">{listing.profiles.name}</p>
                    {listing.profiles.company && (
                      <p className="text-sm text-gray-600">{listing.profiles.company}</p>
                    )}
                    {listing.profiles.phone && (
                      <div className="flex items-center gap-2 mt-2">
                        <Phone className="h-4 w-4" />
                        <span>{listing.profiles.phone}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Button className="w-full" size="lg">
                    <Phone className="mr-2 h-4 w-4" />
                    전화 문의
                  </Button>
                  <InquiryModal listingId={listing.id} listingTitle={listing.title}>
                    <Button variant="outline" className="w-full" size="lg">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      문자 문의
                    </Button>
                  </InquiryModal>
                </div>

                <div className="text-xs text-gray-500 space-y-1">
                  <p>매물번호: {listing.code}</p>
                  <p>등록일: {new Date(listing.created_at).toLocaleDateString('ko-KR')}</p>
                  <p>수정일: {new Date(listing.updated_at).toLocaleDateString('ko-KR')}</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>빠른 메뉴</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/map" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <MapPin className="mr-2 h-4 w-4" />
                    지도에서 주변 매물 보기
                  </Button>
                </Link>
                <Link href="/list" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Building className="mr-2 h-4 w-4" />
                    유사한 매물 더 보기
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}