import { SignupInput } from "./signup.input";
import { InputType, Field, Int, PartialType, OmitType } from "@nestjs/graphql";

@InputType()
export class LoginInput extends PartialType(
  OmitType(SignupInput, ["confirmPassword", "name"] as const)
) {
 
}
