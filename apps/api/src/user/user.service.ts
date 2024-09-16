import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { db } from '~api/db';
import bcrypt from 'bcrypt';
import { RegisterUserDto } from './user.dto';
import { OnEmitEvent } from '~api/services/event';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

export enum UserEventType {
  SignUp = 'sign-up',
}

interface BaseUserEvent {
  type: UserEventType;
  user_id: number;
}
export interface SignUpEvent extends BaseUserEvent {
  type: UserEventType.SignUp;
  email: string;
}
export type UserEvent = SignUpEvent;

async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

async function comparePassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}

@Injectable()
export class UserService implements OnEmitEvent<UserEvent> {
  constructor(
    private readonly jwtService: JwtService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public emitEvent(event: UserEvent): void {
    this.eventEmitter.emit(event.type, event);
  }

  @OnEvent(UserEventType.SignUp, { async: true })
  async handleSignUpEvent(event: SignUpEvent) {
    console.log('User signed up', event);
  }

  private async generateToken(id: number) {
    const token = this.jwtService.sign(
      {
        id: id,
      },
      { secret: process.env.JWT_SECRET, expiresIn: process.env.JWT_EXPIRES_IN },
    );
    await db.userSession.create({
      data: {
        token: token,
        user_id: id,
      },
    });
    return token;
  }

  async login(email: string, password: string): Promise<string> {
    const resp = await db.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
      },
      select: {
        email: true,
        password: true,
        id: true,
      },
    });
    if (!resp) throw new UnauthorizedException();

    const isMatch = await comparePassword(password, resp.password);
    if (!isMatch) throw new UnauthorizedException();

    return await this.generateToken(resp.id);
  }

  async register(dto: RegisterUserDto) {
    const userExists = await db.user.findFirst({
      where: {
        email: {
          equals: dto.email,
          mode: 'insensitive',
        },
      },
      select: {
        email: true,
      },
    });

    if (userExists)
      throw new BadRequestException('Your email is already registered');

    const user = await db.user.create({
      data: {
        email: dto.email,
        password: await hashPassword(dto.password),
      },
      select: {
        id: true,
        email: true,
      },
    });
    this.emitEvent({
      type: UserEventType.SignUp,
      email: user.email,
      user_id: user.id,
    });
  }

  async changePassword(userId: number, newPassword: string) {
    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        password: await hashPassword(newPassword),
      },
    });
  }

  async logout(token: string) {
    await db.userSession.delete({
      where: {
        token: token,
      },
    });
  }
}
