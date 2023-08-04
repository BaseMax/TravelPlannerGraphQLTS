import { CreateTripInput } from './create-trip.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTripInput extends PartialType(CreateTripInput) {
  @Field(() => Int)
  id: number;
}
