import {CreateCategoryModel, ProductCategory} from "@/lib/types/product.type";
import axiosInstance from "@/lib/api/axios-client";

const categoryUrl = "/categories"

const categoryApi = {
  async getCategories(searchName?: string): Promise<ProductCategory[]>{
    const searchParams = new URLSearchParams(searchName);
    return await axiosInstance.get<ProductCategory[]>(`${categoryUrl}/${searchParams.toString()}`);
  },

  async createCategory(data: CreateCategoryModel) {
    return await axiosInstance.post(`${categoryUrl}`, data)
  },

  async updateCategory(id: string, data: CreateCategoryModel) {
    return await axiosInstance.put(`${categoryUrl}/${id}`, data)
  },

  async deleteCategory(id: string) {
    return await axiosInstance.delete(`${categoryUrl}?id=${id}`);
  }
}

export default categoryApi