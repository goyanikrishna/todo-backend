export interface CreateUserPayload {
    name: string;
    phone: string;
    email: string;
    role: string;
    password: string;
    birthday?: Date;
  }
  
  export interface UpdateUserPayload {
    name?: string;
    phone?: string;
    email?: string;
  }
  