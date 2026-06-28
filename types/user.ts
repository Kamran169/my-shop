export type UserRole = 'CUSTOMER' | 'ADMIN'

export interface User {
  id: number
  name: string
  email: string
  phone?: string
  image?: string
  role: UserRole
  createdAt: Date
}

export interface UserSession {
  id: string
  name: string
  email: string
  role: UserRole
}
