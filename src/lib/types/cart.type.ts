export interface CartItem {
  id: string
  productId: string
  productName: string
  productSKU: string
  price: number
  quantity: number
  subTotal: number
  createdAt: string
  modifiedAt: string | null
}

export interface Cart {
  id: string
  userId: string
  totalAmount: number
  totalItems: number
  createdAt: string
  modifiedAt: string
  cartItems: CartItem[]
}