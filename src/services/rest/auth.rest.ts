import type { Observable } from "rxjs"
import api from "../api.config/config"
import { Student, Teacher, User } from "@/models/user.model"
import type { AuthRequest, AuthResponse } from "@/models/auth.model"

export class AuthRest {
    private baseUrl: string = '/auth'

    login(user: AuthRequest): Observable<void | AuthResponse> {
        return api.post(`${this.baseUrl}/login`, user)
    }

    signup(user: Student | Teacher): Observable<any> {
        if (user instanceof Student) {
            return api.post(`${this.baseUrl}/register/aluno`, user)
        }

        return api.post(`${this.baseUrl}/register/professor`, user)
    }
}