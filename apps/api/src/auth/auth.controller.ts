import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { UsePublic } from '~api/guards/jwt-auth.guard';
import {
  ChangePasswordDto,
  LoginUserDto,
  RegisterUserDto,
} from '~api/user/user.dto';
import { UserService } from '~api/user/user.service';
import { ApiResponse, UserWithoutPassword } from '~libs/entities';
import { GetUser } from '~api/decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @UsePublic()
  async register(@Body() dto: RegisterUserDto) {
    await this.userService.register(dto);
  }

  @Post('login')
  @UsePublic()
  async login(
    @Body() dto: LoginUserDto,
  ): Promise<ApiResponse<{ token: string }>> {
    const token = await this.userService.login(dto.email, dto.password);

    return { success: true, data: { token } };
  }

  @Post('change-password')
  async changePassword(
    @GetUser() user: UserWithoutPassword,
    @Body() dto: ChangePasswordDto,
  ) {
    await this.userService.changePassword(user.id, dto.newPassword);
  }

  @Post('logout')
  async logout(@Req() req: Request) {
    await this.userService.logout(req.token);
  }
}
