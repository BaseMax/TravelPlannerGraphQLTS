import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TripService } from './trip.service';
import { Trip } from './entities/trip.entity';
import { CreateTripInput } from './dto/create-trip.input';
import { UpdateTripInput } from './dto/update-trip.input';

@Resolver(() => Trip)
export class TripResolver {
  constructor(private readonly tripService: TripService) {}

  @Mutation(() => Trip)
  createTrip(@Args('createTripInput') createTripInput: CreateTripInput) {
    return this.tripService.create(createTripInput);
  }

  @Query(() => [Trip], { name: 'trip' })
  findAll() {
    return this.tripService.findAll();
  }

  @Query(() => Trip, { name: 'trip' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.tripService.findOne(id);
  }

  @Mutation(() => Trip)
  updateTrip(@Args('updateTripInput') updateTripInput: UpdateTripInput) {
    return this.tripService.update(updateTripInput.id, updateTripInput);
  }

  @Mutation(() => Trip)
  removeTrip(@Args('id', { type: () => Int }) id: number) {
    return this.tripService.remove(id);
  }
}
