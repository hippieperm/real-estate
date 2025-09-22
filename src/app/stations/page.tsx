import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Train, ArrowRight } from "lucide-react"
import { createServerComponentClient } from "@/lib/supabase-server"

async function getStationsWithListings() {
  const supabase = await createServerComponentClient()

  const { data: stations } = await supabase
    .from('stations')
    .select(`
      *,
      listing_stations(
        listing_id,
        listings!inner(status)
      )
    `)
    .order('name')

  return stations?.map(station => ({
    ...station,
    listing_count: station.listing_stations?.filter((ls: any) =>
      ls.listings.status === 'active'
    ).length || 0
  })) || []
}

const lineColors: Record<string, string> = {
  '1호선': 'bg-blue-600',
  '2호선': 'bg-green-600',
  '3호선': 'bg-orange-600',
  '4호선': 'bg-blue-800',
  '5호선': 'bg-purple-600',
  '6호선': 'bg-yellow-600',
  '7호선': 'bg-emerald-600',
  '8호선': 'bg-pink-600',
  '9호선': 'bg-amber-600',
}

export default async function StationsPage() {
  const stations = await getStationsWithListings()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-4">지하철역별 매물 검색</h1>
          <p className="text-gray-600">
            원하는 지하철역을 선택하여 역세권 매물을 찾아보세요
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {stations.map((station) => (
            <Link
              key={station.id}
              href={`/list?stations=${station.id}`}
              className="group"
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Train className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-lg">{station.name}역</CardTitle>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Badge
                      className={`text-white ${lineColors[station.line] || 'bg-gray-600'}`}
                    >
                      {station.line}
                    </Badge>

                    <div className="text-sm text-gray-600">
                      <span className="font-semibold text-primary">
                        {station.listing_count}개
                      </span>
                      의 매물
                    </div>

                    <div className="text-xs text-gray-500">
                      도보 10분 내 역세권 매물
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {stations.length === 0 && (
          <div className="text-center py-12">
            <Train className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">등록된 지하철역이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  )
}