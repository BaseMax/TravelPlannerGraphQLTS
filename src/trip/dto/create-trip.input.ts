import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateTripInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
