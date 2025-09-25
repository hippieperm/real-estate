"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"
import { NotificationModal, useNotificationModal } from "@/components/ui/notification-modal"

const inquirySchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  phone: z.string().min(1, "연락처를 입력해주세요"),
  message: z.string().optional(),
})

type InquiryForm = z.infer<typeof inquirySchema>

interface InquiryModalProps {
  listingId: string
  listingTitle: string
  children: React.ReactNode
}

export default function InquiryModal({ listingId, listingTitle, children }: InquiryModalProps) {
  const { modal, closeModal: closeNotificationModal, showError } = useNotificationModal()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InquiryForm>({
    resolver: zodResolver(inquirySchema),
  })

  const onSubmit = async (data: InquiryForm) => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: listingId,
          ...data,
          source: 'web',
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)
        reset()
      } else {
        throw new Error('문의 전송에 실패했습니다')
      }
    } catch (error) {
      console.error('Inquiry submission error:', error)
      showError('오류', '문의 전송에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const closeModal = () => {
    setIsOpen(false)
    setIsSubmitted(false)
    reset()
  }

  return (
    <>
      <div onClick={() => setIsOpen(true)}>
        {children}
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>매물 문의</CardTitle>
                  <CardDescription className="line-clamp-1">
                    {listingTitle}
                  </CardDescription>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={closeModal}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="text-green-600 text-lg font-semibold mb-2">
                    문의가 접수되었습니다
                  </div>
                  <p className="text-gray-600 mb-4">
                    담당자가 빠른 시일 내에 연락드리겠습니다.
                  </p>
                  <Button onClick={closeModal}>확인</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">이름 *</label>
                    <Input
                      {...register("name")}
                      placeholder="이름을 입력하세요"
                      className="mt-1"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium">연락처 *</label>
                    <Input
                      {...register("phone")}
                      placeholder="010-0000-0000"
                      className="mt-1"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium">문의 내용</label>
                    <textarea
                      {...register("message")}
                      placeholder="문의하실 내용을 자유롭게 적어주세요"
                      className="mt-1 w-full px-3 py-2 border border-input rounded-md resize-none"
                      rows={3}
                    />
                  </div>

                  <div className="text-xs text-gray-500">
                    <p>* 개인정보는 문의 처리 목적으로만 사용됩니다.</p>
                    <p>* 문의 후 1~2일 내에 답변드리겠습니다.</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={closeModal}
                      className="flex-1"
                    >
                      취소
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? '전송 중...' : '문의하기'}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      
      <NotificationModal
        isOpen={modal.isOpen}
        onClose={closeNotificationModal}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
      />
    </>
  )
}