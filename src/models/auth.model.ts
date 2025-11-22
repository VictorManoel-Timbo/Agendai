class AuthRequest {
    constructor(
        public email?: string,
        public password?: string
    ) { }
}

class AuthResponse {
    constructor(
        public email?: string,
        public token?: string
    ) { }
}

export { AuthRequest, AuthResponse }