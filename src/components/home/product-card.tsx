'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {Product} from "@/lib/types/product.type";

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="bg-white border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">{product.name}</CardTitle>
        <p className="text-gray-500 text-sm">{product.categoryName}</p>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-2">{product.desc}</p>
        <p className="text-gray-500 text-sm">Mã SKU: {product.sku}</p>
        <p className="text-gray-500 text-sm">Số lượng: {product.quantity}</p>
        <p className="text-gray-900 font-semibold mt-2">
          Giá: {product.price.toLocaleString('vi-VN')} VNĐ
        </p>
        <Button
          className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white"
          disabled={product.quantity <= 0}
        >
          Thêm vào giỏ hàng
        </Button>
      </CardContent>
    </Card>
  )
}