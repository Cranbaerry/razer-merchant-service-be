import { UserWithoutPassword } from '~libs/entities';

declare module 'express' {
  export interface Request {
    User: UserWithoutPassword;
    token: string;
  }
}
