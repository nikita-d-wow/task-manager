export interface User {
  id?: string;
  username: string;
  email: string;
  avatar?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Credentials {
  email: string;
  password: string;
}
