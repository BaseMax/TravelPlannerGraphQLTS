import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Trip {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
