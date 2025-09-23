import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Search, FileText, ArrowRight, Building, Train, MapIcon } from "lucide-react"
import { createServerComponentClient } from "@/lib/supabase-server"
import { formatPrice, formatArea } from "@/lib/utils"

const themeData = [
  { key: "below_market", label: "#시세이하", color: "gradient-purple text-white shadow-glow" },
  { key: "ground_retail", label: "#1층/리테일", color: "gradient-blue text-white shadow-glow" },
  { key: "prime_office", label: "#프라임 오피스", color: "gradient-ocean text-white shadow-glow" },
  { key: "interior", label: "#인테리어", color: "bg-emerald-500 text-white shadow-glow" },
  { key: "whole_building", label: "#통건물", color: "bg-amber-500 text-white shadow-glow" },
  { key: "academy_hospital", label: "#학원/병원", color: "bg-pink-500 text-white shadow-glow" },
  { key: "basement_studio", label: "#지하/스튜디오", color: "bg-slate-500 text-white shadow-glow" },
  { key: "residential_office", label: "#주택형 사무실", color: "bg-indigo-500 text-white shadow-glow" },
  { key: "main_road", label: "#대로변", color: "bg-orange-500 text-white shadow-glow" },
  { key: "station_area", label: "#역세권", color: "bg-teal-500 text-white shadow-glow" },
  { key: "terrace", label: "#테라스", color: "bg-lime-500 text-white shadow-glow" },
  { key: "new_first", label: "#신축 첫임대", color: "bg-cyan-500 text-white shadow-glow" },
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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 gradient-mesh opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-blue-50/80 to-indigo-100/90"></div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-400/20 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-pink-400/20 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              <span className="text-gradient bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                프라임 오피스
              </span>
              <br />
              <span className="text-slate-800">& 상가 임대</span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-xl md:text-2xl text-slate-600 leading-relaxed">
              강남·역삼·서초 지역 <span className="font-semibold text-blue-600">최고의 사무실</span>과
              <span className="font-semibold text-purple-600"> 상가</span>를 찾아보세요
            </p>

            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-in-left" style={{ animationDelay: '0.3s' }}>
              <Link href="/map">
                <Button size="lg" className="group w-full sm:w-auto h-14 px-8 gradient-blue text-white border-0 shadow-glow hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <MapPin className="mr-3 h-5 w-5 transition-transform group-hover:scale-110" />
                  지도검색
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/list">
                <Button size="lg" variant="outline" className="group w-full sm:w-auto h-14 px-8 bg-white/90 backdrop-blur-md border-white/50 hover:bg-white/95 text-slate-700 hover:text-blue-600 transition-all duration-300 hover:scale-105 shadow-lg">
                  <Search className="mr-3 h-5 w-5 transition-transform group-hover:scale-110" />
                  목록검색
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/inquiry">
                <Button size="lg" variant="outline" className="group w-full sm:w-auto h-14 px-8 bg-white/90 backdrop-blur-md border-white/50 hover:bg-white/95 text-slate-700 hover:text-blue-600 transition-all duration-300 hover:scale-105 shadow-lg">
                  <FileText className="mr-3 h-5 w-5 transition-transform group-hover:scale-110" />
                  임대·임차 의뢰
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto animate-slide-in-right" style={{ animationDelay: '0.6s' }}>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">500+</div>
                <div className="text-sm text-slate-600 mt-1">프라임 매물</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">50+</div>
                <div className="text-sm text-slate-600 mt-1">역세권</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">24h</div>
                <div className="text-sm text-slate-600 mt-1">빠른 응답</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-slate-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              빠른 <span className="text-blue-600">매물 검색</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              원하는 방식으로 매물을 찾아보세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/stations" className="group animate-slide-in-left">
              <Card className="relative overflow-hidden h-full shadow-card hover:shadow-card-hover transition-all duration-500 hover:scale-105 glass border-white/50">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardHeader className="relative">
                  <div className="relative">
                    <Train className="h-12 w-12 text-blue-600 mb-4 transition-transform group-hover:scale-110 duration-300" />
                    <div className="absolute -inset-2 bg-blue-500/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">지하철역별 검색</CardTitle>
                  <CardDescription className="text-slate-600">역세권 매물을 빠르게 찾아보세요</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    바로가기 <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/regions" className="group animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
              <Card className="relative overflow-hidden h-full shadow-card hover:shadow-card-hover transition-all duration-500 hover:scale-105 glass border-white/50">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardHeader className="relative">
                  <div className="relative">
                    <MapIcon className="h-12 w-12 text-purple-600 mb-4 transition-transform group-hover:scale-110 duration-300" />
                    <div className="absolute -inset-2 bg-purple-500/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-purple-600 transition-colors">지역별 검색</CardTitle>
                  <CardDescription className="text-slate-600">동 단위로 매물을 검색하세요</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-purple-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    바로가기 <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/inquiry" className="group animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
              <Card className="relative overflow-hidden h-full shadow-card hover:shadow-card-hover transition-all duration-500 hover:scale-105 glass border-white/50">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardHeader className="relative">
                  <div className="relative">
                    <Building className="h-12 w-12 text-emerald-600 mb-4 transition-transform group-hover:scale-110 duration-300" />
                    <div className="absolute -inset-2 bg-emerald-500/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-emerald-600 transition-colors">맞춤 매물 추천</CardTitle>
                  <CardDescription className="text-slate-600">전문가가 직접 매물을 찾아드립니다</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-emerald-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    의뢰하기 <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Theme Tags */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              <span className="text-purple-600">테마별</span> 매물
            </h2>
            <p className="text-xl text-slate-600">원하는 특성의 매물을 빠르게 찾아보세요</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 animate-slide-in-left">
            {themeData.map((theme, index) => (
              <Link key={theme.key} href={`/themes/${theme.key}`}>
                <Badge
                  className={`text-sm py-3 px-6 cursor-pointer transition-all duration-300 hover:scale-105 border-0 ${theme.color}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {theme.label}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              <span className="text-emerald-600">최신</span> 매물
            </h2>
            <p className="text-xl text-slate-600">방금 등록된 프라임 매물을 확인하세요</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredListings.slice(0, 8).map((listing: any, index: number) => (
              <Link key={listing.id} href={`/listing/${listing.id}`}>
                <Card className="group relative overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 hover:scale-105 glass border-white/50 h-full animate-scale-in"
                      style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="aspect-video bg-gradient-to-br from-slate-200 to-slate-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <img
                      src={`https://via.placeholder.com/400x300/667eea/ffffff?text=${encodeURIComponent(listing.title.slice(0, 10))}`}
                      alt={listing.title}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                    {listing.listing_themes?.length > 0 && (
                      <div className="absolute top-3 left-3">
                        <Badge className="gradient-blue text-white border-0 shadow-glow">
                          {listing.listing_themes[0].theme_categories.label_ko}
                        </Badge>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <ArrowRight className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {listing.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="font-bold text-xl text-slate-800">
                      <span className="text-blue-600">{formatPrice(listing.price_deposit)}</span>
                      <span className="text-sm text-slate-500 ml-1">만원</span>
                      {listing.price_monthly && (
                        <div className="text-sm text-slate-600 font-normal">
                          월세 {formatPrice(listing.price_monthly)}만원
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>전용 {formatArea(listing.exclusive_m2)}</span>
                      <span>{listing.floor}층</span>
                    </div>
                    <div className="text-sm text-slate-500 line-clamp-1">
                      {listing.address_road}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-16 text-center animate-fade-in">
            <Link href="/list">
              <Button size="lg" className="gradient-ocean text-white border-0 shadow-glow hover:shadow-lg transition-all duration-300 hover:scale-105 px-8 h-14">
                더 많은 매물 보기 <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Area-based Listings */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              <span className="text-indigo-600">평형별</span> 최신 매물
            </h2>
            <p className="text-xl text-slate-600">원하시는 면적의 매물을 찾아보세요</p>
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