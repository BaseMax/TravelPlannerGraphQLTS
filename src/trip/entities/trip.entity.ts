import { ObjectType, Field, Int } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema()
@ObjectType()
export class Trip {
  @Field()
  _id: string;

  @Field()
  @Prop({ type: String, required: true })
  destination: string;

  @Field(() => [Date])
  @Prop({
    type: [{ type: Date, required: true }],
  })
  dates: Date[];

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
}
export const TripSchema = SchemaFactory.createForClass(Trip);
