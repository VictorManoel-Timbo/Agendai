class User {
    constructor(
        public id?: number,
        public name?: string,
        public password?: string,
        public email?: string,
        public cpf?: string,
    ) { }
}

class Teacher extends User {
    constructor(
        public userId?: number,
        public universityId?: number,
        public hireDate?: Date,
        public degree?: string,
        public name?: string,
        public password?: string,
        public email?: string,
        public cpf?: string
    ) {
        super(userId, name, email, cpf)
    }
}

class Student extends User {
    constructor(
        public userId?: number,
        public courseId?: number,
        public registration?: string,
        public name?: string,
        public password?: string,
        public email?: string,
        public cpf?: string
    ) {
        super(userId, name, password, email, cpf)
    }
}

export { Student, Teacher, User }