import { InputType, Int, Field, extend } from "@nestjs/graphql";
import { SignupInput } from "src/auth/dto/signup.input";

@InputType()
export class CreateUserInput extends SignupInput {}
