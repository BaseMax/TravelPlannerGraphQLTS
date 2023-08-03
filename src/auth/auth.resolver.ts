import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { Auth } from "./entities/auth.entity";
import { SignupInput } from "./dto/signup.input";
import { LoginInput } from "./dto/login.input";
import { UserService } from "src/user/user.service";
import { BadRequestException } from "@nestjs/common";

@Resolver(() => Auth)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Mutation(() => Auth)
  async signup(@Args("SignupInput") signupInput: SignupInput) {
    const existsUser = await this.userService.findByEmail(signupInput.email);
    if (existsUser) {
      throw new BadRequestException(
        "user with this email exists, please try to login"
      );
    }
    return this.authService.signup(signupInput);
  }

  @Mutation(() => Auth)
  async login(@Args("loginInput") loginInput: LoginInput) {
    const existsUser = await this.userService.findByEmail(loginInput.email);
    if (!existsUser) {
      throw new BadRequestException("credentials aren't correct");
    }
    return this.authService.login(existsUser, loginInput.password);
  }
}
