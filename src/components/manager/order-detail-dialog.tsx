'use client'

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {Button} from '@/components/ui/button'
import {toast} from 'react-toastify'
import orderApi from '@/lib/api/order.api'
import {useEffect, useState} from 'react'
import {Order} from '@/lib/types/order.type'

interface OrderDetailsDialogProps {
  isOpen: boolean
  onClose: () => void
  order: Order | null
  onStatusUpdate: () => void
}

export default function OrderDetailsDialog(
  {
    isOpen,
    onClose,
    order,
    onStatusUpdate,
  }: OrderDetailsDialogProps
) {
  const [status, setStatus] = useState(order?.status || '')

  useEffect(() => {
    if (order?.status) {
      setStatus(order.status)
    }
  }, [order])

  const handleStatusChange = async () => {
    if (!order) return
    try {
      await orderApi.updateOrderStatus(order.id, status)
      toast.success('Cập nhật trạng thái đơn hàng thành công')
      onStatusUpdate()
    } catch (err) {
      toast.error('Đã xảy ra lỗi khi cập nhật trạng thái')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-white border-gray-200">
        <DialogTitle className="text-2xl font-semibold text-gray-900">
          Chi tiết đơn hàng
        </DialogTitle>
        {order && (
          <>
            <DialogDescription className="text-gray-500 mb-4">
              Mã đơn: {order.id} | Tên người dùng: {order.userName} | Tổng tiền:{' '}
              {order.total.toLocaleString('vi-VN')} VNĐ
            </DialogDescription>

            {/* STATUS CONTROL */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="text-gray-900 font-medium whitespace-nowrap">
                Trạng thái:
              </span>
              <div className={"flex-1 flex justify-end gap-6"}>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger
                    className="w-[200px] bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500">
                    <SelectValue placeholder="Chọn trạng thái"/>
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 text-gray-900">
                    <SelectItem value="PENDING" className="hover:bg-gray-100">
                      Đang chờ
                    </SelectItem>
                    <SelectItem value="SHIPPING" className="hover:bg-gray-100">
                      Đang gửi
                    </SelectItem>
                    <SelectItem value="DELIVERED" className="hover:bg-gray-100">
                      Đã giao
                    </SelectItem>
                    <SelectItem value="Delivered" className="hover:bg-gray-100">
                      Đã nhận
                    </SelectItem>
                    <SelectItem value="CANCELLED" className="hover:bg-gray-100">
                      Đã hủy
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={handleStatusChange}
                >
                  Cập nhật
                </Button>
              </div>
            </div>

            {/* TABLE */}
            <div className="overflow-y-auto max-h-80 border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã sản phẩm</TableHead>
                    <TableHead>Số lượng</TableHead>
                    <TableHead>Đơn giá</TableHead>
                    <TableHead>Tổng</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-gray-900">
                        {item.productId}
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {item.unitPrice.toLocaleString('vi-VN')} VNĐ
                      </TableCell>
                      <TableCell className="text-gray-900">
                        {(item.quantity * item.unitPrice).toLocaleString('vi-VN')}{' '}
                        VNĐ
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
