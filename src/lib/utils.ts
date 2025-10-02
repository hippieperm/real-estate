import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string): string {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  
  // 1억 이상일 때 억 단위로 표시
  if (numPrice >= 10000) {
    const eok = numPrice / 10000;
    if (eok >= 10) {
      return `${Math.floor(eok)}억`;
    } else {
      return `${eok.toFixed(1)}억`;
    }
  }
  
  // 1억 미만일 때 만원 단위로 표시
  return new Intl.NumberFormat("ko-KR").format(numPrice);
}

export function formatArea(
  m2: number,
  unit: "pyeong" | "m2" = "pyeong"
): string {
  if (unit === "pyeong") {
    const pyeong = m2 / 3.305785;
    return `${pyeong.toFixed(1)}평`;
  }
  return `${m2.toFixed(1)}㎡`;
}

export function getPyeongCategory(pyeong: number): string {
  if (pyeong < 50) return "50평 미만";
  if (pyeong < 100) return "50-100평";
  if (pyeong < 200) return "100-200평";
  return "200평 이상";
}

export type ListingStatus = 'active' | 'hidden' | 'archived' | 'available' | 'reserved' | 'in_progress' | 'completed' | 'withdrawn';

export function getStatusLabel(status: ListingStatus): string {
  const labels: Record<ListingStatus, string> = {
    active: "활성",
    available: "매물가능",
    reserved: "예약중",
    in_progress: "거래중",
    completed: "거래완료",
    withdrawn: "매물철회",
    hidden: "숨김",
    archived: "보관됨"
  };
  return labels[status] || status;
}

export function getStatusIcon(status: ListingStatus): string {
  const icons: Record<ListingStatus, string> = {
    active: "✓",
    available: "🏢",
    reserved: "📋",
    in_progress: "🤝",
    completed: "✅",
    withdrawn: "❌",
    hidden: "👁️‍🗨️",
    archived: "📦"
  };
  return icons[status] || "•";
}

export function getStatusColor(status: ListingStatus): string {
  const colors: Record<ListingStatus, string> = {
    active: "bg-gradient-to-r from-emerald-500 to-green-600",
    available: "bg-gradient-to-r from-blue-500 to-blue-600",
    reserved: "bg-gradient-to-r from-yellow-500 to-orange-600",
    in_progress: "bg-gradient-to-r from-purple-500 to-indigo-600",
    completed: "bg-gradient-to-r from-green-500 to-emerald-600",
    withdrawn: "bg-gradient-to-r from-red-500 to-rose-600",
    hidden: "bg-gradient-to-r from-gray-500 to-slate-600",
    archived: "bg-gradient-to-r from-gray-400 to-gray-500"
  };
  return colors[status] || "bg-gradient-to-r from-gray-500 to-slate-600";
}

export function getStatusTextColor(status: ListingStatus): string {
  return "text-white"; // All gradient backgrounds use white text
}

export function isActiveStatus(status: ListingStatus): boolean {
  return ['active', 'available', 'reserved', 'in_progress'].includes(status);
}
