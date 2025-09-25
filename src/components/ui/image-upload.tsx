"use client"

import * as React from "react"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  value?: string[]
  onChange: (files: File[]) => void
  onRemove: (index: number) => void
  maxFiles?: number
  className?: string
}

export const ImageUpload = React.forwardRef<HTMLInputElement, ImageUploadProps>(
  ({ className, value = [], onChange, onRemove, maxFiles = 10, ...props }, ref) => {
    const [dragActive, setDragActive] = React.useState(false)
    const [previews, setPreviews] = React.useState<string[]>([])
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const handleDrag = React.useCallback((e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true)
      } else if (e.type === "dragleave") {
        setDragActive(false)
      }
    }, [])

    const handleDrop = React.useCallback((e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const files = Array.from(e.dataTransfer.files).filter(
          file => file.type.startsWith('image/')
        )
        handleFiles(files)
      }
    }, [])

    const handleFiles = React.useCallback((files: File[]) => {
      const validFiles = files.slice(0, maxFiles - value.length)
      onChange(validFiles)

      // Create previews
      validFiles.forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            setPreviews(prev => [...prev, e.target.result as string])
          }
        }
        reader.readAsDataURL(file)
      })
    }, [onChange, maxFiles, value.length])

    const handleFileSelect = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const files = Array.from(e.target.files)
        handleFiles(files)
      }
    }, [handleFiles])

    const handleRemove = React.useCallback((index: number) => {
      onRemove(index)
      setPreviews(prev => prev.filter((_, i) => i !== index))
    }, [onRemove])

    const handleClick = () => {
      fileInputRef.current?.click()
    }

    return (
      <div className={cn("w-full", className)}>
        {/* Upload Area */}
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer",
            dragActive 
              ? "border-blue-500 bg-blue-50" 
              : "border-gray-300 hover:border-gray-400",
            value.length >= maxFiles && "opacity-50 cursor-not-allowed"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={value.length < maxFiles ? handleClick : undefined}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={value.length >= maxFiles}
          />
          
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <div className="p-2 bg-gray-100 rounded-full">
              <Upload className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                클릭하거나 파일을 드래그해서 업로드
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, JPEG 파일만 가능 (최대 {maxFiles}개)
              </p>
            </div>
          </div>

          {dragActive && (
            <div className="absolute inset-0 bg-blue-500/10 rounded-lg pointer-events-none" />
          )}
        </div>

        {/* Image Previews */}
        {(value.length > 0 || previews.length > 0) && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Existing images */}
            {value.map((image, index) => (
              <div key={`existing-${index}`} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={image}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}

            {/* New preview images */}
            {previews.map((preview, index) => (
              <div key={`preview-${index}`} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPreviews(prev => prev.filter((_, i) => i !== index))
                  }}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
                <div className="absolute inset-0 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <div className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                    업로드 중...
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Progress */}
        <div className="mt-2 text-xs text-gray-500 text-center">
          {value.length + previews.length} / {maxFiles} 이미지
        </div>
      </div>
    )
  }
)

ImageUpload.displayName = "ImageUpload"

export { ImageUpload }