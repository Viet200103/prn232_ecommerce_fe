'use client'

import {useEffect, useState} from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Minus, Plus, X } from 'lucide-react'
import { toast } from 'react-toastify'
import cartApi from '@/lib/api/cart.api'
import {Cart, CartItem} from "@/lib/types/cart.type";
import {useAppContext} from "@/lib/app-context";
import {useRouter} from "next/navigation";

interface CartDetailsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CartDetailsSheet({ open, onOpenChange}: CartDetailsSheetProps) {
  const router = useRouter();

  const { user, setCartCount } = useAppContext()
  const [cart, setCart] = useState<Cart | null>(null)

  const [cartItems, setCartItems] = useState<CartItem[]>( [])
  const [totalAmount, setTotalAmount] = useState<number>( 0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user?.userId) {
      setCart(null)
      return;
    }

    if (open) {
      cartApi.getCart(user?.userId)
        .then(cart => {

          console.log(cart)
          setCart(cart)
          setCartItems(cart?.cartItems ?? [])
          setTotalAmount(cart?.totalAmount ?? 0)

        })
        .catch(error => {
          console.error(error)
        })
    } else  {
      setCart(null)
      setCartItems([])
      setTotalAmount(0)
    }
  }, [open]);

  const handleUpdateQuantity = async (cartItemId: string, currentQuantity: number, delta: number) => {
    if (!user) throw new Error()

    const newQuantity = currentQuantity + delta

    if (newQuantity < 1) return
    setLoading(true)

    try {
      const  result = await cartApi.updateCartItem(user?.userId, cartItemId, newQuantity)
      console.log("Update cart item", result)

      const updatedItems = cartItems.map((item) =>
        item.id === cartItemId
          ? { ...item, quantity: newQuantity, subTotal: item.price * newQuantity }
          : item
      )

      setCartItems(updatedItems)
      setTotalAmount(updatedItems.reduce((sum, item) => sum + item.subTotal, 0))

      if (cart) {
        cart.totalItems += delta;
        setCartCount(cart.totalItems);
      }

    } catch (err) {
      console.log("Update quantity failed", err)
      toast.error('Không đủ hàng tồn kho hoặc có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveItem = async (cartItemId: string) => {
    setLoading(true)
    try {
      if (user == null)  throw new Error()

      const result = await cartApi.removeCartItem(user?.userId, cartItemId)
      console.log("Remove cart item", result)

      const updatedItems = cartItems.filter((item) => {
        if (item.id === cartItemId) {
          if (cart) {
            cart.totalItems -= item.quantity;
            setCartCount(cart.totalItems ?? 0)
          }
          return false;
        }
        return true
      })

      setCartItems(updatedItems)
      setTotalAmount(updatedItems.reduce((sum, item) => sum + item.subTotal, 0))
    } catch (err) {
      console.log("Remove cart item", err)
      toast.error('Có lỗi xảy ra khi xóa mục')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-[540px] bg-white border-gray-200 p-4 sm:p-6">
        <SheetHeader>
          <SheetTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
            Giỏ hàng của tôi
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-250px)] pr-2 mt-6">
          <div className="space-y-4">
            {cartItems.length === 0 ? (
              <p className="text-center text-gray-600">Giỏ hàng trống</p>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="flex-1 text-sm">
                    <div className="font-medium text-gray-900 leading-tight">{item.productName}</div>
                    <div className="text-gray-600 text-xs">SKU: {item.productSKU}</div>
                    <div className="mt-1 text-sm font-semibold text-gray-900">
                      {item.price.toLocaleString('vi-VN')} VNĐ
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6 p-0 border-gray-300 hover:bg-gray-100"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                      disabled={loading || item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm text-gray-600">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6 p-0 border-gray-300 hover:bg-gray-100"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                      disabled={loading}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 p-0 text-gray-600 hover:text-gray-900"
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={loading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        <div className="border-t border-gray-200 mt-6 pt-4 space-y-2 text-sm">
          <div className="flex justify-between font-semibold text-base">
            <span className="text-gray-900">Tổng cộng</span>
            <span className="text-gray-900">{totalAmount.toLocaleString('vi-VN')} VNĐ</span>
          </div>
          <Button
            className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105 transition-transform duration-200"
            disabled={cartItems.length === 0 || loading}
            onClick={() => router.push(`/cart/${cart?.id}/checkout`)}
          >
            Tiến hành đặt hàng
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}