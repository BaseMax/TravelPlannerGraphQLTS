import { BadRequestException, Injectable } from "@nestjs/common";
import { SignupInput } from "./dto/signup.input";
import { LoginInput } from "./dto/login.input";
import { UserService } from "src/user/user.service";
import * as argon2 from "argon2";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./interfaces/jwt.payload";
import { Auth } from "./entities/auth.entity";
import { UserDocument } from "src/user/interfaces/user.document";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}
  async signup(signupInput: SignupInput): Promise<Auth> {
    const user = await this.userService.create({
      ...signupInput,
      password: await argon2.hash(signupInput.password),
    });
    const token = this.getToken({ sub: user._id, name: user.name });
    return { name: user.name, token };
  }

  async login(
    existsUser: UserDocument,
    claimedPassword: string
  ): Promise<Auth> {
    const isValidPassword = await argon2.verify(
      existsUser.password,
      claimedPassword
    );

    if (!isValidPassword) {
      throw new BadRequestException("credentials aren't correct");
    }
    const token = this.getToken({ sub: existsUser._id, name: existsUser.name });
    return { token, name: existsUser.name };
  }

  getToken(jwtPayload: JwtPayload): string {
    return this.jwtService.sign(jwtPayload);
  }

}
