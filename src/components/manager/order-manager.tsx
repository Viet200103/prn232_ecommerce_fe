'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { ArrowUpDown, Eye } from 'lucide-react'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import orderApi from '@/lib/api/order.api'
import {Order, ORDER_STATUS} from "@/lib/types/order.type";
import OrderDetailsDialog from "@/components/manager/order-detail-dialog";
import Pagination from "@/components/ui/pagination";

export default function OrderManager() {
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
  const [createdFrom, setCreatedFrom] = useState<Date | undefined>(undefined)
  const [createdTo, setCreatedTo] = useState<Date | undefined>(undefined)
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [hasPreviousPage, setHasPreviousPage] = useState(false)
  const [sortBy, setSortBy] = useState('CreatedAt')
  const [sortDescending, setSortDescending] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const fetchOrders = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await orderApi.getOrders({
        search: searchTerm || undefined,
        status: statusFilter || undefined,
        createdFrom: createdFrom ? createdFrom.toISOString() : undefined,
        createdTo: createdTo ? createdTo.toISOString() : undefined,
        pageNumber,
        pageSize,
        sortBy,
        sortDescending,
      })
      setOrders(data.orders || [])
      setTotalPages(Math.ceil(data.totalCount /data.pageSize) || 1)
      setHasNextPage(data.hasNextPage)
      setHasPreviousPage(data.hasPreviousPage)
    } catch (error) {
      console.log("Loading order", error)
      setError('Đã xảy ra lỗi khi tải đơn hàng')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders().then(() => {})
  }, [searchTerm, statusFilter, createdFrom, createdTo, pageNumber, sortBy, sortDescending])

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsDialogOpen(true)
  }

  const handleStatusUpdate = () => {
    fetchOrders().then(() => {})
  }

  return (
    <div className="bg-white border-gray-200 shadow-sm rounded-2xl p-6 h-full flex flex-col">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Danh sách đơn hàng</h2>
      <div className="w-full mb-4">
        <div className="flex flex-wrap lg:flex-nowrap lg:flex-row items-center justify-center gap-4 w-full">
          <Input
            placeholder="Tìm kiếm theo mã đơn hoặc tên người dùng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 flex-1 min-w-[200px]"
          />

          <Select
            value={statusFilter || 'all'}
            onValueChange={(value) => setStatusFilter(value === 'all' ? undefined : value)}
          >
            <SelectTrigger
              className="bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 max-w-52">
              <SelectValue placeholder="Trạng thái"/>
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200 text-gray-900">
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              {Object.entries(ORDER_STATUS).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger
              className="bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 max-w-52">
              <SelectValue placeholder="Sắp xếp theo"/>
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200 text-gray-900">
              <SelectItem value="CreatedAt">Ngày tạo</SelectItem>
              <SelectItem value="Total">Tổng tiền</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="border-gray-300 text-gray-900 hover:bg-gray-100 min-w-[120px]"
              >
                {createdFrom ? format(createdFrom, 'dd/MM/yyyy', {locale: vi}) : 'Từ ngày'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="bg-white border-gray-200">
              <Calendar
                mode="single"
                selected={createdFrom}
                onSelect={setCreatedFrom}
                locale={vi}
                className="rounded-md border-gray-200"
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="border-gray-300 text-gray-900 hover:bg-gray-100 min-w-[120px]"
              >
                {createdTo ? format(createdTo, 'dd/MM/yyyy', {locale: vi}) : 'Đến ngày'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="bg-white border-gray-200">
              <Calendar
                mode="single"
                selected={createdTo}
                onSelect={setCreatedTo}
                locale={vi}
                className="rounded-md border-gray-200"
              />
            </PopoverContent>
          </Popover>

          <Button
            variant="outline"
            className="border-gray-300 text-gray-900 hover:bg-gray-100 min-w-[110px] flex items-center justify-center"
            onClick={() => setSortDescending(!sortDescending)}
          >
            <ArrowUpDown className="h-4 w-4 mr-2"/>
            {sortDescending ? 'Giảm dần' : 'Tăng dần'}
          </Button>
        </div>
      </div>

      {loading && <p className="text-center text-gray-500">Đang tải...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && orders.length === 0 && (
        <p className="text-center text-gray-500">Không có đơn hàng nào</p>
      )}
      {!loading && !error && orders.length > 0 && (
        <>
          <div className={"flex-1"}>
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
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="text-gray-900">{order.id}</TableCell>
                    <TableCell className="text-gray-500">{order.userName}</TableCell>
                    <TableCell className="text-gray-500">{ORDER_STATUS[order.status]}</TableCell>
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
                        <Eye className="h-4 w-4"/>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Pagination pageNumber={pageNumber} totalPages={totalPages} setPageNumber={setPageNumber}/>
        </>
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