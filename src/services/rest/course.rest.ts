import type { Observable } from "rxjs"
import api from "../api.config/config"
import type { Course } from "@/models/couse.model"

type FilterCourse = {
    graduacao: boolean | null,
    id_universidade: number
}

export class CourseRest {
    private baseUrl: string = '/courses'

    getCourses(params: FilterCourse): Observable<Course> {
        return api.get(`${this.baseUrl}/`, params)
    }
}