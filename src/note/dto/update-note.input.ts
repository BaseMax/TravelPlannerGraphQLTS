import { IsMongoId } from "class-validator";
import { CreateNoteInput } from "./create-note.input";
import { InputType, Field, Int, PartialType } from "@nestjs/graphql";

@InputType()
export class UpdateNoteInput extends PartialType(CreateNoteInput) {
  @Field(() => String)
  @IsMongoId()
  noteId: string;

  @Field(() => String)
  @IsMongoId()
  tripId: string;
}
