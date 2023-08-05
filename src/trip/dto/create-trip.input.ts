import { InputType, Int, Field } from "@nestjs/graphql";
import { IsOptional, IsString } from "class-validator";
import {
  IsArrayOfDates,
  IsArrayOfMongoId,
} from "../decorators/validation.decorators";

@InputType()
export class CreateTripInput {
  @Field()
  @IsString()
  destination: string;

  @Field(() => [Date])
  @IsArrayOfDates()
  dates: Date[];

  @Field(() => [String], { nullable: true })
  @IsArrayOfMongoId()
  @IsOptional()
  calibrators: string[];
}
