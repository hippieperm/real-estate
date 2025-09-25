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
import { NotificationModal, useNotificationModal } from "@/components/ui/notification-modal"

export default function AdminPage() {
  const { modal, closeModal, showSuccess, showError, showWarning } = useNotificationModal()
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

  const handleCreateListing = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Create listing button clicked!', e)
    window.location.href = '/admin/create'
  }

  const handleFilterClick = (status: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Filter button clicked:', status, e)
    setStatusFilter(status)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Search input changed:', e.target.value)
    setSearchTerm(e.target.value)
  }

  const handleDeleteClick = (id: string) => {
    showWarning(
      '매물 삭제',
      '정말로 이 매물을 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.',
      () => deleteListing(id)
    )
  }

  const deleteListing = async (id: string) => {
    closeModal()

    try {
      const response = await fetch(`/api/listings/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        showSuccess('성공', '매물이 삭제되었습니다.')
        fetchListings()
      } else {
        showError('오류', '삭제에 실패했습니다.')
      }
    } catch (error) {
      console.error('Delete error:', error)
      showError('오류', '삭제 중 오류가 발생했습니다.')
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50" style={{ position: 'relative', zIndex: 1 }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50 shadow-2xl" style={{ position: 'relative', zIndex: 10 }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-3 flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg shadow-blue-500/30">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                매물 관리
              </h1>
              <p className="text-slate-300 text-lg font-medium">등록된 매물을 관리하고 새로운 매물을 추가하세요</p>
            </div>
            <Button
              onClick={handleCreateListing}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 h-14 px-8 text-lg font-bold rounded-2xl cursor-pointer"
              type="button"
              style={{ pointerEvents: 'auto', position: 'relative', zIndex: 20 }}
            >
              <Plus className="h-5 w-5 mr-2" />
              새 매물 등록
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-8 border-0 shadow-2xl bg-white rounded-3xl overflow-hidden" style={{ position: 'relative', zIndex: 5 }}>
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-1">
            <CardContent className="p-8 bg-white rounded-3xl">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 transform -translate-y-1/2 z-10">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                        <Search className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <Input
                      placeholder="매물명이나 주소를 입력하세요..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="pl-20 h-16 border-2 border-slate-200 focus:border-blue-500 rounded-2xl text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                      style={{ position: 'relative', zIndex: 10 }}
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  {["all", "active", "inactive"].map((status) => (
                    <Button
                      key={status}
                      variant={statusFilter === status ? "default" : "outline"}
                      onClick={handleFilterClick(status)}
                      className={`h-16 px-6 rounded-2xl font-bold transition-all duration-300 cursor-pointer ${statusFilter === status
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl hover:shadow-2xl scale-105"
                        : "bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600 shadow-lg hover:shadow-xl"
                        }`}
                      type="button"
                      style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10 }}
                    >
                      <Filter className="h-5 w-5 mr-2" />
                      {status === "all" ? "전체" : status === "active" ? "활성" : "비활성"}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white rounded-3xl overflow-hidden group hover:scale-105 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-8 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-bold mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-200 rounded-full animate-pulse" />
                    전체 매물
                  </p>
                  <p className="text-5xl font-black mb-1">{listings.length}</p>
                  <p className="text-blue-200 text-xs font-medium">Total Listings</p>
                </div>
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Building2 className="h-12 w-12 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-2xl bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 text-white rounded-3xl overflow-hidden group hover:scale-105 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-8 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-bold mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-200 rounded-full animate-pulse" />
                    활성 매물
                  </p>
                  <p className="text-5xl font-black mb-1">
                    {listings.filter(l => l.status === 'active').length}
                  </p>
                  <p className="text-emerald-200 text-xs font-medium">Active Listings</p>
                </div>
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Eye className="h-12 w-12 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-2xl bg-gradient-to-br from-purple-500 via-violet-600 to-fuchsia-600 text-white rounded-3xl overflow-hidden group hover:scale-105 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-8 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-bold mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-200 rounded-full animate-pulse" />
                    비활성 매물
                  </p>
                  <p className="text-5xl font-black mb-1">
                    {listings.filter(l => l.status === 'inactive').length}
                  </p>
                  <p className="text-purple-200 text-xs font-medium">Inactive Listings</p>
                </div>
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Building2 className="h-12 w-12 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredListings.map((listing) => (
            <Card key={listing.id} className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white rounded-3xl relative">
              {/* 카드 상단 그라디언트 */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl" />

              <div className="aspect-video bg-gradient-to-br from-slate-300 via-blue-200 to-purple-300 relative overflow-hidden">
                <img
                  src={`https://via.placeholder.com/400x300/667eea/ffffff?text=${encodeURIComponent(listing.title.slice(0, 10))}`}
                  alt={listing.title}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge
                    className={listing.status === 'active'
                      ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 shadow-lg px-4 py-1.5 text-sm font-bold"
                      : "bg-gradient-to-r from-red-500 to-rose-600 text-white border-0 shadow-lg px-4 py-1.5 text-sm font-bold"
                    }
                  >
                    {listing.status === 'active' ? '✓ 활성' : '✕ 비활성'}
                  </Badge>
                </div>

                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-xl">
                  <div className="text-xs text-slate-500 font-medium">매물코드</div>
                  <div className="text-sm font-bold text-slate-900">{listing.code}</div>
                </div>
              </div>

              <CardHeader className="relative pb-4">
                <CardTitle className="text-2xl font-bold text-slate-900 line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors">{listing.title}</CardTitle>
                <div className="flex items-center gap-2 text-slate-600 bg-slate-50 rounded-xl px-3 py-2">
                  <MapPin className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <span className="text-sm font-medium line-clamp-1">{listing.address_road}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-5 relative">
                {/* 가격 정보 */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border-2 border-blue-100">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-xs text-blue-600 font-bold">보증금</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {formatPrice(listing.price_deposit)}
                    </span>
                    <span className="text-sm text-slate-500 font-medium">
                      {listing.price_deposit < 10000 ? '만원' : ''}
                    </span>
                  </div>
                  {listing.price_monthly && (
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-purple-600 font-bold">월세</span>
                      <span className="text-lg font-bold text-purple-600">
                        {formatPrice(listing.price_monthly)}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {listing.price_monthly < 10000 ? '만원' : ''}
                      </span>
                    </div>
                  )}
                </div>

                {/* 매물 정보 */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                    <div className="text-xs text-slate-500 font-medium mb-1">전용면적</div>
                    <div className="text-lg font-bold text-slate-900">{formatArea(listing.exclusive_m2)}</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                    <div className="text-xs text-slate-500 font-medium mb-1">층수</div>
                    <div className="text-lg font-bold text-slate-900">{listing.floor}층</div>
                  </div>
                </div>

                {/* 액션 버튼 */}
                <div className="flex gap-3 pt-2">
                  <Link href={`/admin/edit/${listing.id}`} className="flex-1">
                    <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-bold gap-2 group">
                      <Edit className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                      수정
                    </Button>
                  </Link>
                  <Button
                    onClick={() => handleDeleteClick(listing.id)}
                    className="flex-1 h-12 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-bold gap-2 group"
                  >
                    <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
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
            <Button
              onClick={handleCreateListing}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-glow hover:shadow-lg transition-all duration-300 cursor-pointer"
              type="button"
              style={{ pointerEvents: 'auto', position: 'relative', zIndex: 20 }}
            >
              <Plus className="h-4 w-4 mr-2" />
              매물 등록하기
            </Button>
          </div>
        )}
      </div>

      <NotificationModal
        isOpen={modal.isOpen}
        onClose={closeModal}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
      />
    </div>
  )
}