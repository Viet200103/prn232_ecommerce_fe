

export interface AuthenticatedUser {
  role: string;
}

export interface RegisterResponse {
  userId: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  role: string;
}

export interface RawJwtPayload {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string
  exp: number
  iss: string
  aud: string
}

export interface JwtPayload {
  email: string
  role: string
  exp: number
  iss: string
  aud: string
}