import type { JournalEvent } from "@/models/event.model"
import api from "../api.config/config"
import type { Observable } from "rxjs"

type LocalDate = {
    local: string,
    date: Date
}

export class JournalEventRest {
    private baseUrl: string = '/events'

    create(body: { evento: JournalEvent }): Observable<void | JournalEvent> {
        return api.post(`${this.baseUrl}/`, body)
    }

    addParticipant(id: number, email: string): Observable<void | JournalEvent> {
        return api.post(`${this.baseUrl}/${id}/participants?email_usuario=${email}`, {})
    }

    getEvents(params?: { data?: string, categoria?: string }) {
        return api.get(`${this.baseUrl}/`, params)
    }

    getDetailEvent(id: number) {
        return api.get(`${this.baseUrl}/${id}`)
    }

    getEventOcurrences(id: number) {
        return api.get(`${this.baseUrl}/${id}/ocurrences`)
    }

    getEventParticipants(id: number) {
        return api.get(`${this.baseUrl}/${id}/participants`)
    }

    getOcurrenceDateEvent(id: number, date: Date) {
        return api.get(`${this.baseUrl}/${id}/${date}`)
    }

    updateOcurrenceDateEvent(id: number, date: Date, body: LocalDate) {
        return api.put(`${this.baseUrl}/${id}/${date}`, body)
    }

    delete(id: number) {
        return api.deleteR(`${this.baseUrl}/${id}`)
    }

    removeParticipant(id: number, email: string) {
        return api.deleteR(`${this.baseUrl}/${id}/participants/?email_usuario=${email}`)
    }

    cancelOcurrenceDateEvent(id: number, date: Date) {
        return api.deleteR(`${this.baseUrl}/${id}/${date}`)
    }
}