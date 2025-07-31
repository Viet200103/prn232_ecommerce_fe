'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import categoryApi from "@/lib/api/category.api";
import {Product, ProductCategory, ProductFormValues, productSchema} from "@/lib/types/product.type";
import productApi from "@/lib/api/product.api";
import {toast} from "react-toastify";

interface ProductFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  product: Product | null
}

export default function ProductForm({ isOpen, onClose, onSave, product }: ProductFormProps) {
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [error, setError] = useState<string | null>(null)

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema)
  })

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        desc: product.desc,
        sku: product.sku,
        categoryId: product.categoryId,
        quantity: product.quantity,
        price: product.price,
      })
    } else {
      form.reset({
        name: '',
        desc: '',
        sku: '',
        categoryId: '',
        quantity: 0,
        price: 0,
      })
    }
  }, [product, form])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getCategories({
          pageNumber: 1,
          pageSize: 100
        })
        setCategories(response.items || [])
      } catch (err) {
        console.log("Load category", err)
        setError('Đã xảy ra lỗi khi tải danh mục')
      }
    }
    fetchCategories()
      .then(() => {})
  }, [])

  const onSubmit = async (data: ProductFormValues) => {
    try {
      if (product) {
        // Update product
        await productApi.updateProduct(product.id, data)
        toast.success('Cập nhập sản phẩm thành công')
      } else {
        // Create product
        await productApi.createProduct(data)
        form.reset();
        toast.success('Lưu sản phẩm thành công')
      }
      onSave()
    } catch (err) {
      console.log("Create product error", err)
      toast.error('Đã xảy ra lỗi khi lưu sản phẩm')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-gray-900">{product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900">Tên sản phẩm</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập tên sản phẩm"
                      {...field}
                      className="bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900">Mô tả</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập mô tả sản phẩm"
                      {...field}
                      className="bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900">SKU</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập SKU"
                      {...field}
                      className="bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900">Danh mục</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500">
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-300 text-gray-900">
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id} className="hover:bg-gray-100">
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900">Số lượng</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Nhập số lượng"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900">Giá (VNĐ)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Nhập giá"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                className="border-gray-300 text-gray-900 hover:bg-gray-100"
                onClick={onClose}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Lưu
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}