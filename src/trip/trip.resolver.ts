import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { TripService } from "./trip.service";
import { Trip } from "./entities/trip.entity";
import { CreateTripInput } from "./dto/create-trip.input";
import { UpdateTripInput } from "./dto/update-trip.input";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt.auth.guard";
import { GerCurrentUserId } from "src/common/get.current.userId";
@Resolver(() => Trip)
export class TripResolver {
  constructor(private readonly tripService: TripService) {}

  @Mutation(() => Trip)
  @UseGuards(JwtAuthGuard)
  createTrip(
    @Args("createTripInput") createTripInput: CreateTripInput,
    @GerCurrentUserId() userId: string
  ) {
    
    return this.tripService.create(createTripInput, userId);
  }

  @Query(() => [Trip], { name: "trip" })
  findAll() {
    return this.tripService.findAll();
  }

  @Query(() => Trip, { name: "trip" })
  findOne(@Args("id", { type: () => Int }) id: number) {
    return this.tripService.findOne(id);
  }

  @Mutation(() => Trip)
  updateTrip(@Args("updateTripInput") updateTripInput: UpdateTripInput) {
    return this.tripService.update(updateTripInput.id, updateTripInput);
  }

  @Mutation(() => Trip)
  removeTrip(@Args("id", { type: () => Int }) id: number) {
    return this.tripService.remove(id);
  }
}
