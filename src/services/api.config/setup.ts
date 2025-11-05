import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig } from "axios";

function apiConfig(baseUrl: string): AxiosRequestConfig {
    return {
        baseURL: baseUrl
    }
}

function initAxios(config: AxiosRequestConfig, token?: any): AxiosInstance {
    const defineInstance = axios.create(config);
    defineInstance.interceptors.request.use(
        (config) => {
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
            return config
        },
        (error) => Promise.reject(error)
    );

    defineInstance.interceptors.response.use(
        (response) => {
            return response
        },
        (error: AxiosError) => {
            return Promise.reject(error)
        }
    );

    return defineInstance;
}

function api(baseURL = "/api", token?: any) {
    return initAxios(apiConfig(baseURL), token)
}

export default api