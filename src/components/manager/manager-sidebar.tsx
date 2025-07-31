'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import {usePathname, useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {useAppContext} from "@/lib/app-context";


export default function ManagerSidebar() {
  const appContext = useAppContext();
  const router = useRouter();

  const pathname = usePathname()

  const navItems = [
    { href: '/manager/products', label: 'Sản phẩm' },
    { href: '/manager/categories', label: 'Danh mục' },
    { href: '/manager/orders', label: 'Đơn hàng' },
  ]

  return (
    <aside className="hidden lg:flex md:w-64 bg-white border-gray-200 shadow-sm rounded-2xl p-4 my-4 flex-col">
      <nav className="space-y-2 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'block px-4 py-2 rounded-md text-gray-900 hover:bg-blue-100 hover:text-blue-500',
              pathname === item.href ? 'bg-blue-500 text-white hover:bg-blue-600' : ''
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <Button variant={"outline"} className={"w-full"} onClick={() => {
        appContext.logout()
        router.push("/login")
      }}>
        Đăng Xuất
      </Button>
    </aside>
  )
}