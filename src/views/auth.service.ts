import type { AuthRequest } from "@/models/auth.model"
import type { Student, Teacher } from "@/models/user.model"
import { AuthRest } from "@/services/rest/auth.rest"
import { Observable, Subject } from "rxjs"

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
                next: (response) => {
                    this.auth$.next(response)
                },
                error: (err) => {
                    this.auth$.next(err)
                }
            })
    }
}