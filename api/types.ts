import {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';


export interface ApiResponse<T = any> {
  duration: number;
  problem: string;
  originalError: AxiosError | null;
  ok: boolean;
  status: number | null;
  headers: Record<string, any> | null;
  config: AxiosRequestConfig | null;
  data: T | null;
}

export interface ApiInstance {
  axiosInstance: AxiosInstance;
  monitors: Array<(response: ApiResponse) => void>;
  addMonitor: (monitor: (response: ApiResponse) => void) => void;
  requestTransforms: Array<(config: AxiosRequestConfig) => AxiosRequestConfig>;
  asyncRequestTransforms: Array<
    (
      config: AxiosRequestConfig
    ) => Promise<AxiosRequestConfig> | AxiosRequestConfig
  >;
  responseTransforms: Array<(response: ApiResponse) => void>;
  asyncResponseTransforms: Array<
    (response: ApiResponse) => Promise<void> | void
  >;
  addRequestTransform: (
    transform: (config: AxiosRequestConfig) => AxiosRequestConfig
  ) => void;
  addAsyncRequestTransform: (
    transform: (
      config: AxiosRequestConfig
    ) => Promise<AxiosRequestConfig> | AxiosRequestConfig
  ) => void;
  addResponseTransform: (transform: (response: ApiResponse) => void) => void;
  addAsyncResponseTransform: (
    transform: (response: ApiResponse) => Promise<void> | void
  ) => void;
  setHeader: (name: string, value: string) => ApiInstance;
  setHeaders: (headers: Record<string, string>) => ApiInstance;
  deleteHeader: (name: string) => ApiInstance;
  setBaseURL: (newURL: string) => ApiInstance;
  getBaseURL: () => string | undefined;
  any: (config: AxiosRequestConfig) => Promise<ApiResponse>;
  get: (
    url: string,
    params?: Record<string, any>,
    axiosConfig?: AxiosRequestConfig
  ) => Promise<ApiResponse>;
  delete: (
    url: string,
    params?: Record<string, any>,
    axiosConfig?: AxiosRequestConfig
  ) => Promise<ApiResponse>;
  head: (
    url: string,
    params?: Record<string, any>,
    axiosConfig?: AxiosRequestConfig
  ) => Promise<ApiResponse>;
  post: (
    url: string,
    data: any,
    axiosConfig?: AxiosRequestConfig
  ) => Promise<ApiResponse>;
  put: (
    url: string,
    data: any,
    axiosConfig?: AxiosRequestConfig
  ) => Promise<ApiResponse>;
  patch: (
    url: string,
    data: any,
    axiosConfig?: AxiosRequestConfig
  ) => Promise<ApiResponse>;
  link: (
    url: string,
    params?: Record<string, any>,
    axiosConfig?: AxiosRequestConfig
  ) => Promise<ApiResponse>;
  unlink: (
    url: string,
    params?: Record<string, any>,
    axiosConfig?: AxiosRequestConfig
  ) => Promise<ApiResponse>;
}




export interface CreateConfig extends AxiosRequestConfig {
  axiosInstance?: AxiosInstance;
}

export interface CreateFunction {
  (config: CreateConfig): ApiInstance;
}