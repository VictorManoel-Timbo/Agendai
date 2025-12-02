class AuthRequest {
    constructor(
        public email?: string,
        public password?: string
    ) { }
}

class AuthResponse {
    constructor(
        public access_token?: string,
        public refresh_token?: string,
        public token_type?: string
    ) { }
}

export { AuthRequest, AuthResponse }