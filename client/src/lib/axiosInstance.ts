import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios";


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";


interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
}


interface QueueEntry {
  resolve: (value: string | PromiseLike<string | null> | null) => void;
  reject: (reason?: unknown) => void;
}


const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});


// ✅ Attach token before request
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);


let isRefreshing = false;
let queue: QueueEntry[] = [];


function processQueue(error: unknown, token: string | null = null): void {
  queue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  queue = [];
}


axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequest;


    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string | null>((resolve, reject) => {
          queue.push({ resolve, reject });
        }).then((token) => {
          if (token) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return axiosInstance(originalRequest);
        });
      }


      originalRequest._retry = true;
      isRefreshing = true;


      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token found");


        const res = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        const { token, refreshToken: newRefreshToken } = res.data as {
          token: string;
          refreshToken: string;
        };


        localStorage.setItem("auth_token", token);
        localStorage.setItem("refreshToken", newRefreshToken);


        processQueue(null, token);


        originalRequest.headers.Authorization = `Bearer ${token}`;


        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err);
        localStorage.clear();
        console.warn("⚠️ Token refresh failed — logging out.");
        window.location.replace("/login");
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }


    return Promise.reject(error);
  }
);


export default axiosInstance;

