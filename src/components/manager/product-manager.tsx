'use client'

import React, {useState, useEffect} from 'react'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'
import {Pencil, Trash2} from 'lucide-react'
import {toast} from 'react-toastify'
import {Product} from '@/lib/types/product.type'
import productApi from '@/lib/api/product.api'
import categoryApi from '@/lib/api/category.api'
import ProductForm from '@/components/manager/product-form'
import ProductPagination from "@/components/home/product-pagination";

interface ProductCategory {
  id: string
  name: string
  desc: string
}

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await productApi.getProducts({
        pageNumber: pageNumber,
        pageSize: pageSize,
        sortBy: "newest",
        searchName: searchTerm || undefined,
        categoryId: selectedCategory === 'all' ? undefined : selectedCategory,
      })
      setProducts(response.items || [])
      setTotalPages(response.totalPages || 1)
    } catch (err) {
      setError('Đã xảy ra lỗi khi tải sản phẩm')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const data = await categoryApi.getCategories()
      setCategories(data || [])
    } catch (err) {
    }
  }

  useEffect(() => {
    fetchCategories().then(() => {
    })
  }, []);

  useEffect(() => {
    fetchProducts().then(() => {
    })
  }, [searchTerm, selectedCategory, pageNumber, pageSize])

  const handleDelete = async (id: string) => {
    try {
      await productApi.deleteProduct(id)
      setProducts(products.filter((p) => p.id !== id))
      toast.success('Xóa sản phẩm thành công')
    } catch (err) {
      console.log('Delete product', err)
      toast.error('Không thể xóa sản phẩm vì đã tồn tại trong đơn hàng, hoặc có lỗi xảy ra trong quá trình xử lý.')
    }
  }

  const handleSave = () => {
    setIsDialogOpen(false)
    setEditingProduct(null)
    fetchProducts().then(() => {
    })
  }

  return (
    <div className="flex flex-col bg-white border-gray-200 shadow-sm rounded-2xl p-6 max-h-full h-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-2xl font-semibold text-gray-900">Danh sách sản phẩm</h2>
        <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-4xl">
          <Input
            placeholder="Tìm kiếm theo tên hoặc SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
          />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500">
              <SelectValue placeholder="Chọn danh mục"/>
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200 text-gray-900">
              <SelectItem value="all" className="hover:bg-gray-100">Tất cả danh mục</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id} className="hover:bg-gray-100">
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() => setIsDialogOpen(true)}
          >
            Thêm sản phẩm
          </Button>
        </div>
      </div>

      {loading && <p className="text-center text-gray-500">Đang tải...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && products.length > 0 && (
        <div className="flex-1 max-h-[60vh] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Số lượng</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className={"overflow-y-auto"}>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="text-gray-900">{product.name}</TableCell>
                  <TableCell className="text-gray-500">{product.categoryName}</TableCell>
                  <TableCell className="text-gray-500">{product.sku}</TableCell>
                  <TableCell className="text-gray-500">{product.quantity}</TableCell>
                  <TableCell className="text-gray-900">{product.price.toLocaleString('vi-VN')} VNĐ</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2 border-blue-500 text-blue-500 hover:bg-blue-50"
                      onClick={() => {
                        setEditingProduct(product)
                        setIsDialogOpen(true)
                      }}
                    >
                      <Pencil className="h-4 w-4"/>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-500 text-red-500 hover:bg-red-50"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4"/>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

      )}

      {totalPages > 1 && (
        <ProductPagination
          pageNumber={pageNumber}
          totalPages={totalPages}
          setPageNumber={setPageNumber}
        />
      )}

      {!loading && !error && products.length === 0 && (
        <p className="text-center text-gray-500">Không có sản phẩm nào</p>
      )}

      <ProductForm
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setEditingProduct(null)
        }}
        onSave={handleSave}
        product={editingProduct}
      />
    </div>
  )
}