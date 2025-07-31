'use client'

import React, {useState, useEffect} from 'react'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table'
import {Button} from '@/components/ui/button'
import {Pencil, Trash2} from 'lucide-react'
import categoryApi from "@/lib/api/category.api";
import CategoryForm from "@/components/manager/category-form";
import {toast} from "react-toastify";
import Pagination from "@/components/ui/pagination";

interface ProductCategory {
  id: string
  name: string
  desc: string
}

export default function CategoryManager() {
  const [categories, setCategories] = useState<ProductCategory[]>([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null)

  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  const fetchCategories = async () => {
    setLoading(true)
    setError(null)
    try {

      const pageResultResponse = await categoryApi.getCategories({
        pageNumber: pageNumber,
        pageSize: pageSize
      })

      setTotalPages(pageResultResponse.totalPages || 1)
      setCategories(pageResultResponse.items || [])

    } catch (error) {
      console.log("Fetch category error", error)
      setError('Đã xảy ra lỗi khi tải danh mục')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories().then(() => {
    })
  }, [totalPages, pageNumber])

  const handleDelete = async (id: string) => {
    try {
      await categoryApi.deleteCategory(id)
      fetchCategories().then(() => {})
    } catch (error) {
      console.log("Delete category error", error)
      toast.error('Đã xảy ra lỗi khi xóa danh mục')
    }
  }

  const handleSave = () => {
    setIsDialogOpen(false)
    setEditingCategory(null)
    toast.success("Chỉnh sửa danh mục thành công")
    fetchCategories().then(() => {
    })
  }

  return (
    <div className="flex flex-col bg-white border-gray-200 rounded-2xl p-6 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-900">Danh sách danh mục</h2>
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white"
          onClick={() => setIsDialogOpen(true)}
        >
          Thêm danh mục
        </Button>
      </div>
      {loading && <p className="text-center text-gray-500">Đang tải...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && categories.length > 0 && (
        <div className="flex-1 overflow-hidden w-full">
          <div className="overflow-y-auto max-h-[60vh] w-full">

            {!loading && !error && categories.length === 0 && (
              <p className="text-center text-gray-500">Không có danh mục nào</p>
            )}

            { !loading && !error && categories.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/4">Tên</TableHead>
                    <TableHead className="w-2/3">Mô tả</TableHead>
                    <TableHead className="min-w-96 text-center">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="text-gray-900 ">{category.name}</TableCell>
                      <TableCell className="text-gray-600 ">{category.desc}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="mr-2 border-blue-500 text-blue-500 hover:bg-blue-50"
                          onClick={() => {
                            setEditingCategory(category)
                            setIsDialogOpen(true)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-500 text-red-500 hover:bg-red-50"
                          onClick={() => handleDelete(category.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

            )}
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          pageNumber={pageNumber}
          totalPages={totalPages}
          setPageNumber={setPageNumber}
        />
      )}

      <CategoryForm
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setEditingCategory(null)
        }}
        onSave={handleSave}
        category={editingCategory}
      />
    </div>
  )
}