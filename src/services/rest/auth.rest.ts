import type { Observable } from "rxjs"
import api from "../api.config/config"
import type { Student, Teacher } from "@/models/user.model"
import type { AuthRequest, AuthResponse } from "@/models/auth.model"

export class AuthRest {
    baseUrl: string = '/auth'

    login(user: AuthRequest): Observable<void | AuthResponse> {
        return api.post(`${this.baseUrl}/login`, user)
    }

    signup(user: Student | Teacher): Observable<any> {
        return api.post(`${this.baseUrl}/register`, user)
    }
}