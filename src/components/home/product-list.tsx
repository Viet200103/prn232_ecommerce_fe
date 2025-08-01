'use client'

import ProductCard from "@/components/home/product-card";
import {Product} from "@/lib/types/product.type";

interface ProductListProps {
  products: Product[]
  loading: boolean
  error: string | null
}

export default function ProductList({ products, loading, error }: ProductListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {loading && <p className="text-center text-gray-500 col-span-full">Đang tải...</p>}
      {error && <p className="text-center text-red-500 col-span-full">{error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="text-center text-gray-500 col-span-full">Không tìm thấy sản phẩm nào.</p>
      )}
      {!loading && !error && products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}