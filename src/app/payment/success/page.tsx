'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  const id = searchParams.get('id')
  const cancel = searchParams.get('cancel')
  const status = searchParams.get('status')
  const orderCode = searchParams.get('orderCode')

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <Card className="bg-white border-gray-200 shadow-sm rounded-2xl max-w-lg mx-auto mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-6 w-6" />
              Thanh toán thành công
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">Cảm ơn bạn đã thanh toán! Dưới đây là thông tin đơn hàng:</p>
            <div className="space-y-2">
              <p><strong>Mã trạng thái:</strong> {code || 'Không có'}</p>
              <p><strong>ID giao dịch:</strong> {id || 'Không có'}</p>
              <p><strong>Trạng thái:</strong> {status || 'Không có'}</p>
              <p><strong>Mã đơn hàng:</strong> {orderCode || 'Không có'}</p>
              <p><strong>Hủy:</strong> {cancel === 'true' ? 'Có' : 'Không'}</p>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                asChild
                variant="outline"
                className="border-blue-500 text-blue-500 hover:bg-blue-50"
              >
                <Link href="/">Về trang chủ</Link>
              </Button>
              <Button
                asChild
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Link href={`/order/${orderCode}`}>Xem chi tiết đơn hàng</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}