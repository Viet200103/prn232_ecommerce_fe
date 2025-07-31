'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye } from 'lucide-react'
import { toast } from 'react-toastify'
import orderApi from '@/lib/api/order.api'
import {Order} from "@/lib/types/order.type";
import OrderDetailsDialog from "@/components/manager/order-detail-dialog";

export default function OrderManager() {
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const fetchOrders = async () => {
    // setLoading(true)
    // setError(null)
    // try {
    //   const response = await orderApi.getOrders({
    //     search: searchTerm || undefined,
    //     pageNumber: 1,
    //     pageSize: 20,
    //   })
    //   setOrders(response.data.items || [])
    // } catch (err) {
    //   setError('Đã xảy ra lỗi khi tải đơn hàng')
    //   toast.error('Đã xảy ra lỗi khi tải đơn hàng')
    // } finally {
    //   setLoading(false)
    // }
  }

  useEffect(() => {
    fetchOrders()
  }, [searchTerm])

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsDialogOpen(true)
  }

  const handleStatusUpdate = () => {
    fetchOrders()
  }

  // Client-side filtering for instant feedback
  const filteredOrders: Order[] = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="bg-white border-gray-200 shadow-sm rounded-2xl p-6 h-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-2xl font-semibold text-gray-900">Danh sách đơn hàng</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Tìm kiếm theo mã đơn hoặc tên người dùng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      {loading && <p className="text-center text-gray-500">Đang tải...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && filteredOrders.length === 0 && (
        <p className="text-center text-gray-500">Không có đơn hàng nào</p>
      )}
      {!loading && !error && filteredOrders.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã đơn</TableHead>
              <TableHead>Tên người dùng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="text-gray-900">{order.id}</TableCell>
                <TableCell className="text-gray-500">{order.userName}</TableCell>
                <TableCell className="text-gray-500">{order.status}</TableCell>
                <TableCell className="text-gray-900">{order.total.toLocaleString('vi-VN')} VNĐ</TableCell>
                <TableCell className="text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-blue-500 text-blue-500 hover:bg-blue-50"
                    onClick={() => handleViewDetails(order)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <OrderDetailsDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setSelectedOrder(null)
        }}
        order={selectedOrder}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  )
}