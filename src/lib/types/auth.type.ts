

interface AuthenticatedUser {

}

interface RegisterResponse {
  userId: string;
  email: string;
  role: string;
}

interface LoginResponse {
  token: string;
  role: string;
}