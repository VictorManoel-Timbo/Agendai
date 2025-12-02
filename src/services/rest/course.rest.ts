import type { Observable } from "rxjs"
import api from "../api.config/config"
import type { Course } from "@/models/couse.model"

interface FilterCourse {
    graduacao: boolean | null,
    id_universidade: number
}

export class CourseRest {

    getCourses(params: FilterCourse): Observable<Course> {
        return api.get('courses/', params)
    }
}