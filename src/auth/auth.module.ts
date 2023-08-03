import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthResolver } from "./auth.resolver";
import { UserModule } from "src/user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("SECRET_KEY"),
        signOptions: { expiresIn: "1d" },
      }),
      inject:[ConfigService]
    }),
    UserModule,
  ],
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}
