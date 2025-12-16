import type { JournalEventOcurrence, JournalEvent } from "@/models/event.model"
import api from "../api.config/config"
import type { Observable } from "rxjs"

type LocalDate = {
    local: string,
    data: string,
    horario_inicio: string | null,
    horario_termino: string | null
}

export class JournalEventRest {
    private baseUrl: string = '/events'

    create(body: { evento: JournalEventOcurrence }): Observable<void | JournalEventOcurrence> {
        return api.post(`${this.baseUrl}/`, body)
    }

    addParticipant(id: number, email: string): Observable<any> {
        return api.post(`${this.baseUrl}/${id}/participants?email_usuario=${email}`, {})
    }

    getEvents(params?: { data?: string, categoria?: string }): Observable<void | JournalEvent> {
        return api.get(`${this.baseUrl}/`, params)
    }

    getDetailEvent(id: number): Observable<void | JournalEventOcurrence> {
        return api.get(`${this.baseUrl}/${id}`)
    }

    getEventOcurrences(id: number): Observable<void | JournalEvent> {
        return api.get(`${this.baseUrl}/${id}/ocurrences`)
    }

    getEventParticipants(id: number): Observable<any> {
        return api.get(`${this.baseUrl}/${id}/participants`)
    }

    getOcurrenceDateEvent(id: number, date: string): Observable<void | JournalEvent> {
        return api.get(`${this.baseUrl}/${id}/${date}`)
    }

    updateOcurrenceDateEvent(id: number, date: string, body: LocalDate): Observable<any> {
        return api.put(`${this.baseUrl}/${id}/${date}`, body)
    }

    delete(id: number): Observable<any> {
        return api.deleteR(`${this.baseUrl}/${id}`)
    }

    removeParticipant(id: number, email: string): Observable<any> {
        return api.deleteR(`${this.baseUrl}/${id}/participants?email_usuario=${email}`)
    }

    cancelOcurrenceDateEvent(id: number, date: string): Observable<any> {
        return api.deleteR(`${this.baseUrl}/${id}/${date}`)
    }
}