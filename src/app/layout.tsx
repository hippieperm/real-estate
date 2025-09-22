import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "알파카 리스 - 사무실·상가 전문 부동산",
  description: "강남, 역삼, 서초 지역 프라임 오피스 및 상가 임대 전문 플랫폼",
  keywords: "사무실임대, 상가임대, 강남사무실, 역삼동오피스, 테헤란로사무실",
  openGraph: {
    title: "알파카 리스",
    description: "프라임 오피스 및 상가 임대 전문",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
