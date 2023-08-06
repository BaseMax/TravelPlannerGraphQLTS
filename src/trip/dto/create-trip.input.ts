import { InputType, Int, Field } from "@nestjs/graphql";
import { IsDate, IsOptional, IsString, Validate } from "class-validator";
import {
  IsArrayOfMongoId,
  IsValidDates,
} from "../decorators/validation.decorators";

@InputType()
export class CreateTripInput {
  @Field()
  @IsString()
  destination: string;

  @Field(() => Date)
  @IsDate({ message: "date must have a valid form" })
  fromDate: Date;

  @Field(() => Date)
  @IsDate({ message: "date must have a valid form" })
  @Validate(IsValidDates, ["fromDate"])
  toDate: Date;

  @Field(() => [String], { nullable: true })
  @IsArrayOfMongoId()
  @IsOptional()
  collaborators: string[];
}
