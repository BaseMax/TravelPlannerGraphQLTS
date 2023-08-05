import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { TripService } from "./trip.service";
import { Trip } from "./entities/trip.entity";
import { CreateTripInput } from "./dto/create-trip.input";
import { UpdateTripInput } from "./dto/update-trip.input";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt.auth.guard";
import { GerCurrentUserId } from "src/common/get.current.userId";
import { IsMongoId } from "class-validator";
import { ParseObjectIdPipe } from "src/common/pipes/objectId.pipe";
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

  @Query(() => Trip, { name: "trip" })
  findOne(@Args("id", ParseObjectIdPipe) id: string) {
    return this.tripService.findByIdOrThrow(id);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Trip], { name: "userTrips" })
  getUserTrips(@GerCurrentUserId() userId: string) {
    return this.tripService.getUserTrips(userId);
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
