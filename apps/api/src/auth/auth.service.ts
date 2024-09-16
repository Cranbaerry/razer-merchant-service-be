import { Injectable, UnauthorizedException } from '@nestjs/common';
import { db } from '~api/db';
import { UserWithoutPassword } from '~libs/entities';

@Injectable()
export class AuthService {
  async validate(accessToken: string): Promise<UserWithoutPassword> {
    const session = await db.userSession.findFirst({
      where: { token: accessToken },
      select: {
        User: true,
      },
    });
    if (!session?.User) throw new UnauthorizedException();
    return {
      id: session.User.id,
      email: session.User.email,
      created_at: session.User.created_at,
      updated_at: session.User.updated_at,
      is_admin: session.User.is_admin,
    };
  }
}
