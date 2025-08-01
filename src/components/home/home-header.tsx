'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { useAppContext } from '@/lib/app-context'
import CartDetailsSheet from "@/components/home/cart-details-sheet";
import {useState} from "react";
import {usePathname} from "next/navigation";

export default function HomeHeader() {
  const pathName= usePathname();
  const { isAuthenticated, user, logout, cartCount } = useAppContext()
  const [isOpenCart, setIsOpenCart] = useState<boolean>(false)
  const isManager = user?.role === "Manager"

  const handleLogout = () => {
    logout()
  }

  return (
    <>
      <nav className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <Link href={"/"}>
          <h1 className="text-3xl font-bold text-gray-900">SShop</h1>
        </Link>
        <div className="flex items-center gap-4">
        {!isManager && !pathName.endsWith("checkout") && (
            <div
              onClick={() => setIsOpenCart(true)}
              className="flex items-center text-gray-600 hover:text-blue-500"
            >
              <ShoppingCart className="h-6 w-6 mr-2" />
              <span>Giỏ hàng ({cartCount})</span>
            </div>
          )}
          {isManager && (
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 transform hover:scale-105 transition-transform duration-200"
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
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 transform hover:scale-105 transition-transform duration-200"
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

      <CartDetailsSheet open={isOpenCart} onOpenChange={setIsOpenCart}/>
    </>
  )
}