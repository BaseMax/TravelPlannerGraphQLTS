import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Subscription,
} from "@nestjs/graphql";
import { TripService } from "./trip.service";
import { PopularDestination, Trip } from "./entities/trip.entity";
import { CreateTripInput } from "./dto/create-trip.input";
import { UpdateTripInput } from "./dto/update-trip.input";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt.auth.guard";
import { GerCurrentUserId } from "src/common/get.current.userId";
import { IsMongoId } from "class-validator";
import { ParseObjectIdPipe } from "src/common/pipes/objectId.pipe";
import { SearchTripInput } from "./dto/search-trip.input";
import { UserService } from "src/user/user.service";
import { PubSub } from "graphql-subscriptions";

@Resolver(() => Trip)
export class TripResolver {
  private readonly pubSub: PubSub;

  constructor(
    private readonly tripService: TripService,
    private readonly userService: UserService
  ) {
    this.pubSub = new PubSub();
  }

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

  @Query(() => [String], { name: "collaboratorsInTrip" })
  async getCollaboratorsInTrip(@Args("id", ParseObjectIdPipe) id: string) {
    const trip = await this.tripService.findByIdOrThrow(id);
    return trip.collaborators;
  }

  @Query(() => [Trip], { name: "searchTrip" })
  async search(@Args("searchInput") searchTripInput: SearchTripInput) {
    return this.tripService.search(searchTripInput);
  }

  @Query(() => [Trip])
  async getTripsByDateRange(
    @Args("dateRange") dateRangeInput: SearchTripInput
  ) {
    return this.tripService.search(dateRangeInput);
  }

  @Query(() => [PopularDestination], { name: "PopularDestination" })
  async getPopularDestination() {
    return this.tripService.getPopularDestination();
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Trip)
  async addCollaborator(
    @Args("tripId", ParseObjectIdPipe) tripId: string,
    @Args("userId", ParseObjectIdPipe) userId: string
  ) {
    const trip = await this.tripService.findByIdOrThrow(tripId);
    const shouldBeInviteUser = await this.userService.findByIdOrThrow(userId);
    const collaboratorAddedTrip = await this.tripService.addCollaborator(
      userId,
      tripId
    );
    this.pubSub.publish("collaboratorAdded", {
      collaboratorAdded: collaboratorAddedTrip,
    });

    return collaboratorAddedTrip;
  }

  @Mutation(() => Trip)
  updateTrip(@Args("updateTripInput") updateTripInput: UpdateTripInput) {
    return this.tripService.update(updateTripInput.id, updateTripInput);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Trip)
  async removeTrip(@Args("id", ParseObjectIdPipe) id: string) {
    const trip = await this.tripService.findByIdOrThrow(id);
    const removedTrip = await this.tripService.remove(id);

    this.pubSub.publish("tripRemoved", {
      tripRemoved: removedTrip,
    });

    return removedTrip;
  }

  @Subscription(() => Trip)
  collaboratorAdded() {
    return this.pubSub.asyncIterator("collaboratorAdded");
  }

  @Subscription(() => Trip)
  tripRemoved() {
    return this.pubSub.asyncIterator("tripRemoved");
  }
}
