import type { JournalEventOcurrence } from "@/models/event.model"
import { JournalEventRest } from "@/services/rest/events.rest"
import { BehaviorSubject, Observable } from "rxjs"

export class JournalEventService {
    constructor(private _event = new JournalEventRest()) { }

    private event$: BehaviorSubject<any> = new BehaviorSubject<any>([])
    private participants$: BehaviorSubject<any> = new BehaviorSubject<any>([])

    event: Observable<any> = this.event$.asObservable()
    participants: Observable<any> = this.participants$.asObservable()

    create(body: { evento: JournalEventOcurrence }): void {
        this._event.create(body)
            .pipe()
            .subscribe({
                next: (response) => {
                    this.event$.next(response)
                },
                error: (err) => {
                    this.event$.next(err)
                }
            })
    }

    addParticipant(id: number, email: string): void {
        this._event.addParticipant(id, email)
            .pipe()
            .subscribe({
                next: (response: any) => {
                    this.participants$.next(response)
                },
                error: (err) => {
                    this.participants$.next(err)
                }
            })
    }

    getEvents(params?: { data?: string, categoria?: string }): void {
        this._event.getEvents(params)
            .pipe()
            .subscribe({
                next: (response: any) => {
                    this.event$.next(response)
                },
                error: (err) => {
                    this.event$.next(err)
                }
            })
    }

    getDetailEvent(id: number): void {
        this._event.getDetailEvent(id)
            .pipe()
            .subscribe({
                next: (response: any) => {
                    this.event$.next(response)
                },
                error: (err) => {
                    this.event$.next(err)
                }
            })
    }

    getEventOcurrences(id: number): void {
        this._event.getEventOcurrences(id)
            .pipe()
            .subscribe({
                next: (response: any) => {
                    this.event$.next(response)
                },
                error: (err) => {
                    this.event$.next(err)
                }
            })
    }

    getEventParticipants(id: number): void {
        this._event.getEventParticipants(id)
            .pipe()
            .subscribe({
                next: (response: any) => {
                    this.participants$.next(response)
                },
                error: (err) => {
                    this.participants$.next(err)
                }
            })
    }

    getOcurrenceDateEvent(id: number, date: Date): void {
        this._event.getOcurrenceDateEvent(id, date)
            .pipe()
            .subscribe({
                next: (response: any) => {
                    this.event$.next(response)
                },
                error: (err) => {
                    this.event$.next(err)
                }
            })
    }

    updateOcurrenceDateEvent(id: number, date: Date, body: { local: string, date: Date }): void {
        this._event.updateOcurrenceDateEvent(id, date, body)
            .pipe()
            .subscribe({
                next: (response: any) => {
                    this.event$.next(response)
                },
                error: (err) => {
                    this.event$.next(err)
                }
            })
    }

    delete(id: number): void {
        this._event.delete(id)
            .pipe()
            .subscribe({
                next: (response: any) => {
                    this.event$.next(response)
                },
                error: (err) => {
                    this.event$.next(err)
                }
            })
    }

    removeParticipant(id: number, email: string): void {
        this._event.removeParticipant(id, email)
            .pipe()
            .subscribe({
                next: (response: any) => {
                    this.event$.next(response)
                },
                error: (err) => {
                    this.event$.next(err)
                }
            })
    }

    cancelOcurrenceDateEvent(id: number, date: Date): void {
        this._event.cancelOcurrenceDateEvent(id, date)
            .pipe()
            .subscribe({
                next: (response: any) => {
                    this.event$.next(response)
                },
                error: (err) => {
                    this.event$.next(err)
                }
            })
    }
}