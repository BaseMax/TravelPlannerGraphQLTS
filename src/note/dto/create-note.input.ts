import { InputType, Int, Field } from "@nestjs/graphql";
import { IsMongoId, IsString } from "class-validator";

@InputType()
export class CreateNoteInput {
  @Field()
  @IsString()
  content: string;

  @Field()
  @IsMongoId({ message: "tripId must be a valid id" })
  tripId: string;
}
