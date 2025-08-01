
export interface Order {
  id: string
  userId: string
  userName: string
  status: string
  total: number
  items: { id: string; orderId: string; productId: string; quantity: number; unitPrice: number; total: number }[]
  paymentId: string | null
  createdAt: string
  updatedAt: string | null
}

export interface OrderResponse {
  orders: Order[]
  totalCount: number
  pageNumber: number
  pageSize: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface PaymentResponse {
  paymentUrl: string,
  orderCode: string
}

export const ORDER_STATUS: Record<string, string>= {
  "PENDING": 'Đang chờ',
  "CONFIRMED": 'Đã xác nhận',
  "PROCESSING": 'Đang xử lý',
  "SHIPPED": 'Đã giao',
  "DELIVERED": 'Đã nhận',
  "CANCELLED": 'Đã hủy',
}
