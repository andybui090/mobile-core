import axios, { AxiosResponse, AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'

export const DEFAULT_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

const DEFAULT_CONFIG = {
  timeout: 20000, // 20s default for regular API calls
}

export const NONE = null
export const CLIENT_ERROR = 'CLIENT_ERROR'
export const SERVER_ERROR = 'SERVER_ERROR'
export const TIMEOUT_ERROR = 'TIMEOUT_ERROR'
export const CONNECTION_ERROR = 'CONNECTION_ERROR'
export const NETWORK_ERROR = 'NETWORK_ERROR'
export const UNKNOWN_ERROR = 'UNKNOWN_ERROR'
export const CANCEL_ERROR = 'CANCEL_ERROR'

const TIMEOUT_ERROR_CODES = ['ECONNABORTED']
const NODEJS_CONNECTION_ERROR_CODES = ['ENOTFOUND', 'ECONNREFUSED', 'ECONNRESET']
const STATUS_ERROR_CODES = ['ERR_BAD_REQUEST', 'ERR_BAD_RESPONSE']

const isWithin = (min: number, max: number, value: number) => value >= min && value <= max
const in200s = (n: number) => isWithin(200, 299, n)
const in400s = (n: number) => isWithin(400, 499, n)
const in500s = (n: number) => isWithin(500, 599, n)

const isPromise = (obj: any) => !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function'

export const getProblemFromStatus = (status?: number | null) => {
  if (!status) return UNKNOWN_ERROR
  if (in200s(status)) return NONE
  if (in400s(status)) return CLIENT_ERROR
  if (in500s(status)) return SERVER_ERROR
  return UNKNOWN_ERROR
}

export const getProblemFromError = (error: any) => {
  if (error?.message === 'Network Error') return NETWORK_ERROR
  if (axios.isCancel && axios.isCancel(error)) return CANCEL_ERROR
  if (!error?.code) return getProblemFromStatus(error?.response?.status ?? null)
  if (STATUS_ERROR_CODES.includes(error.code)) return getProblemFromStatus(error.response?.status)
  if (TIMEOUT_ERROR_CODES.includes(error.code)) return TIMEOUT_ERROR
  if (NODEJS_CONNECTION_ERROR_CODES.includes(error.code)) return CONNECTION_ERROR
  return UNKNOWN_ERROR
}

type Monitor = (response: any) => void

interface CreateHttpClientOptions {
  baseURL?: string
  headers?: Record<string, any>
  timeout?: number
}

const createHttpClient = (options: CreateHttpClientOptions = {}) => {
  const { baseURL = '', headers: customHeaders = {}, timeout } = options

  const config: AxiosRequestConfig = {
    baseURL,
    headers: {
      ...DEFAULT_HEADERS,
      ...customHeaders,
    },
  }

  const headers: Record<string, any> = { ...config.headers }
  const configWithoutHeaders = { ...config, headers: undefined }
  const combinedConfig = { ...DEFAULT_CONFIG, ...configWithoutHeaders }
  if (timeout !== undefined) combinedConfig.timeout = timeout
  const instance: AxiosInstance = axios.create(combinedConfig)

  const monitors: Monitor[] = []
  const addMonitor = (m: Monitor) => monitors.push(m)

  const requestTransforms: Array<(req: AxiosRequestConfig) => void> = []
  const asyncRequestTransforms: Array<(req: AxiosRequestConfig) => Promise<void> | void> = []
  const responseTransforms: Array<(resp: any) => void> = []
  const asyncResponseTransforms: Array<(resp: any) => Promise<void> | void> = []

  const addRequestTransform = (t: (req: AxiosRequestConfig) => void) => requestTransforms.push(t)
  const addAsyncRequestTransform = (t: (req: AxiosRequestConfig) => Promise<void> | void) => asyncRequestTransforms.push(t)
  const addResponseTransform = (t: (resp: any) => void) => responseTransforms.push(t)
  const addAsyncResponseTransform = (t: (resp: any) => Promise<void> | void) => asyncResponseTransforms.push(t)

  const setHeader = (name: string, value: any) => {
    headers[name] = value
    instance.defaults.headers.common[name] = value
    return instance
  }

  const setHeaders = (hs: Record<string, any>) => {
    Object.keys(hs).forEach(k => setHeader(k, hs[k]))
    return instance
  }

  const deleteHeader = (name: string) => {
    delete headers[name]
    delete instance.defaults.headers.common[name]
    return instance
  }

  const getHeaders = (): Record<string, any> => headers

  const setBaseURL = (newURL: string) => {
    instance.defaults.baseURL = newURL
    return instance
  }

  const getBaseURL = () => instance.defaults.baseURL

  // cancel map for takeLatest per-key
  const controllers = new Map<string, AbortController>()

  const doRequest = async (axiosRequestConfig: AxiosRequestConfig & { cancelKey?: string } = {}) => {
    axiosRequestConfig.headers = { ...headers, ...axiosRequestConfig.headers }

    // apply sync request transforms
    requestTransforms.forEach(t => t(axiosRequestConfig))

    // apply async request transforms
    for (let i = 0; i < asyncRequestTransforms.length; i++) {
      const t = asyncRequestTransforms[i](axiosRequestConfig)
      if (isPromise(t)) await t
    }

    // handle cancellation takeLatest by key
    const key = (axiosRequestConfig as any).cancelKey as string | undefined
    if (key) {
      const prev = controllers.get(key)
      if (prev) prev.abort()
      const controller = new AbortController()
      controllers.set(key, controller)
      ;(axiosRequestConfig as any).signal = controller.signal
    }

    const startedAt = Date.now()

    const convert = async (result: AxiosResponse | AxiosError) => {
      const end = Date.now()
      const duration = end - startedAt
      const isError = result instanceof Error || axios.isCancel(result)
      const axiosResponse = result as AxiosResponse
      const axiosError = result as AxiosError
      const response = isError ? axiosError.response : axiosResponse
      const status = (response && response.status) ?? null
      const problem = isError ? getProblemFromError(result) : getProblemFromStatus(status as number)
      const originalError = isError ? axiosError : null
      const ok = in200s(status as number)
      const cfg = (result as any)?.config ?? null
      const respHeaders = (response && response.headers) ?? null
      const data = (response && (response as any).data) ?? null

      let transformed = { duration, problem, originalError, ok, status, headers: respHeaders, config: cfg, data }
      responseTransforms.forEach(t => t(transformed))
      for (let i = 0; i < asyncResponseTransforms.length; i++) {
        const t = asyncResponseTransforms[i](transformed)
        if (isPromise(t)) await t
      }
      return transformed
    }

    try {
      const res = await instance.request(axiosRequestConfig)
      const our = await convert(res)
      monitors.forEach(m => {
        try {
          m(our)
        } catch (e) {}
      })
      return our
    } catch (err) {
      const our = await convert(err as any)
      monitors.forEach(m => {
        try {
          m(our)
        } catch (e) {}
      })
      return our
    } finally {
      if (key) controllers.delete(key)
    }
  }

  const doRequestWithoutBody = (method: string) => (url: string, params = {}, cfg = {}) => {
    return doRequest({ ...cfg, url, params, method })
  }

  const doRequestWithBody = (method: string) => (url: string, data: any, cfg = {}) => {
    return doRequest({ ...cfg, url, method, data })
  }

  return {
    instance,
    monitors,
    addMonitor,
    requestTransforms,
    asyncRequestTransforms,
    responseTransforms,
    asyncResponseTransforms,
    addRequestTransform,
    addAsyncRequestTransform,
    addResponseTransform,
    addAsyncResponseTransform,
    setHeader,
    setHeaders,
    deleteHeader,
    getHeaders,
    setBaseURL,
    getBaseURL,
    any: doRequest,
    get: doRequestWithoutBody('get'),
    delete: doRequestWithoutBody('delete'),
    head: doRequestWithoutBody('head'),
    post: doRequestWithBody('post'),
    put: doRequestWithBody('put'),
    patch: doRequestWithBody('patch'),
  }
}

export const { isCancel } = axios

export default createHttpClient
