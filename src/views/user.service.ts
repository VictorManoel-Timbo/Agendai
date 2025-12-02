import { UserRest } from "@/services/rest/user.rest"
import { Observable, Subject } from "rxjs"

export class UserService {
    constructor(private _user = new UserRest()) { }

    private user$: Subject<any> = new Subject<any>()

    user: Observable<any> = this.user$.asObservable()

    getUser(): void {
        this._user.getUser()
            .pipe()
            .subscribe({
                next: (response: any) => {
                    this.user$.next(response)
                },
                error: (err) => {
                    this.user$.next(err)
                }
            })
    }
}