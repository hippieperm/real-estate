"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/ui/image-upload";
import { LocationPicker } from "@/components/ui/location-picker";
import {
  NotificationModal,
  useNotificationModal,
} from "@/components/ui/notification-modal";
import {
  ArrowLeft,
  Save,
  Building2,
  MapPin,
  DollarSign,
  Square,
  Upload,
  CheckCircle,
  Circle,
  Sparkles,
  Home,
  TrendingUp,
  Camera,
  MapIcon,
} from "lucide-react";
import Link from "next/link";

export default function CreateListingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { modal, closeModal, showSuccess, showError } = useNotificationModal();
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    property_type: "",
    price_deposit: "",
    price_monthly: "",
    exclusive_m2: "",
    floor: "",
    building_floor: "",
    address_road: "",
    address_jibun: "",
    address_detail: "",
    latitude: "",
    longitude: "",
    status: "active",
  });

  const formatNumber = (value: string) => {
    const numericValue = value.replace(/,/g, "");
    if (numericValue === "" || isNaN(Number(numericValue))) return value;
    return Number(numericValue).toLocaleString("ko-KR");
  };

  const validateNumber = (value: string, fieldName: string, maxValue: number = 99999999) => {
    const numericValue = value.replace(/,/g, "");
    const num = Number(numericValue);
    
    if (num > maxValue) {
      showError("입력 오류", `${fieldName}은(는) 최대 ${maxValue.toLocaleString()}까지 입력 가능합니다`);
      return false;
    }
    return true;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNumberInputChange = (field: string, value: string) => {
    const numericValue = value.replace(/,/g, "");
    
    // 실시간 검증
    let maxValue = 99999999;
    let fieldName = field;
    
    switch (field) {
      case 'price_deposit':
        fieldName = '보증금';
        break;
      case 'price_monthly':
        fieldName = '월세';
        break;
      case 'exclusive_m2':
        fieldName = '전용면적';
        break;
      case 'floor':
      case 'building_floor':
        maxValue = 9999;
        fieldName = field === 'floor' ? '층수' : '총 층수';
        break;
    }
    
    const num = Number(numericValue);
    if (numericValue && !isNaN(num) && num > maxValue) {
      showError("입력 제한", `${fieldName}은(는) 최대 ${maxValue.toLocaleString()}까지 입력 가능합니다`);
      return; // 입력을 무시
    }
    
    setFormData((prev) => ({
      ...prev,
      [field]: numericValue,
    }));
  };

  const handleLocationSelect = (location: {
    address: string;
    latitude: number;
    longitude: number;
    roadAddress?: string;
    jibunAddress?: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      address_road: location.roadAddress || location.address,
      address_jibun: location.jibunAddress || "",
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
    }));
  };

  const handleImageUpload = (files: File[]) => {
    setSelectedImages((prev) => [...prev, ...files]);
  };

  const handleImageUrlChange = (urls: string[]) => {
    setImageUrls(urls);
  };

  const handleImageRemove = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (listingId: string) => {
    if (selectedImages.length === 0) return [];

    setUploadingImages(true);
    try {
      const formData = new FormData();
      selectedImages.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("listingId", listingId);

      console.log('Making upload request to /api/upload');
      
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      console.log('Upload response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('Upload successful:', result);
        return result.images;
      } else {
        const errorText = await response.text();
        console.error('Upload failed with status:', response.status);
        console.error('Error response:', errorText);
        throw new Error(`이미지 업로드 실패 (${response.status}): ${errorText}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    } finally {
      setUploadingImages(false);
    }
  };

  const saveImageUrls = async (listingId: string) => {
    if (imageUrls.length === 0) return [];

    try {
      const response = await fetch("/api/images/save-urls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingId,
          urls: imageUrls,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('URL images saved:', result);
        return result.images;
      } else {
        const errorText = await response.text();
        console.error('URL save failed:', errorText);
        throw new Error(`URL 이미지 저장 실패: ${errorText}`);
      }
    } catch (error) {
      console.error("URL save error:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 콤마 제거 후 숫자 변환
      const cleanPrice = (value: string) => {
        if (!value) return null;
        const cleaned = value.replace(/,/g, "");
        const num = parseFloat(cleaned);
        return isNaN(num) ? null : num;
      };

      // 1. 매물 생성
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price_deposit: cleanPrice(formData.price_deposit),
          price_monthly: cleanPrice(formData.price_monthly),
          exclusive_m2: cleanPrice(formData.exclusive_m2),
          floor: cleanPrice(formData.floor),
          floors_total: cleanPrice(formData.building_floor),
          latitude: formData.latitude ? Number(formData.latitude) : null,
          longitude: formData.longitude ? Number(formData.longitude) : null,
          created_by: user?.id || null, // 현재 사용자 ID 추가
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("API Error:", error);
        throw new Error(
          error.details || error.error || "매물 등록에 실패했습니다"
        );
      }

      const { listing } = await response.json();

      // 2. 이미지 처리 (선택사항)
      if (selectedImages.length > 0) {
        try {
          await uploadImages(listing.id);
        } catch (imageError) {
          console.error("File upload error:", imageError);
          showError("파일 업로드 실패", `파일 업로드에 실패했습니다: ${imageError instanceof Error ? imageError.message : String(imageError)}`);
        }
      }

      if (imageUrls.length > 0) {
        try {
          await saveImageUrls(listing.id);
        } catch (urlError) {
          console.error("URL save error:", urlError);
          showError("URL 이미지 저장 실패", `URL 이미지 저장에 실패했습니다: ${urlError instanceof Error ? urlError.message : String(urlError)}`);
        }
      }

      showSuccess("성공", "매물이 성공적으로 등록되었습니다!");
      router.push("/admin");
    } catch (error) {
      console.error("Create error:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      showError("등록 실패", `등록에 실패했습니다: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f1f5f9' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      {/* Header */}
      <div className="relative bg-white/90 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-20 shadow-lg shadow-slate-200/20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-indigo-600/5"></div>
        <div className="max-w-6xl mx-auto px-6 py-10 relative">
          <div className="flex items-center gap-8">
            <Link href="/admin">
              <Button
                variant="outline"
                size="lg"
                className="gap-3 border-slate-300/60 text-slate-700 bg-white/80 hover:bg-white hover:border-slate-400 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl px-6 py-3 backdrop-blur-sm"
              >
                <ArrowLeft className="h-5 w-5" />
                관리자 대시보드
              </Button>
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-2">
                    새 매물 등록
                  </h1>
                  <p className="text-xl text-slate-600 font-medium">
                    전문적인 매물 정보를 입력하여 새로운 매물을 등록하세요
                  </p>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200/60 shadow-lg">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
              <span className="text-sm font-semibold text-emerald-700">
                실시간 자동 저장
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16 relative">
        <form onSubmit={handleSubmit} className="space-y-16">
          {/* Enhanced Progress Indicator */}
          <div className="relative">
            <div className="flex items-center justify-center mb-12">
              <div className="flex items-center space-x-8 bg-white/80 backdrop-blur-xl rounded-3xl px-8 py-6 shadow-2xl shadow-slate-200/30 border border-slate-200/60">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-blue-500/30">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-slate-900">
                      기본 정보
                    </div>
                    <div className="text-xs text-slate-600">매물 기본 정보</div>
                  </div>
                </div>

                <div className="w-12 h-1 bg-gradient-to-r from-blue-300 to-slate-300 rounded-full"></div>

                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-emerald-500/30">
                    <MapIcon className="h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-slate-900">
                      위치 정보
                    </div>
                    <div className="text-xs text-slate-600">주소 및 좌표</div>
                  </div>
                </div>

                <div className="w-12 h-1 bg-gradient-to-r from-slate-300 to-orange-300 rounded-full"></div>

                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-orange-500/30">
                    <Camera className="h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-slate-900">
                      이미지
                    </div>
                    <div className="text-xs text-slate-600">사진 업로드</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 기본 정보 */}
          <Card className="group border-0 shadow-2xl shadow-slate-200/40 bg-white/90 backdrop-blur-xl hover:shadow-3xl hover:shadow-slate-300/50 transition-all duration-500 rounded-3xl overflow-hidden hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-indigo-50/40 to-purple-50/60 opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="pb-8 relative">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-6 text-3xl font-bold text-slate-900">
                  <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl shadow-blue-500/30 group-hover:shadow-2xl group-hover:shadow-blue-500/40 transition-all duration-300">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                      기본 정보
                    </div>
                    <div className="text-sm text-slate-600 font-medium mt-1">
                      매물의 기본적인 정보를 입력해주세요
                    </div>
                  </div>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse delay-200"></div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-10 relative">
              <div className="group">
                <Label
                  htmlFor="title"
                  className="text-base font-bold text-slate-800 mb-4 block flex items-center gap-3"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  매물명
                  <span className="text-red-500 text-lg">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="예: 강남역 프리미엄 오피스텔"
                  required
                  className="h-14 border-2 border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-medium"
                />
              </div>

              <div className="group">
                <Label
                  htmlFor="description"
                  className="text-base font-bold text-slate-800 mb-4 block flex items-center gap-3"
                >
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  매물 설명
                  <span className="text-xs text-slate-500 font-normal">
                    (선택사항)
                  </span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="매물의 특징, 장점, 주변 환경 등에 대한 자세한 설명을 입력하세요"
                  rows={5}
                  className="border-2 border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-base font-medium resize-none"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="group">
                  <Label
                    htmlFor="property_type"
                    className="text-base font-bold text-slate-800 mb-4 block flex items-center gap-3"
                  >
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    매물 유형
                    <span className="text-red-500 text-lg">*</span>
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      handleInputChange("property_type", value)
                    }
                    required
                  >
                    <SelectTrigger className="h-14 border-2 border-slate-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-medium focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20">
                      <SelectValue placeholder="매물 유형을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl shadow-2xl border-2 border-slate-200">
                      <SelectItem
                        value="office"
                        className="text-lg font-medium py-4"
                      >
                        🏢 사무실
                      </SelectItem>
                      <SelectItem
                        value="retail"
                        className="text-lg font-medium py-4"
                      >
                        🏪 상가
                      </SelectItem>
                      <SelectItem
                        value="building"
                        className="text-lg font-medium py-4"
                      >
                        🏬 통건물
                      </SelectItem>
                      <SelectItem
                        value="residential"
                        className="text-lg font-medium py-4"
                      >
                        🏠 주택형
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="group">
                  <Label
                    htmlFor="status"
                    className="text-base font-bold text-slate-800 mb-4 block flex items-center gap-3"
                  >
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    상태
                    <span className="text-xs text-slate-500 font-normal">
                      (기본값: 활성)
                    </span>
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleInputChange("status", value)
                    }
                  >
                    <SelectTrigger className="h-14 border-2 border-slate-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-medium focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl shadow-2xl border-2 border-slate-200">
                      <SelectItem
                        value="active"
                        className="text-lg font-medium py-4"
                      >
                        ✅ 활성
                      </SelectItem>
                      <SelectItem
                        value="inactive"
                        className="text-lg font-medium py-4"
                      >
                        ⭕ 비활성
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 가격 정보 */}
          <Card className="group border-0 shadow-2xl shadow-slate-200/40 bg-white/90 backdrop-blur-xl hover:shadow-3xl hover:shadow-slate-300/50 transition-all duration-500 rounded-3xl overflow-hidden hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/60 via-green-50/40 to-teal-50/60 opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="pb-8 relative">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-6 text-3xl font-bold text-slate-900">
                  <div className="p-4 bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl shadow-xl shadow-emerald-500/30 group-hover:shadow-2xl group-hover:shadow-emerald-500/40 transition-all duration-300">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                      가격 정보
                    </div>
                    <div className="text-sm text-slate-600 font-medium mt-1">
                      매물의 가격 정보를 입력해주세요
                    </div>
                  </div>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse delay-200"></div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-10 relative">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="group">
                  <Label
                    htmlFor="price_deposit"
                    className="text-base font-bold text-slate-800 mb-4 block flex items-center gap-3"
                  >
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    💰 보증금
                    <span className="text-red-500 text-lg">*</span>
                  </Label>
                  <Input
                    id="price_deposit"
                    type="text"
                    value={formatNumber(formData.price_deposit)}
                    onChange={(e) =>
                      handleNumberInputChange("price_deposit", e.target.value)
                    }
                    placeholder="10,000 (최대 99,999,999)"
                    required
                    className="h-14 border-2 border-slate-200 text-slate-900 placeholder-slate-500 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-medium"
                  />
                </div>
                <div className="group">
                  <Label
                    htmlFor="price_monthly"
                    className="text-base font-bold text-slate-800 mb-4 block flex items-center gap-3"
                  >
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    📅 월세
                    <span className="text-xs text-slate-500 font-normal">
                      (선택사항)
                    </span>
                  </Label>
                  <Input
                    id="price_monthly"
                    type="text"
                    value={
                      formData.price_monthly
                        ? formatNumber(formData.price_monthly)
                        : ""
                    }
                    onChange={(e) =>
                      handleNumberInputChange("price_monthly", e.target.value)
                    }
                    placeholder="300 (최대 99,999,999)"
                    className="h-14 border-2 border-slate-200 text-slate-900 placeholder-slate-500 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-medium"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 면적 및 층수 */}
          <Card className="group border-0 shadow-2xl shadow-slate-200/40 bg-white/90 backdrop-blur-xl hover:shadow-3xl hover:shadow-slate-300/50 transition-all duration-500 rounded-3xl overflow-hidden hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/60 via-violet-50/40 to-pink-50/60 opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="pb-8 relative">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-6 text-3xl font-bold text-slate-900">
                  <div className="p-4 bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl shadow-xl shadow-purple-500/30 group-hover:shadow-2xl group-hover:shadow-purple-500/40 transition-all duration-300">
                    <Square className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                      면적 및 층수
                    </div>
                    <div className="text-sm text-slate-600 font-medium mt-1">
                      매물의 면적과 층수 정보를 입력해주세요
                    </div>
                  </div>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-purple-300 rounded-full animate-pulse delay-200"></div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-10 relative">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="group">
                  <Label
                    htmlFor="exclusive_m2"
                    className="text-base font-bold text-slate-800 mb-4 block flex items-center gap-3"
                  >
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    📐 전용면적 (㎡)
                    <span className="text-red-500 text-lg">*</span>
                  </Label>
                  <Input
                    id="exclusive_m2"
                    type="text"
                    value={
                      formData.exclusive_m2
                        ? formatNumber(formData.exclusive_m2)
                        : ""
                    }
                    onChange={(e) =>
                      handleNumberInputChange("exclusive_m2", e.target.value)
                    }
                    placeholder="165.3 (최대 99,999,999)"
                    required
                    className="h-14 border-2 border-slate-200 text-slate-900 placeholder-slate-500 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-medium"
                  />
                </div>
                <div className="group">
                  <Label
                    htmlFor="floor"
                    className="text-base font-bold text-slate-800 mb-4 block flex items-center gap-3"
                  >
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    🏢 해당 층<span className="text-red-500 text-lg">*</span>
                  </Label>
                  <Input
                    id="floor"
                    type="text"
                    value={formData.floor ? formatNumber(formData.floor) : ""}
                    onChange={(e) =>
                      handleNumberInputChange("floor", e.target.value)
                    }
                    placeholder="15 (최대 9,999)"
                    required
                    className="h-14 border-2 border-slate-200 text-slate-900 placeholder-slate-500 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-medium"
                  />
                </div>
                <div className="group">
                  <Label
                    htmlFor="building_floor"
                    className="text-base font-bold text-slate-800 mb-4 block flex items-center gap-3"
                  >
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    🏗️ 건물 총 층수
                    <span className="text-xs text-slate-500 font-normal">
                      (선택사항)
                    </span>
                  </Label>
                  <Input
                    id="building_floor"
                    type="text"
                    value={
                      formData.building_floor
                        ? formatNumber(formData.building_floor)
                        : ""
                    }
                    onChange={(e) =>
                      handleNumberInputChange("building_floor", e.target.value)
                    }
                    placeholder="20 (최대 9,999)"
                    className="h-14 border-2 border-slate-200 text-slate-900 placeholder-slate-500 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-medium"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 위치 정보 */}
          <Card className="group border-0 shadow-2xl shadow-slate-200/40 bg-white/90 backdrop-blur-xl hover:shadow-3xl hover:shadow-slate-300/50 transition-all duration-500 rounded-3xl overflow-hidden hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-50/60 via-red-50/40 to-orange-50/60 opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="pb-8 relative">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-6 text-3xl font-bold text-slate-900">
                  <div className="p-4 bg-gradient-to-r from-rose-600 to-red-600 rounded-2xl shadow-xl shadow-rose-500/30 group-hover:shadow-2xl group-hover:shadow-rose-500/40 transition-all duration-300">
                    <MapPin className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                      위치 정보
                    </div>
                    <div className="text-sm text-slate-600 font-medium mt-1">
                      매물의 정확한 위치를 선택해주세요
                    </div>
                  </div>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-rose-300 rounded-full animate-pulse delay-200"></div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-10 relative">
              <div className="group">
                <Label className="text-base font-bold text-slate-800 mb-4 block flex items-center gap-3">
                  <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                  🗺️ 위치 선택
                  <span className="text-red-500 text-lg">*</span>
                </Label>
                <div className="border-2 border-slate-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 focus-within:border-rose-500 focus-within:ring-4 focus-within:ring-rose-500/20">
                  <LocationPicker
                    onLocationSelect={handleLocationSelect}
                    initialAddress={formData.address_road}
                  />
                </div>
                {formData.address_road && (
                  <div className="mt-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200/60 shadow-lg">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-blue-500 rounded-xl">
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-lg font-bold text-blue-900 mb-2">
                          📍 {formData.address_road}
                        </div>
                        {formData.address_jibun && (
                          <div className="text-sm text-blue-700 mb-2">
                            지번: {formData.address_jibun}
                          </div>
                        )}
                        <div className="text-xs text-blue-600 bg-blue-100/60 px-3 py-1 rounded-lg inline-block">
                          좌표: {formData.latitude}, {formData.longitude}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="group">
                <Label
                  htmlFor="address_detail"
                  className="text-base font-bold text-slate-800 mb-4 block flex items-center gap-3"
                >
                  <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                  🏢 상세 주소 (동/호수)
                  <span className="text-xs text-slate-500 font-normal">
                    (선택사항)
                  </span>
                </Label>
                <Input
                  id="address_detail"
                  value={formData.address_detail}
                  onChange={(e) =>
                    handleInputChange("address_detail", e.target.value)
                  }
                  placeholder="15층 1501호"
                  className="h-14 border-2 border-slate-200 text-slate-900 placeholder-slate-500 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-medium"
                />
              </div>
            </CardContent>
          </Card>

          {/* 이미지 업로드 */}
          <Card className="group border-0 shadow-2xl shadow-slate-200/40 bg-white/90 backdrop-blur-xl hover:shadow-3xl hover:shadow-slate-300/50 transition-all duration-500 rounded-3xl overflow-hidden hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/60 via-amber-50/40 to-yellow-50/60 opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="pb-8 relative">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-6 text-3xl font-bold text-slate-900">
                  <div className="p-4 bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl shadow-xl shadow-orange-500/30 group-hover:shadow-2xl group-hover:shadow-orange-500/40 transition-all duration-300">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                      이미지 업로드
                    </div>
                    <div className="text-sm text-slate-600 font-medium mt-1">
                      매물의 사진을 업로드해주세요 (최대 10장)
                    </div>
                  </div>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-orange-300 rounded-full animate-pulse delay-200"></div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="border-2 border-slate-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/20">
                <ImageUpload
                  value={uploadedImages}
                  onChange={handleImageUpload}
                  onRemove={handleImageRemove}
                  onUrlChange={handleImageUrlChange}
                  maxFiles={10}
                />
              </div>
              {uploadingImages && (
                <div className="mt-8 flex items-center justify-center gap-4 p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border-2 border-orange-200/60 shadow-lg">
                  <div className="w-6 h-6 border-3 border-orange-300 border-t-orange-600 rounded-full animate-spin"></div>
                  <span className="text-lg text-orange-700 font-semibold">
                    이미지 업로드 중...
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 제출 버튼 */}
          <div className="relative pt-16">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-slate-200/30 border border-slate-200/60">
              <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-slate-400 border-t-slate-600 rounded-full animate-spin"></div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-slate-800">
                      실시간 자동 저장
                    </div>
                    <div className="text-sm text-slate-600">
                      입력한 정보가 자동으로 저장됩니다
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                  <Link href="/admin" className="w-full lg:w-auto">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full lg:w-auto h-14 px-8 bg-white/80 border-2 border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400 hover:text-slate-800 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
                    >
                      <ArrowLeft className="h-5 w-5 mr-2" />
                      취소
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    disabled={loading || uploadingImages}
                    className="w-full lg:w-auto h-14 px-12 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white rounded-2xl font-bold shadow-2xl hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 transform hover:scale-105 text-lg"
                  >
                    {loading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>
                          {uploadingImages
                            ? "이미지 업로드 중..."
                            : "등록 중..."}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Save className="h-6 w-6" />
                        <span>매물 등록하기</span>
                        <Sparkles className="h-5 w-5" />
                      </div>
                    )}
                  </Button>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200/60">
                <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                  <span className="font-medium">
                    * 표시된 필드는 필수 입력 사항입니다
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>
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
  );
}
