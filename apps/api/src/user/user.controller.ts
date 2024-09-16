import { Controller, Get } from '@nestjs/common';
import { GetUser } from '~api/decorators';
import { UsePublic } from '~api/guards/jwt-auth.guard';
import { UserWithoutPassword } from '~libs/entities';

@Controller('user')
export class UserController {
  @Get('profile')
  @UsePublic()
  getProfile(@GetUser() user: UserWithoutPassword) {
    return user;
  }
}
