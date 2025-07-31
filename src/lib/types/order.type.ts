
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