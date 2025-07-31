import axiosInstance from "@/lib/api/axios-client";
import {ProductFormValues, PageResultResponse, Product} from "@/lib/types/product.type";

const productUrl = "/products"

const productApi = {

  async getProducts(
    params: {
      searchName?: string;
      categoryId?: string;
      sortBy?: string;
      pageNumber: number;
      pageSize: number;
    }
  ): Promise<PageResultResponse<Product>> {

    const searchParams = new URLSearchParams();

    if (params.searchName) searchParams.append("searchName", params.searchName);
    if (params.categoryId) searchParams.append("categoryId", params.categoryId);
    if (params.sortBy) searchParams.append("sortBy", params.sortBy);

    searchParams.append("pageNumber", params.pageNumber.toString());
    searchParams.append("pageSize", params.pageSize.toString());

    return await axiosInstance.get<PageResultResponse<Product>>(`${productUrl}/?${searchParams}`, )
  },

  async createProduct(data: ProductFormValues) {
    return await axiosInstance.post(`${productUrl}`, data)
  },

  async updateProduct(id: string, data: ProductFormValues) {
    return await axiosInstance.put(`${productUrl}/${id}`, data)
  },

  async deleteProduct(id: string) {
    return await axiosInstance.delete(`${productUrl}/${id}`);
  }
}

export default productApi;