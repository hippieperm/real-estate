"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, Building2, User, LogIn } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "홈", href: "/" },
  { name: "지도검색", href: "/map" },
  { name: "목록검색", href: "/list" },
  { name: "지하철역별", href: "/stations" },
  { name: "지역별", href: "/regions" },
  { name: "임대·임차 의뢰", href: "/inquiry" },
]

export default function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      scrolled
        ? "glass shadow-elegant border-b border-white/20"
        : "bg-transparent"
    )}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        <div className="flex items-center animate-slide-in-left">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Building2 className="h-8 w-8 text-primary transition-transform group-hover:scale-110 duration-300" />
              <div className="absolute -inset-1 bg-primary/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              알파카 리스
            </span>
          </Link>
        </div>

        <div className="hidden md:flex md:gap-x-2 animate-fade-in">
          {navigation.map((item, index) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg group hover:bg-white/10",
                pathname === item.href
                  ? "text-primary bg-primary/10"
                  : "text-slate-700 hover:text-primary"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {item.name}
              <span className={cn(
                "absolute bottom-0 left-1/2 h-0.5 bg-primary transition-all duration-300 transform -translate-x-1/2",
                pathname === item.href ? "w-8" : "w-0 group-hover:w-6"
              )}></span>
            </Link>
          ))}
        </div>

        <div className="hidden md:flex md:items-center md:gap-x-3 animate-slide-in-right">
          <Link href="/auth/login">
            <Button
              variant="ghost"
              size="sm"
              className="group transition-all duration-300 hover:bg-white/10"
            >
              <LogIn className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              로그인
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button
              size="sm"
              className="gradient-blue text-white border-0 shadow-glow hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <User className="mr-2 h-4 w-4" />
              회원가입
            </Button>
          </Link>
        </div>

        <div className="flex md:hidden">
          <button
            type="button"
            className="relative -m-2.5 inline-flex items-center justify-center rounded-lg p-2.5 text-slate-700 hover:bg-white/10 transition-all duration-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className="relative">
              {mobileMenuOpen ? (
                <X className="h-6 w-6 transition-transform duration-300 rotate-180" />
              ) : (
                <Menu className="h-6 w-6 transition-transform duration-300" />
              )}
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={cn(
        "md:hidden transition-all duration-300 ease-in-out overflow-hidden",
        mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="glass-dark border-t border-white/10">
          <div className="space-y-1 px-4 pb-6 pt-4">
            {navigation.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "block rounded-lg px-4 py-3 text-base font-medium transition-all duration-300 animate-slide-in-left",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "text-slate-700 hover:bg-white/10 hover:text-primary"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-6 space-y-3 pt-4 border-t border-white/10">
              <Link href="/auth/login">
                <Button
                  variant="outline"
                  className="w-full h-12 glass border-white/20 hover:bg-white/10 transition-all duration-300"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  로그인
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button
                  className="w-full h-12 gradient-blue text-white border-0 shadow-glow hover:shadow-lg transition-all duration-300"
                >
                  <User className="mr-2 h-4 w-4" />
                  회원가입
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}