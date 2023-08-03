import { Injectable } from "@nestjs/common";
import { SignupInput } from "./dto/create-auth.input";
import { UpdateAuthInput } from "./dto/update-auth.input";
import { UserService } from "src/user/user.service";
import * as argon2 from "argon2";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./interfaces/jwt.payload";
import { Auth } from "./entities/auth.entity";

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

  getToken(jwtPayload: JwtPayload): string {
    return this.jwtService.sign(jwtPayload);
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthInput: UpdateAuthInput) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
