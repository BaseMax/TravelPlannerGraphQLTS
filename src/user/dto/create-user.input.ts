import { InputType, Int, Field, extend } from "@nestjs/graphql";
import { SignupInput } from "src/auth/dto/create-auth.input";

@InputType()
export class CreateUserInput extends SignupInput {}
