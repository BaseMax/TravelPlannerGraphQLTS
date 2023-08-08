import { ObjectType, Field, Int } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema()
@ObjectType()
export class Note {
  @Field()
  _id: string;

  @Field()
  @Prop({ type: mongoose.Types.ObjectId, ref: "User", required: true })
  collaboratorId: string;



  @Field()
  @Prop({ type: String })
  content: string;

  @Field()
  @Prop({type :Date, default : Date.now})
  createdAt: Date
}

export const NoteSchema = SchemaFactory.createForClass(Note);
