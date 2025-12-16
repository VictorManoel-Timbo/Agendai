import type { Observable } from "rxjs"
import api from "../api.config/config"
import { map } from "rxjs";
import { Student, Teacher, User } from "@/models/user.model"
import type { AuthRequest, AuthResponse } from "@/models/auth.model"

export class AuthRest {
    private baseUrl: string = '/auth'

    private recoveryToken: string = '';

    login(user: AuthRequest): Observable<void | AuthResponse> {
        return api.post(`${this.baseUrl}/login`, user)
    }

    signup(user: Student | Teacher): Observable<any> {
        if (user instanceof Student) {
            return api.post(`${this.baseUrl}/register/aluno`, user)
        }

        return api.post(`${this.baseUrl}/register/professor`, user)
    }


    sendResetCode(email: string) : Observable<any>{
        return api.post(`${this.baseUrl}/request-password-reset`, { email });
    }

    verifyResetCode(code: string): Observable<any> {
            return api.post(`${this.baseUrl}/validate-reset-code`, { code }).pipe(
                map((response: any) => {
                    // Guarda o recovery_token retornado pelo backend
                    if (response && response.recovery_token) {
                        this.recoveryToken = response.recovery_token;
                    }
                    return response;
                })
            );
        }

     resetPassword(newPassword: string, confirmPassword: string): Observable<any> {
        if (!this.recoveryToken) {
            throw new Error('Token de recuperação não encontrado. Valide o código primeiro.');
        }
    
        return api.post(
            `${this.baseUrl}/reset-password`,
            { 
                new_password: newPassword,
                confirm_password: confirmPassword
            },
            undefined, // params
            undefined, // baseURL
            { headers: { 'X-Recovery-Token': this.recoveryToken } } // config
        ).pipe(
            map((response: any) => {
                this.recoveryToken = '';
                return response;
            })
        );
    }

    clearRecoveryToken(): void{
        this.recoveryToken='';
    }
    
    
}