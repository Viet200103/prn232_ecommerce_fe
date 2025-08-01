'use client'

import {useRouter} from 'next/navigation'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table'
import {Button} from '@/components/ui/button'
import {Cart} from "@/lib/types/cart.type";
import HomeHeader from "@/components/home/home-header";
import cartApi from "@/lib/api/cart.api";
import {useAppContext} from "@/lib/app-context";
import {useEffect, useState, useTransition} from "react";
import {toast} from "react-toastify";
import orderApi from "@/lib/api/order.api";
import paymentApi from "@/lib/api/payment.api";

export default function CheckoutPage() {
  const router = useRouter()
  const {user} = useAppContext();

  const [loading, setLoading] = useState<boolean>(false)
  const [cart, setCart] = useState<Cart | null>(null)

  const [processing, startProcessing] = useTransition();

  useEffect(() => {
    setLoading(true)

    if (!user) {
      setLoading(false)
      return
    }

    cartApi.getCart(user?.userId)
      .then(cart => {

        console.log(cart)
        setCart(cart)
      })
      .catch(error => {
        console.error(error)
      })
      .finally(() => setLoading(false))

  }, [user]);

  if (loading || cart === null) {
    return (
      <p className={"w-full text-center mt-32"}>Đang tải dữ liệu</p>
    )
  }

  const handleOrder = () => {
    startProcessing(async () => {
      try {
        const orderId = await orderApi.createOrder(user?.userId ?? "", user?.email ?? "", cart,)
        console.log("Order id", orderId)
        const paymentResponse = await  paymentApi.createPayment(orderId);
        window.location.href = paymentResponse.paymentUrl;
      } catch (err) {
        console.error(err)
        toast.error('Có lỗi xảy ra khi đặt hàng')
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 px-4 py-8 flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
        <HomeHeader/>

        <Card className="bg-white shadow-none w-full max-w-4xl rounded-lg mx-auto mt-4">

          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">Thông tin đơn hàng</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-6 h-full">
              {/* Cart Summary */}
              <div className="space-y-4 w-full">
                <h3 className="font-semibold text-gray-900">Danh sách sản phẩm</h3>

                <div className="overflow-x-auto border border-gray-200 rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="min-w-[150px] text-gray-900">Tên sản phẩm</TableHead>
                        <TableHead className="min-w-[100px] text-gray-900">SKU</TableHead>
                        <TableHead className="min-w-[100px] text-gray-900">Đơn giá</TableHead>
                        <TableHead className="min-w-[80px] text-gray-900">Số lượng</TableHead>
                        <TableHead className="min-w-[100px] text-gray-900">Tổng</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cart.cartItems.map((item, index) => (
                        <TableRow key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <TableCell className="text-gray-900">{item.productName}</TableCell>
                          <TableCell className="text-gray-600">{item.productSKU}</TableCell>
                          <TableCell className="text-gray-600">{item.price.toLocaleString('vi-VN')} VNĐ</TableCell>
                          <TableCell className="text-gray-600">{item.quantity}</TableCell>
                          <TableCell className="text-gray-900">{item.subTotal.toLocaleString('vi-VN')} VNĐ</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="text-gray-600 flex flex-col gap-2">
                <div className="flex justify-between">
                  <span>Tổng số sản phẩm:</span>
                  <span>{cart.totalItems}</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-900">
                  <span>Tổng tiền:</span>
                  <span>{cart.totalAmount.toLocaleString('vi-VN')} VNĐ</span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white transform transition-transform"
                disabled={loading || cart.cartItems.length === 0 || processing}
                onClick={handleOrder}
              >
                Tiến hành thanh toán
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}