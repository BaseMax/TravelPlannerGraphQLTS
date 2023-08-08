import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateNoteInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
