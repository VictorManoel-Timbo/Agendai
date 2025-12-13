import type { AuthRequest } from "@/models/auth.model"
import type { Student, Teacher } from "@/models/user.model"
import { AuthRest } from "@/services/rest/auth.rest"
import { Observable, Subject } from "rxjs"
import { tap } from "rxjs/operators"


export class AuthService {
    constructor(private _auth = new AuthRest()) { }

    private auth$: Subject<any> = new Subject<any>()

    auth: Observable<any> = this.auth$.asObservable()

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
                next: (response: any) => {
                    this.auth$.next(response)
                },
                error: (err) => {
                    this.auth$.next(err)
                }
            })
    }

    sendResetCode(email: string): Observable<any> {
        return this._auth.sendResetCode(email)
            .pipe(
                tap({
                    next: (response: any) => this.auth$.next(response),
                    error: (err: any) => this.auth$.next(err)
                })
            )
    }

    verifyResetCode(code: string): Observable<any> {
        return this._auth.verifyResetCode(code)
            .pipe(
                tap({
                    next: (response: any) => this.auth$.next(response),
                    error: (err: any) => this.auth$.next(err)
                })
            )
    }

    resetPassword(newPassword: string, confirmPassword: string): Observable<any> {
        return this._auth.resetPassword(newPassword, confirmPassword)
            .pipe(
                tap({
                    next: (response: any) => this.auth$.next(response),
                    error: (err: any) => this.auth$.next(err)
                })
            )
    }

    clearRecoveryToken(): void {
        this._auth.clearRecoveryToken()
    }
}