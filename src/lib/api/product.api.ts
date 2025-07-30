import axiosInstance from "@/lib/api/axios-client";
import {ProductPageResponse} from "@/lib/types/product.type";

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
  ): Promise<ProductPageResponse> {

    const searchParams = new URLSearchParams();

    if (params.searchName) searchParams.append("searchName", params.searchName);
    if (params.categoryId) searchParams.append("categoryId", params.categoryId);
    if (params.sortBy) searchParams.append("sortBy", params.sortBy);

    searchParams.append("pageNumber", params.pageNumber.toString());
    searchParams.append("pageSize", params.pageSize.toString());

    return await axiosInstance.get<ProductPageResponse>(`${productUrl}/?${searchParams}`, )
  }
}

export default productApi;