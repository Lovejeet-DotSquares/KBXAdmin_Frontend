import axios, { AxiosError, type AxiosInstance } from "axios";

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface IApiListResult<T = any> {
  totalCount: number;
  items: T[];
}

class ApiUtility {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL, // <-- Use your API base URL
      timeout: 10000,
    });

    // Automatically attach JWT token
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Auto logout on 401
    this.client.interceptors.response.use(
      (res) => res,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("jwtToken");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  // -----------------------------
  // GET (raw data)
  // -----------------------------
  get = async <T>(url: string, params?: any): Promise<T> => {
    const res = await this.client.get<T>(url, { params });
    return res.data;
  };

  // -----------------------------
  // GET (IApiResponse format)
  // -----------------------------
  getResult = async <T>(url: string, params?: any): Promise<T> => {
    const res = await this.client.get<IApiResponse<T>>(url, { params });
    return res.data.data;
  };

  // -----------------------------
  // POST
  // -----------------------------
  post = async <T>(url: string, body?: any): Promise<IApiResponse<T>> => {
    const res = await this.client.post<IApiResponse<T>>(url, body);
    return res.data;
  };

  // -----------------------------
  // PUT
  // -----------------------------
  put = async <T>(url: string, body?: any): Promise<IApiResponse<T>> => {
    const res = await this.client.put<IApiResponse<T>>(url, body);
    return res.data;
  };

  // -----------------------------
  // DELETE
  // -----------------------------
  delete = async <T>(url: string, params?: any): Promise<IApiResponse<T>> => {
    const res = await this.client.delete<IApiResponse<T>>(url, { params });
    return res.data;
  };

  // -----------------------------
  // POST FORM DATA
  // -----------------------------
  postForm = async <T>(
    url: string,
    payload: Record<string, any>
  ): Promise<IApiResponse<T>> => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value as any);
    });

    const res = await this.client.post<IApiResponse<T>>(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  };

  // -----------------------------
  // DOWNLOAD FILE
  // -----------------------------
  downloadFile = async (url: string, params?: any): Promise<Blob> => {
    const res = await this.client.get(url, {
      params,
      responseType: "blob",
    });
    return res.data;
  };

  // -----------------------------
  // SAVE TOKEN
  // -----------------------------
  saveToken(token: string) {
    localStorage.setItem("jwtToken", token);
  }

  // -----------------------------
  // LOGOUT
  // -----------------------------
  logout() {
    localStorage.removeItem("jwtToken");
    window.location.href = "/login";
  }
}

export default new ApiUtility();
