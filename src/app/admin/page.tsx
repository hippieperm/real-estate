"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Building2,
  MapPin,
  Eye,
  Filter
} from "lucide-react"
import { formatPrice, formatArea } from "@/lib/utils"
import Link from "next/link"

export default function AdminPage() {
  const [listings, setListings] = useState<any[]>([])
  const [filteredListings, setFilteredListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchListings()
  }, [])

  useEffect(() => {
    filterListings()
  }, [searchTerm, statusFilter, listings])

  const fetchListings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          limit: 100,
          sort_by: 'created_at'
        })
      })
      const data = await response.json()
      setListings(data.listings || [])
    } catch (error) {
      console.error('Failed to fetch listings:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterListings = () => {
    let filtered = listings

    // 검색어 필터링
    if (searchTerm) {
      filtered = filtered.filter(listing => 
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.address_road.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // 상태 필터링
    if (statusFilter !== "all") {
      filtered = filtered.filter(listing => listing.status === statusFilter)
    }

    setFilteredListings(filtered)
  }

  const deleteListing = async (id: string) => {
    if (!confirm('정말로 이 매물을 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`/api/listings/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('매물이 삭제되었습니다.')
        fetchListings()
      } else {
        alert('삭제에 실패했습니다.')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('삭제 중 오류가 발생했습니다.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">매물을 불러오는 중...</h3>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">매물 관리</h1>
              <p className="text-slate-600">등록된 매물을 관리하고 새로운 매물을 추가하세요</p>
            </div>
            <Link href="/admin/create">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-glow hover:shadow-lg transition-all duration-300">
                <Plus className="h-4 w-4 mr-2" />
                새 매물 등록
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-6 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="매물명, 주소로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {["all", "active", "inactive"].map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                    className="gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    {status === "all" ? "전체" : status === "active" ? "활성" : "비활성"}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">전체 매물</p>
                  <p className="text-3xl font-bold">{listings.length}</p>
                </div>
                <Building2 className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">활성 매물</p>
                  <p className="text-3xl font-bold">
                    {listings.filter(l => l.status === 'active').length}
                  </p>
                </div>
                <Eye className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">비활성 매물</p>
                  <p className="text-3xl font-bold">
                    {listings.filter(l => l.status === 'inactive').length}
                  </p>
                </div>
                <Building2 className="h-12 w-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <Card key={listing.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-white/90 backdrop-blur-sm">
              <div className="aspect-video bg-gradient-to-br from-slate-200 to-slate-300 relative overflow-hidden">
                <img
                  src={`https://via.placeholder.com/400x300/667eea/ffffff?text=${encodeURIComponent(listing.title.slice(0, 10))}`}
                  alt={listing.title}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3">
                  <Badge 
                    className={listing.status === 'active' 
                      ? "bg-green-500 text-white" 
                      : "bg-red-500 text-white"
                    }
                  >
                    {listing.status === 'active' ? '활성' : '비활성'}
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-lg line-clamp-2">{listing.title}</CardTitle>
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{listing.address_road}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="font-bold text-xl text-slate-800">
                    <span className="text-blue-600">{formatPrice(listing.price_deposit)}</span>
                    <span className="text-sm text-slate-500 ml-1">
                      {listing.price_deposit < 10000 ? '만원' : ''}
                    </span>
                  </div>
                  {listing.price_monthly && (
                    <div className="text-sm text-slate-600">
                      월세 {formatPrice(listing.price_monthly)}
                      {listing.price_monthly < 10000 ? '만원' : ''}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>전용 {formatArea(listing.exclusive_m2)}</span>
                  <span>{listing.floor}층</span>
                </div>

                <div className="flex gap-2 pt-4">
                  <Link href={`/admin/edit/${listing.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <Edit className="h-4 w-4" />
                      수정
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteListing(listing.id)}
                    className="flex-1 gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    삭제
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredListings.length === 0 && !loading && (
          <div className="text-center py-12">
            <Building2 className="h-24 w-24 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">매물이 없습니다</h3>
            <p className="text-slate-600 mb-6">새로운 매물을 등록해보세요</p>
            <Link href="/admin/create">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-glow hover:shadow-lg transition-all duration-300">
                <Plus className="h-4 w-4 mr-2" />
                매물 등록하기
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}