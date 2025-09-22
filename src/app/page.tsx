import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Search, FileText, ArrowRight, Building, Train, MapIcon } from "lucide-react"
import { createServerComponentClient } from "@/lib/supabase-server"
import { formatPrice, formatArea } from "@/lib/utils"

const themeData = [
  { key: "below_market", label: "#시세이하", color: "bg-red-100 text-red-800" },
  { key: "ground_retail", label: "#1층/리테일", color: "bg-blue-100 text-blue-800" },
  { key: "prime_office", label: "#프라임 오피스", color: "bg-purple-100 text-purple-800" },
  { key: "interior", label: "#인테리어", color: "bg-green-100 text-green-800" },
  { key: "whole_building", label: "#통건물", color: "bg-yellow-100 text-yellow-800" },
  { key: "academy_hospital", label: "#학원/병원", color: "bg-pink-100 text-pink-800" },
  { key: "basement_studio", label: "#지하/스튜디오", color: "bg-gray-100 text-gray-800" },
  { key: "residential_office", label: "#주택형 사무실", color: "bg-indigo-100 text-indigo-800" },
  { key: "main_road", label: "#대로변", color: "bg-orange-100 text-orange-800" },
  { key: "station_area", label: "#역세권", color: "bg-teal-100 text-teal-800" },
  { key: "terrace", label: "#테라스", color: "bg-lime-100 text-lime-800" },
  { key: "new_first", label: "#신축 첫임대", color: "bg-cyan-100 text-cyan-800" },
]

const areaCategories = [
  { label: "전체", min: 0, max: 999999 },
  { label: "50평 미만", min: 0, max: 50 },
  { label: "50-100평", min: 50, max: 100 },
  { label: "100-200평", min: 100, max: 200 },
  { label: "200평 이상", min: 200, max: 999999 },
]

async function getFeaturedListings() {
  const supabase = await createServerComponentClient()

  const { data: listings } = await supabase
    .from('listings')
    .select(`
      *,
      listing_images(path, sort_order),
      listing_themes(
        theme_id,
        theme_categories(key, label_ko)
      )
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(12)

  return listings || []
}

async function getListingsByArea(minPyeong: number, maxPyeong: number) {
  const supabase = await createServerComponentClient()

  const { data: listings } = await supabase
    .from('listings')
    .select(`
      *,
      listing_images(path, sort_order)
    `)
    .eq('status', 'active')
    .gte('pyeong_exclusive', minPyeong)
    .lte('pyeong_exclusive', maxPyeong)
    .order('created_at', { ascending: false })
    .limit(6)

  return listings || []
}

export default async function HomePage() {
  const featuredListings = await getFeaturedListings()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              프라임 오피스 & 상가 임대
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-600 sm:mt-5">
              강남·역삼·서초 지역 최고의 사무실과 상가를 찾아보세요
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/map">
                <Button size="lg" className="w-full sm:w-auto">
                  <MapPin className="mr-2" />
                  지도검색
                </Button>
              </Link>
              <Link href="/list">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <Search className="mr-2" />
                  목록검색
                </Button>
              </Link>
              <Link href="/inquiry">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <FileText className="mr-2" />
                  임대·임차 의뢰
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/stations" className="group">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <Train className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>지하철역별 검색</CardTitle>
                  <CardDescription>역세권 매물을 빠르게 찾아보세요</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-primary group-hover:underline">
                    바로가기 <ArrowRight className="inline h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>

            <Link href="/regions" className="group">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <MapIcon className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>지역별 검색</CardTitle>
                  <CardDescription>동 단위로 매물을 검색하세요</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-primary group-hover:underline">
                    바로가기 <ArrowRight className="inline h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>

            <Link href="/inquiry" className="group">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <Building className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>맞춤 매물 추천</CardTitle>
                  <CardDescription>전문가가 직접 매물을 찾아드립니다</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-primary group-hover:underline">
                    의뢰하기 <ArrowRight className="inline h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Theme Tags */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">테마별 매물</h2>
          <div className="flex flex-wrap gap-2">
            {themeData.map((theme) => (
              <Link key={theme.key} href={`/themes/${theme.key}`}>
                <Badge variant="outline" className={`text-sm py-2 px-4 cursor-pointer hover:shadow-md transition-shadow ${theme.color}`}>
                  {theme.label}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">최신 매물</h2>
            <p className="text-gray-600 mt-2">방금 등록된 프라임 매물을 확인하세요</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredListings.slice(0, 8).map((listing: any) => (
              <Link key={listing.id} href={`/listing/${listing.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <div className="aspect-video bg-gray-200 relative overflow-hidden">
                    {listing.listing_images?.[0] && (
                      <img
                        src={`https://via.placeholder.com/400x300`}
                        alt={listing.title}
                        className="object-cover w-full h-full"
                      />
                    )}
                    {listing.listing_themes?.length > 0 && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-primary text-white">
                          {listing.listing_themes[0].theme_categories.label_ko}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-1">{listing.title}</CardTitle>
                    <CardDescription className="space-y-1">
                      <div className="font-semibold text-lg text-black">
                        보증금 {formatPrice(listing.price_deposit)}만원
                        {listing.price_monthly && ` / 월 ${formatPrice(listing.price_monthly)}만원`}
                      </div>
                      <div className="text-sm">
                        전용 {formatArea(listing.exclusive_m2)} · {listing.floor}층
                      </div>
                      <div className="text-sm text-gray-500">
                        {listing.address_road}
                      </div>
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/list">
              <Button variant="outline" size="lg">
                더 많은 매물 보기 <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Area-based Listings */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">평형별 최신 매물</h2>
            <p className="text-gray-600 mt-2">원하시는 면적의 매물을 찾아보세요</p>
          </div>

          <div className="space-y-8">
            {areaCategories.map(async (category) => {
              const listings = await getListingsByArea(category.min, category.max)

              if (listings.length === 0) return null

              return (
                <div key={category.label}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{category.label}</h3>
                    <Link href={`/list?min_pyeong=${category.min}&max_pyeong=${category.max}`}>
                      <Button variant="ghost" size="sm">
                        전체보기 <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {listings.map((listing: any) => (
                      <Link key={listing.id} href={`/listing/${listing.id}`}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                          <div className="aspect-square bg-gray-200 relative overflow-hidden">
                            <img
                              src={`https://via.placeholder.com/200x200`}
                              alt={listing.title}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <CardContent className="p-3">
                            <p className="font-semibold text-sm line-clamp-1">{listing.title}</p>
                            <p className="text-xs text-gray-600 mt-1">
                              {formatArea(listing.exclusive_m2)}
                            </p>
                            <p className="text-sm font-semibold mt-1">
                              {formatPrice(listing.price_deposit)}만원
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}