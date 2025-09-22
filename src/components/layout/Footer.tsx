import Link from "next/link"
import { Building2 } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="font-bold">알파카 리스</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              프라임 오피스 및 상가 임대 전문
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">서비스</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/map" className="text-muted-foreground hover:text-primary">
                  지도검색
                </Link>
              </li>
              <li>
                <Link href="/list" className="text-muted-foreground hover:text-primary">
                  목록검색
                </Link>
              </li>
              <li>
                <Link href="/inquiry" className="text-muted-foreground hover:text-primary">
                  임대·임차 의뢰
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">회사</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
                  회사소개
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="text-muted-foreground hover:text-primary">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="text-muted-foreground hover:text-primary">
                  개인정보처리방침
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">문의</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>전화: 02-1234-5678</li>
              <li>이메일: info@alpaca.lease</li>
              <li>주소: 서울시 강남구 테헤란로 123</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 알파카 리스. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}