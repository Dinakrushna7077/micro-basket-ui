export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  userName: string;
  userEmail: string;
  role: string;
}
export interface RegisterRequest {
  userName: string;
  userAdd: string;
  userPhone: string;
  userEmail: string;
  password: string;
}
