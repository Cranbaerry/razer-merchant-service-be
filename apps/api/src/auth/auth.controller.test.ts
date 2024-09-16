import { request, spec } from 'pactum';
import { getDataMap, updateDataMap } from '~api/test';
import { LoginUserDto } from '~api/user/user.dto';
import { UserWithoutPassword } from '~libs/entities';

export const authControllerTestCases = describe('AuthController Tests', () => {
  it('should login user successfully', async () => {
    const body: LoginUserDto = {
      email: `$M{NewUser.email}`,
      password: `$M{NewUser.password}`,
    };

    await spec()
      .post('/auth/login')
      .withJson(body)
      .expectStatus(201)
      .expectJsonLike({
        success: true,
      })
      .stores('token', 'data.token');

    request.setDefaultHeaders('Authorization', `Bearer $S{token}`);
  });

  it('should login user and get profile by using token', async () => {
    const userProfile = await spec()
      .get('/auth/profile')
      .expectStatus(200)
      .returns<UserWithoutPassword>('');

    updateDataMap('NewUser', {
      ...getDataMap('NewUser'),
      ...userProfile,
    });
  });
});
