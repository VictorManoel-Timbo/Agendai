import type { AuthResponse } from '@/models/auth.model'
import { jwtDecode } from 'jwt-decode'

export class TokenUtil {

    private static TOKEN_KEY = 'token'
    private static REFRESH_KEY = 'refresh_token'

    static initialize(response: AuthResponse): void {
        if (!response?.access_token || !response?.refresh_token) {
            return
        }
        this.storeToken(response.access_token)
        this.storeRefreshToken(response.refresh_token)
        this.processDecodedToken(response.access_token)
    }

    private static storeToken(token: string): void {
        const expirationDate = new Date()
        expirationDate.setHours(expirationDate.getHours() + 1)

        document.cookie =
            `${this.TOKEN_KEY}=${token}; ` +
            `path=/; ` +
            `SameSite=Strict; ` +
            `Secure; ` +
            `expires=${expirationDate.toUTCString()}`
    }

    private static storeRefreshToken(refresh: string): void {
        const expiration = new Date()
        expiration.setHours(expiration.getHours() + 3)

        document.cookie =
            `${this.REFRESH_KEY}=${refresh}; ` +
            `path=/; ` +
            `SameSite=Strict; ` +
            `Secure; ` +
            `expires=${expiration.toUTCString()}`
    }

    static getAccessToken(): string | null {
        return this.getCookie(this.TOKEN_KEY)
    }

    static getRefreshToken(): string | null {
        return this.getCookie(this.REFRESH_KEY)
    }

    private static getCookie(name: string): string | null {
        const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
        return match ? match[2] : null
    }

    static clearToken(): void {
        document.cookie = `${this.TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict`
    }

    static clearRefreshToken(): void {
        document.cookie = `${this.REFRESH_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict`
    }

    private static processDecodedToken(token: string): void {
        try {
            const decoded: any = jwtDecode(token)

            this.storeUserRole(decoded)
        }
        catch (err) {
            this.clearToken()
        }
    }

    private static storeUserRole(decodedToken: any): void {
        if (!decodedToken) return

        if (decodedToken.tag === 'universidade') {
            sessionStorage.setItem("role", 'admin')
        }

        if (decodedToken.tag === 'aluno') {
            sessionStorage.setItem("role", 'student')
        }

        if (decodedToken.tag === 'professor') {
            sessionStorage.setItem("role", 'teacher')
        }
    }

    static isTokenExpired(): boolean {
        const token = this.getAccessToken()
        if (!token) return true

        try {
            const decoded: any = jwtDecode(token)
            const now = Date.now() / 1000
            return decoded.exp < now
        } catch {
            return true
        }
    }
}
