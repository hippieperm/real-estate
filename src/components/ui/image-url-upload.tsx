"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Plus, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUrlUploadProps {
  value?: string[]
  onChange: (urls: string[]) => void
  maxUrls?: number
  className?: string
}

export const ImageUrlUpload = React.forwardRef<HTMLInputElement, ImageUrlUploadProps>(
  ({ className, value = [], onChange, maxUrls = 10, ...props }, ref) => {
    const [currentUrl, setCurrentUrl] = React.useState("")
    const [previews, setPreviews] = React.useState<string[]>([])

    React.useEffect(() => {
      setPreviews(value)
    }, [value])

    const handleAddUrl = () => {
      if (!currentUrl.trim()) return
      
      // 간단한 URL 유효성 검사
      try {
        new URL(currentUrl)
      } catch {
        alert("유효한 URL을 입력해주세요")
        return
      }

      if (value.length >= maxUrls) {
        alert(`최대 ${maxUrls}개의 이미지까지 추가할 수 있습니다`)
        return
      }

      const newUrls = [...value, currentUrl.trim()]
      onChange(newUrls)
      setCurrentUrl("")
    }

    const handleRemoveUrl = (index: number) => {
      const newUrls = value.filter((_, i) => i !== index)
      onChange(newUrls)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleAddUrl()
      }
    }

    return (
      <div className={cn("w-full space-y-4", className)}>
        {/* URL 입력 */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">이미지 URL 추가</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                ref={ref}
                value={currentUrl}
                onChange={(e) => setCurrentUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="https://example.com/image.jpg"
                className="pl-10"
                {...props}
              />
            </div>
            <Button
              type="button"
              onClick={handleAddUrl}
              disabled={!currentUrl.trim() || value.length >= maxUrls}
              className="px-4"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            JPG, PNG, GIF, WebP 형식의 이미지 URL을 입력하세요
          </p>
        </div>

        {/* URL 목록 및 미리보기 */}
        {value.length > 0 && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              추가된 이미지 ({value.length}/{maxUrls})
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {value.map((url, index) => (
                <div key={index} className="group relative border rounded-lg p-3 bg-gray-50">
                  {/* 이미지 미리보기 */}
                  <div className="aspect-video bg-gray-200 rounded mb-2 overflow-hidden">
                    <img
                      src={url}
                      alt={`이미지 ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTAwTDEwMCAxMDAiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHRleHQgeD0iMTAwIiB5PSIxMTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+이미지 로드 실패</dGV4dD4KPHN2Zz4="
                      }}
                    />
                  </div>
                  
                  {/* URL 표시 */}
                  <div className="text-xs text-gray-600 break-all mb-2">
                    {url}
                  </div>
                  
                  {/* 삭제 버튼 */}
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRemoveUrl(index)}
                    className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }
)

ImageUrlUpload.displayName = "ImageUrlUpload"

export { ImageUrlUpload }