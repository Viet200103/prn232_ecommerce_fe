import axiosInstance from "@/lib/api/axios-client";
import {PaymentResponse} from "@/lib/types/order.type";

const paymentUrl = "/payment"

const paymentApi = {

  async createPayment(orderId: string): Promise<PaymentResponse> {
    return await axiosInstance.post(`${paymentUrl}/create/${orderId}`)
  }

}

export default paymentApi;