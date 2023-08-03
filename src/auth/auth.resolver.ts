import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { Auth } from "./entities/auth.entity";
import { SignupInput } from "./dto/create-auth.input";
import { UpdateAuthInput } from "./dto/update-auth.input";
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

  @Query(() => [Auth], { name: "auth" })
  findAll() {
    return this.authService.findAll();
  }

  @Query(() => Auth, { name: "auth" })
  findOne(@Args("id", { type: () => Int }) id: number) {
    return this.authService.findOne(id);
  }

  @Mutation(() => Auth)
  updateAuth(@Args("updateAuthInput") updateAuthInput: UpdateAuthInput) {
    return this.authService.update(updateAuthInput.id, updateAuthInput);
  }

  @Mutation(() => Auth)
  removeAuth(@Args("id", { type: () => Int }) id: number) {
    return this.authService.remove(id);
  }
}
