import type { AuthResponse } from "@/models/auth.model"
import { ToastHandler } from "@/utils/toast-handler.util"
import { TokenUtil } from "@/utils/token.util"
import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig } from "axios"

function apiConfig(baseUrl: string): AxiosRequestConfig {
    return {
        baseURL: baseUrl,
    }
}

function initAxios(config: AxiosRequestConfig): AxiosInstance {
    const defineInstance = axios.create(config)
    defineInstance.interceptors.request.use(
        async (request) => {
            const expired = TokenUtil.isTokenExpired()

            if (expired) {
                const refreshToken = TokenUtil.getRefreshToken()
                if (!refreshToken) {
                    TokenUtil.clearToken()
                    TokenUtil.clearRefreshToken()
                    return request
                }
                try {
                    const refreshResponse = await axios.post<AuthResponse>(
                        "/api/auth/refresh",
                        {}, { headers: { Authorization: `Bearer ${refreshToken}` } }
                    )

                    TokenUtil.initialize(refreshResponse.data)
                    request.headers = request.headers || {}
                    request.headers.Authorization = `Bearer ${refreshResponse.data.access_token}`

                    ToastHandler.info("Sessão renovada.")
                } catch (err) {
                    ToastHandler.error("Não foi possível renovar a sessão.")
                    TokenUtil.clearToken()
                    TokenUtil.clearRefreshToken()
                }
            } else {
                const accessToken = TokenUtil.getAccessToken()
                if (accessToken) {
                    request.headers = request.headers || {}
                    request.headers.Authorization = `Bearer ${accessToken}`
                }
            }

            return request
        },
        (error) => {
            ToastHandler.handleError(error)
            Promise.reject(error)
        }
    )

    defineInstance.interceptors.response.use(
        (response) => {
            return response
        },
        (error: AxiosError) => {
            ToastHandler.handleError(error)
            return Promise.reject(error)
        }
    )

    return defineInstance
}

function api(baseURL = "/api") {
    return initAxios(apiConfig(baseURL))
}

export default api