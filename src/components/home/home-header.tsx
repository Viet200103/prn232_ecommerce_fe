'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { useAppContext } from '@/lib/app-context'

export default function HomeHeader() {
  const { isAuthenticated, user, logout } = useAppContext()
  const isManager = user?.role === "Manager"

  const handleLogout = () => {
    logout()
  }

  return (
    <nav className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
      <h1 className="text-3xl font-bold text-gray-900">Sản phẩm</h1>
      <div className="flex items-center gap-4">
        {!isManager && (
          <Link href="/cart" className="flex items-center text-gray-600 hover:text-blue-500">
            <ShoppingCart className="h-6 w-6 mr-2" />
            <span>Giỏ hàng (0)</span>
          </Link>
        )}
        {isManager && (
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Link href={"/manager/products"}>Bảng điều khiển</Link>
          </Button>
        )}
        {isAuthenticated ? (
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-blue-500 text-blue-500 hover:bg-blue-50"
          >
            Đăng xuất
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              asChild
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Link href="/login">Đăng nhập</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-blue-500 text-blue-500 hover:bg-blue-50"
            >
              <Link href="/register">Đăng ký</Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}