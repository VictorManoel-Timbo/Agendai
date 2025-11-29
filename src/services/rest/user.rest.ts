import type { User } from "@/models/user.model"
import type { Observable } from "rxjs"
import api from "../api.config/config"

export class UserRest {
    
    getUser(): Observable<User> {
        return api.get('users/me')
    }
}