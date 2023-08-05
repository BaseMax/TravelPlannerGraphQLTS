import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthResolver } from "./auth.resolver";
import { UserModule } from "src/user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JwtAuthGuard } from "./guards/jwt.auth.guard";

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("SECRET_KEY"),
        signOptions: { expiresIn: "1d" },
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  providers: [AuthResolver, AuthService, JwtAuthGuard],
})
export class AuthModule {}
