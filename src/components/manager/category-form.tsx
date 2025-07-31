'use client'

import {useEffect, useState} from 'react'
import {useForm} from 'react-hook-form'
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'

import categoryApi from '@/lib/api/category.api'
import {
  CreateCategoryModel,
  categorySchema
} from '@/lib/types/product.type'

interface ProductCategory {
  id: string
  name: string
  desc: string
}

interface CategoryFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  category: ProductCategory | null
}

export default function CategoryForm(
  {
    isOpen,
    onClose,
    onSave,
    category
  }: CategoryFormProps
) {
  const [error, setError] = useState<string | null>(null)

  const form = useForm<CreateCategoryModel>({
    resolver: zodResolver(categorySchema)
  })

  // Cập nhật form khi category thay đổi
  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        desc: category.desc
      })
    } else {
      form.reset({
        name: '',
        desc: ''
      })
    }
  }, [category, form])

  const onSubmit = async (data: CreateCategoryModel) => {
    try {
      if (category) {
        // Cập nhật danh mục
        await categoryApi.updateCategory(category.id, data)
      } else {
        // Tạo mới danh mục
        await categoryApi.createCategory(data)
      }
      onSave()
    } catch (error) {
      console.log('CreateCategoryError', error)
      setError('Đã xảy ra lỗi khi lưu danh mục')
    }
  }

  const onDialogClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onDialogClose}>
      <DialogContent className="bg-white border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-gray-900">
            {category ? 'Chỉnh sửa danh mục' : 'Thêm danh mục'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <FormField
              control={form.control}
              name="name"
              render={({field}) => (
                <FormItem>
                  <FormLabel className="text-gray-900">Tên danh mục</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập tên danh mục"
                      {...field}
                      className="bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500"/>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="desc"
              render={({field}) => (
                <FormItem>
                  <FormLabel className="text-gray-900">Mô tả</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập mô tả danh mục"
                      {...field}
                      className="bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500"/>
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
