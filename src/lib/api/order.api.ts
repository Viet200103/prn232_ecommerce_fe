import axios, {AxiosResponse} from 'axios'
import axiosInstance from "@/lib/api/axios-client";
import {OrderResponse} from "@/lib/types/order.type";
import {Cart} from "@/lib/types/cart.type";

const orderUrl = '/orders'

const orderApi = {

  async getOrders(
    params: {
      search?: string
      status?: string
      createdFrom?: string
      createdTo?: string
      pageNumber: number
      pageSize: number
      sortBy?: string
      sortDescending?: boolean
    }
  ): Promise<OrderResponse> {

    const searchParams = new URLSearchParams()
    if (params.search) searchParams.append('search', params.search)
    if (params.status) searchParams.append('status', params.status)
    if (params.createdFrom) searchParams.append('createdFrom', params.createdFrom)
    if (params.createdTo) searchParams.append('createdTo', params.createdTo)
    searchParams.append('pageNumber', params.pageNumber.toString())
    searchParams.append('pageSize', params.pageSize.toString())
    if (params.sortBy) searchParams.append('sortBy', params.sortBy)
    searchParams.append('sortDescending', params.sortDescending ? 'true' : 'false')

    return await axiosInstance.get(`${orderUrl}`)
  },

  async createOrder(
    userId: string,
    userName: string,
    cart: Cart
  ) {
    const items = cart.cartItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.price,
    }))

    const orderData = {
      userId: userId,
      userName: userName,
      items: items
    }

    const { id } = await axiosInstance.post<{
      id: string
    }>(`${orderUrl}`, orderData)

    return id
  },

  async updateOrderStatus(id: string, status: string) {
    return await axios.put(
      `${orderUrl}/${id}`,
      { status }
    )
  },

}

export default orderApi