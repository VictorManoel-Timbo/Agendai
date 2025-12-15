import type { AuthRequest } from "@/models/auth.model"
import type { Student, Teacher } from "@/models/user.model"
import { AuthRest } from "@/services/rest/auth.rest"
import { Observable, Subject } from "rxjs"

export class AuthService {
    constructor(private _auth = new AuthRest()) { }

    private auth$: Subject<any> = new Subject<any>()
    private resetCode$: Subject<any> = new Subject<any>()
    private verifyCode$: Subject<any> = new Subject<any>()
    private resetPassword$: Subject<any> = new Subject<any>()

    auth: Observable<any> = this.auth$.asObservable()
    resetCode: Observable<any> = this.resetCode$.asObservable()
    verifyCode: Observable<any> = this.verifyCode$.asObservable()
    resetPasswordObs: Observable<any> = this.resetPassword$.asObservable()

    login(user: AuthRequest): void {
        this._auth.login(user)
            .pipe()
            .subscribe({
                next: (response) => {
                    this.auth$.next(response)
                },
                error: (err) => { 
                    this.auth$.next(err) 
                }
            })
    }

    signup(user: Student | Teacher): void {
        this._auth.signup(user)
            .pipe()
            .subscribe({
                next: (response) => {
                    this.auth$.next(response)
                },
                error: (err) => {
                    this.auth$.next(err)
                }
            })
    }

    sendResetCode(email: string): void {
        this._auth.sendResetCode(email)
        .pipe()
        .subscribe({
            next: (response: any) => {
                this.resetCode$.next({ success: true, data: response })
            },
            error: (err) => {
                this.resetCode$.next({ success: false, error: err })
            }
        })
    }

    verifyResetCode(code: string): void {
        this._auth.verifyResetCode(code)
        .pipe()
        .subscribe({
            next: (response: any) => {
                this.verifyCode$.next({ success: true, data: response })
            },
            error: (err) => {
                this.verifyCode$.next({ success: false, error: err })
            }
        })
    }

    resetPassword(newPassword: string, confirmPassword: string): void {
        this._auth.resetPassword(newPassword, confirmPassword)
        .pipe()
        .subscribe({
            next: (response: any) => {
                this.resetPassword$.next({ success: true, data: response })
            },
            error: (err) => {
                this.resetPassword$.next({ success: false, error: err })
            }
        })
    }

    clearRecoveryToken(): void {
        this._auth.clearRecoveryToken()
    }
}