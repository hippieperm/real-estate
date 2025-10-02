"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

interface ImageGalleryProps {
  images: string[]
  title: string
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showModal, setShowModal] = useState(false)

  const hasImages = images && images.length > 0

  if (!hasImages) {
    return (
      <div className="aspect-video bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">이미지가 없습니다</p>
      </div>
    )
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <>
      {/* Main Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 max-h-96">
        {/* Main Image */}
        <div
          className="md:col-span-3 aspect-video relative cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          <img
            src={images[0]}
            alt={title}
            className="object-cover w-full h-full rounded-l-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center">
            <span className="text-white font-semibold opacity-0 hover:opacity-100">
              클릭하여 크게 보기
            </span>
          </div>
        </div>

        {/* Thumbnail Grid */}
        <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
          {images.slice(1, 5).map((image, index) => (
            <div
              key={index}
              className="aspect-square relative cursor-pointer"
              onClick={() => {
                setCurrentIndex(index + 1)
                setShowModal(true)
              }}
            >
              <img
                src={image}
                alt={`${title} ${index + 2}`}
                className="object-cover w-full h-full rounded"
              />
              {index === 3 && images.length > 5 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
                  <span className="text-white font-semibold">
                    +{images.length - 4}장 더보기
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 z-10"
              onClick={() => setShowModal(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Previous Button */}
            {images.length > 1 && (
              <Button
                size="icon"
                variant="ghost"
                className="absolute left-4 text-white hover:bg-white hover:bg-opacity-20"
                onClick={prevImage}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
            )}

            {/* Main Image */}
            <img
              src={images[currentIndex]}
              alt={`${title} ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Next Button */}
            {images.length > 1 && (
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-4 text-white hover:bg-white hover:bg-opacity-20"
                onClick={nextImage}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
              {currentIndex + 1} / {images.length}
            </div>

            {/* Thumbnail Strip */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-16 h-16 flex-shrink-0 rounded overflow-hidden border-2 ${
                    index === currentIndex ? 'border-white' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}