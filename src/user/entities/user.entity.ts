import { ObjectType, Field, Int } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
@ObjectType()
export class User {
  @Field()
  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Field()
  @Prop({ type: String, required: true })
  name: string;

  @Prop()
  password: string;

  @Field()
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
