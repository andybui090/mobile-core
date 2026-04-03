import axios, { AxiosError, AxiosInstance } from 'axios'

// 👉 base config (sau này thay bằng ENV)
const BASE_URL = 'https://api.example.com'

export const http: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * 👉 REQUEST INTERCEPTOR
 * - attach token
 */
http.interceptors.request.use(
  async (config) => {
    // TODO: attach token từ store / storage
    // const token = getToken()
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }

    return config
  },
  (error) => Promise.reject(error)
)

/**
 * 👉 RESPONSE INTERCEPTOR
 * - normalize response
 * - handle error global
 */
http.interceptors.response.use(
  (response) => {
    // 🔥 luôn return data
    return response.data
  },
  async (error: AxiosError<any>) => {
    const status = error.response?.status

    // 🔐 handle unauthorized
    if (status === 401) {
      // TODO:
      // - refresh token
      // - hoặc logout
      console.log('Unauthorized')
    }

    // 🔥 normalize error
    const normalizedError = {
      status,
      message:
        (error.response?.data as any)?.message ||
        error.message ||
        'Something went wrong',
      data: error.response?.data,
    }

    return Promise.reject(normalizedError)
  }
)