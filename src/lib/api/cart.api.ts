import axiosInstance from "@/lib/api/axios-client";
import {Product} from "@/lib/types/product.type";
import {Cart} from "@/lib/types/cart.type";
import {AxiosResponse} from "axios";

const cartUrl = "/Cart"

const cartApi = {
  async addToCart(userId: string, product: Product, quantity: number) {

    const payload = {
      productId: product.id,
      productName: product.name,
      productSKU: product.sku,
      price: product.price,
      quantity: quantity
    }

    return  await axiosInstance.post(`${cartUrl}/${userId}/items`, payload)
  },

  async updateCartItem(userId: string, cartItemId: string, quantity: number) {
    const payload = {
      cartItemId: cartItemId,
      quantity: quantity
    }
    return axiosInstance.put(
      `${cartUrl}/${userId}/items`, payload
    )
  },

  async removeCartItem(userId: string, cartItemId: string) {
    const response = await axiosInstance.delete(
      `${cartUrl}/${userId}/items/${cartItemId}`,
    )
    return response
  },

  async getCart(userId: string): Promise<Cart | null> {
    const response: AxiosResponse = await axiosInstance.get(`${cartUrl}/${userId}`);
    const cart = response.data as Cart | null
    return cart ?? null;
  }
}

export default cartApi;