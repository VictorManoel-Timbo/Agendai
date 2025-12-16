class JournalEventOcurrence {
    constructor(
        public id?: number,
        public nome?: string,
        public descricao?: string,
        public id_universidade?: number,
        public data_inicio?: Date | string,
        public data_termino?: Date | string,
        public horario_inicio?: string | null,
        public horario_termino?: string | null,
        public local_padrao?: string,
        public recorrencia?: string | null,
        public categoria?: string,
        public email_proprietario?: string
    ) { }
}

class JournalEvent {
    constructor(
        public local?: string,
        public data?: string,
        public hora?: string,
        public nome?: string,
        public categoria?: string,
        public descricao?: string,
        public recorrencia?: string,
        public horario_inicio?: string,
        public horario_termino?: string,
        public dias?: string[],
        public is_proprietario?: boolean,
        public id_evento?: number
    ) { }
}

export { JournalEventOcurrence, JournalEvent }