import {ProductCategory} from "@/lib/types/product.type";
import axiosInstance from "@/lib/api/axios-client";

const categoryUrl = "/categories"

const categoryApi = {
  async getCategories(searchName?: string): Promise<ProductCategory[]>{
    const searchParams = new URLSearchParams(searchName);
    return await axiosInstance.get<ProductCategory[]>(`${categoryUrl}/${searchParams.toString()}`);
  }
}

export default categoryApi