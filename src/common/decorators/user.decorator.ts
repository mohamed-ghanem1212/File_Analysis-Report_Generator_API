import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export interface AuthUser {
  id: string;
  email: string;
  username: string;
  role: string;
  isActive: boolean;
}
export const CurrentUser = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    console.log(`user:::: ${JSON.stringify(user)}}`);

    return data ? request.user?.[data] : user;
  },
);
