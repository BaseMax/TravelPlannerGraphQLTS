import { InputType, Int, Field } from "@nestjs/graphql";
import { IsEmail, IsString, Validate } from "class-validator";
import { CustomMatchPasswords } from "../decorators/confirm.password";

@InputType()
export class SignupInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  password: string;

  @Field()
  @Validate(CustomMatchPasswords,['password'])
  confirmPassword: string;
}
