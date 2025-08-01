'use client'

import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {Product} from "@/lib/types/product.type";
import {ShoppingCart} from "lucide-react";
import {Input} from "@/components/ui/input";
import {toast} from "react-toastify";
import {useState} from "react";
import {cn} from "@/lib/utils";
import cartApi from "@/lib/api/cart.api";
import {useAppContext} from "@/lib/app-context";

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const appContext = useAppContext();

  const handleAddToCart = async () => {
    setLoading(true)

    if (appContext.user === null) {
      // show dialog redirect login
      toast.info("Vui lòng đăng nhập để thêm vào giỏ hàng");
      setLoading(false); // fix: đảm bảo loading dừng lại
      return;
    }

    try {
      const  result = await cartApi.addToCart( appContext.user?.userId, product, quantity)
      if (typeof result === 'object' && result !== null && 'success' in result && result.success === true) {
        console.log("add to cart success", result)
        appContext.setCartCount(appContext.cartCount + 1);
        toast.success('Thêm vào giỏ hàng thành công')
        return;
      }
      throw Error();
    } catch (err) {
      console.log("Add to cart error", err)
      toast.error('Không đủ hàng tồn kho hoặc có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-white border-gray-200 shadow-sm rounded-lg hover:shadow-md transition-shadow duration-200">
      <CardHeader className={"mt-4 mb-3 py-0"}>
        <CardTitle className="text-gray-900">{product.name}</CardTitle>
        <p className="text-gray-500 text-sm">Loại: {product.categoryName}</p>
      </CardHeader>
      <CardContent className={"px-6 py-0 mb-4"}>
        <p className="text-gray-600 mb-3">{product.desc}</p>
        <p className="text-gray-500 text-sm">Mã SKU: {product.sku}</p>
        <p className="text-gray-500 text-sm">Số lượng: {product.quantity}</p>
        <p className="text-gray-900 font-semibold mt-2">
          Giá: {product.price.toLocaleString('vi-VN')} VNĐ
        </p>
      </CardContent>

      <CardFooter className={"flex flex-col items-start gap-2"}>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
          <Input
            type="number"
            min="1"
            max={product.quantity}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="flex-1 w-full sm:w-24 bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
          <Button
            className="flex-1 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 transform hover:scale-105 transition-transform duration-200"
            onClick={handleAddToCart}
            disabled={loading || product.quantity === 0}
          >
            <ShoppingCart className="h-4 w-4"/>
            Thêm vào giỏ
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}