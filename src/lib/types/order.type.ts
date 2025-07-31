
export interface Order {
  id: string
  userId: string
  userName: string
  status: string // e.g., "Pending", "Processing", "Shipped", "Delivered", "Cancelled"
  total: number
  items: { id: string; productId: string; quantity: number; unitPrice: number }[]
  paymentId: string
  createdAt: string
  updatedAt: string
}