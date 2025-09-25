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
