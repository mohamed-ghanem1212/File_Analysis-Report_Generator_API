import { AuthController } from '../controller/auth.controller';

import { Module } from '@nestjs/common';

import { AuthService } from '../service/auth.service';
import { UserModule } from 'src/modules/users/module/user.module';
import { JwtModule } from '@nestjs/jwt';
import { LocalAuthStrategy } from '../strategies/local.strategy';
import { JwtStrategy } from '../strategies/jwt.startegy';
@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalAuthStrategy, JwtStrategy],
})
export class AuthModule {}
