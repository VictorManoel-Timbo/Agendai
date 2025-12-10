export class JournalEvent {
    constructor(
        public id?: number,
        public nome?: string,
        public descricao?: string,
        public id_universidade?: number,
        public data_inicio?: Date | string,
        public data_termino?: Date | string,
        public horario_inicio?: string,
        public horario_termino?: string,
        public local_padrao?: string,
        public recorrencia?: string,
        public categoria?: string,
        public email_proprietario?: string
    ) { }
}