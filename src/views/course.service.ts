import { CourseRest } from "@/services/rest/course.rest"
import { Observable, Subject } from "rxjs"

export class CourseService {
    constructor(private _course = new CourseRest()) { }

    private course$: Subject<any> = new Subject<any>()

    course: Observable<any> = this.course$.asObservable()

    getCourses(filter: { graduacao: boolean | null, id_universidade: number }): void {
        this._course.getCourses(filter)
            .pipe()
            .subscribe({
                next: (response) => {
                    this.course$.next(response)
                },
                error: (err) => {
                    this.course$.next(err)
                }
            })
    }
}