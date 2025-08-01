import React, { Suspense } from 'react'
import PaymentSuccessPage from "@/components/payment/payment-success-page";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center p-8">Đang tải thông tin thanh toán...</div>}>
      <PaymentSuccessPage />
    </Suspense>
  )
}
