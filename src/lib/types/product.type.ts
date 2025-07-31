import {z} from "zod";

export interface Product {
  id: string;
  name: string;
  desc: string;
  sku: string;
  price: number;
  categoryId: string;
  categoryName: string;
  inventoryId: string;
  quantity: number;
  createdAt: string;
  modifiedAt: string | null;
};

export interface ProductCategory  {
  id: string;
  name: string;
  desc: string;
  createdAt: string;
  modifiedAt: string | null;
};

export interface PageResultResponse<T> {
  items: T[];
  totalPages: number;
  pages: number;
}

export const categorySchema = z.object({
  name: z.string().min(1, { message: 'Tên danh mục không được để trống' }).trim(),
  desc: z.string().min(1, { message: 'Mô tả không được để trống' }).trim(),
})

export type CreateCategoryModel = z.infer<typeof categorySchema>

export const productSchema = z.object({
  name: z.string().min(1, { message: 'Tên sản phẩm không được để trống' }).trim(),
  desc: z.string().min(1, { message: 'Mô tả không được để trống' }).trim(),
  sku: z.string().min(1, { message: 'SKU không được để trống' }).trim(),
  categoryId: z.string().min(1, { message: 'Vui lòng chọn danh mục' }),
  quantity: z.number().min(0, { message: 'Số lượng phải lớn hơn hoặc bằng 0' }),
  price: z.number().min(0, { message: 'Giá phải lớn hơn hoặc bằng 0' }),
})

export  type ProductFormValues = z.infer<typeof productSchema>
