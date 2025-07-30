// lib/axios-client.ts
import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosInstance as AxiosType, AxiosError,
} from "axios";

type RequestConfig = AxiosRequestConfig;

class AxiosInstance {

  api: AxiosType;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_SSHOP_BASE_URL,
      timeout: 10000,
    });

    this.api.interceptors.request.use(
      (config) => {
        const token = typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;

        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  async get<T = any>(url: string, config?: RequestConfig): Promise<T> {
    const res = await this.api.get<T>(url, config);
    return res.data;
  }

  async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    const res = await this.api.post<T>(url, data, config);
    return res.data;
  }

  async put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    const res = await this.api.put<T>(url, data, config);
    return res.data;
  }

  async patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    const res = await this.api.patch<T>(url, data, config);
    return res.data;
  }

  async delete<T = any>(url: string, config?: RequestConfig): Promise<T> {
    const res = await this.api.delete<T>(url, config);
    return res.data;
  }

  async request<T>(method: string, url: string, config?: RequestConfig): Promise<AxiosResponse<T>> {
    return this.api.request<T>({
      method,
      url,
      ...config,
    });
  }

  public setTimeout(timeout: number): void {
    this.api.defaults.timeout = timeout;
  }
}

const axiosInstance = new AxiosInstance();
export default axiosInstance;
