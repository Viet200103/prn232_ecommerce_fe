import {CreateCategoryModel, PageResultResponse, ProductCategory} from "@/lib/types/product.type";
import axiosInstance from "@/lib/api/axios-client";

const categoryUrl = "/categories"

const categoryApi = {

  async getCategories(params?: {
    searchName?: string,
    pageNumber?: number,
    pageSize?: number,
  }): Promise<PageResultResponse<ProductCategory>> {
    const searchParams = new URLSearchParams();

    if (params?.searchName) searchParams.append("searchName", params.searchName);

    searchParams.append("pageSize", (params?.pageSize ?? 10).toString());
    searchParams.append("pageNumber", (params?.pageNumber ?? 1).toString());

    return await axiosInstance.get<PageResultResponse<ProductCategory>>(`${categoryUrl}?${searchParams.toString()}`);
  },

  async createCategory(data: CreateCategoryModel) {
    return await axiosInstance.post(`${categoryUrl}`, data)
  },

  async updateCategory(id: string, data: CreateCategoryModel) {
    return await axiosInstance.put(`${categoryUrl}/${id}`, data)
  },

  async deleteCategory(id: string) {
    return await axiosInstance.delete(`${categoryUrl}/${id}`);
  }
}

export default categoryApi