import { User } from '@prisma/client';
export * from './pagination';
export * from './enums';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export type UserWithoutPassword = Omit<User, 'password' | 'token'>;

export { User };
