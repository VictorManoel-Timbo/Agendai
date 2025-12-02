class User {
    constructor(
        public id?: number,
        public nome?: string,
        public senha?: string,
        public email?: string,
        public cpf?: string,
    ) { }
}

class Teacher extends User {
    constructor(
        public idUsuario?: number,
        public idUniversidade?: number,
        public nome?: string,
        public senha?: string,
        public email?: string,
        public cpf?: string
    ) {
        super(idUsuario, nome, email, cpf)
    }
}

class Student extends User {
    constructor(
        public idUsuario?: number,
        public idCurso?: number,
        public matricula?: string,
        public nome?: string,
        public senha?: string,
        public email?: string,
        public cpf?: string
    ) {
        super(idUsuario, nome, senha, email, cpf)
    }
}

export { Student, Teacher, User }