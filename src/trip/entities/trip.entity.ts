import { ObjectType, Field, Int } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Note, NoteSchema } from "src/note/entities/note.entity";

@Schema()
@ObjectType()
export class Trip {
  @Field()
  _id: string;

  @Field()
  @Prop({ type: String, required: true })
  destination: string;

  @Field(() => Date)
  @Prop({ type: Date, required: true })
  fromDate: Date;

  @Field(() => Date)
  @Prop({ type: Date, required: true })
  toDate: Date;

  @Field(() => [String])
  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  })
  collaborators: string[];

  @Field(() => [Note])
  @Prop({ type: [{ type: NoteSchema }], required: false })
  notes?: Note;
}

@ObjectType()
export class PopularDestination {
  @Field(() => Int)
  tripsCount: number;
  @Field()
  destination: string;
}
export const TripSchema = SchemaFactory.createForClass(Trip);
