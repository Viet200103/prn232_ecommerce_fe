import axios from 'axios'
import axiosInstance from "@/lib/api/axios-client";

const orderUrl = '/orders'

const orderApi = {

  async getOrders(params: { search?: string; pageNumber: number; pageSize: number }) {
    const searchParams = new URLSearchParams()
    if (params.search) searchParams.append('search', params.search)
    searchParams.append('pageNumber', params.pageNumber.toString())
    searchParams.append('pageSize', params.pageSize.toString())

    return await axiosInstance.get(`${orderUrl}`)
  },

  async updateOrderStatus(id: string, status: string) {
    return await axios.put(
      `${orderUrl}/${id}`,
      { status },
      { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
    )
  },

}

export default orderApi