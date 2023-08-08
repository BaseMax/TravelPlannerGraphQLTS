import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Subscription,
} from "@nestjs/graphql";
import { NoteService } from "./note.service";
import { Note } from "./entities/note.entity";
import { CreateNoteInput } from "./dto/create-note.input";
import { UpdateNoteInput } from "./dto/update-note.input";
import { ForbiddenException, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt.auth.guard";
import { TripService } from "src/trip/trip.service";
import { GerCurrentUserId } from "src/common/get.current.userId";
import { Trip } from "src/trip/entities/trip.entity";
import { PubSub } from "graphql-subscriptions";
import { ParseObjectIdPipe } from "src/common/pipes/objectId.pipe";
@Resolver(() => Trip)
export class NoteResolver {
  private readonly pubSub: PubSub;

  constructor(
    private readonly noteService: NoteService,
    private readonly tripService: TripService
  ) {
    this.pubSub = new PubSub();
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Trip)
  async createNote(
    @Args("createNoteInput") createNoteInput: CreateNoteInput,
    @GerCurrentUserId() userId: string
  ) {
    const trip = await this.tripService.findByIdOrThrow(createNoteInput.tripId);
    const isCollaborator = await this.noteService.isCollaborator(
      userId,
      createNoteInput.tripId
    );

    if (!isCollaborator) {
      throw new ForbiddenException("you aren't collaborator in this trip");
    }
    const tripAfterAddedNote = await this.noteService.create(
      createNoteInput,
      userId
    );

    this.pubSub.publish("noteAdded", {
      noteAdded: tripAfterAddedNote,
    });

    return tripAfterAddedNote;
  }

  @Query(() => [Note], { name: "note" })
  findAll() {
    return this.noteService.findAll();
  }

  @Query(() => Note, { name: "note" })
  findOne(@Args("id", { type: () => Int }) id: number) {
    return this.noteService.findOne(id);
  }

  @Mutation(() => Note)
  updateNote(@Args("updateNoteInput") updateNoteInput: UpdateNoteInput) {
    return this.noteService.update(updateNoteInput.id, updateNoteInput);
  }

  @Mutation(() => Note)
  removeNote(@Args("id", { type: () => Int }) id: number) {
    return this.noteService.remove(id);
  }

  @Subscription(() => Trip, {
    filter: (payload, variables) => {
      return payload.noteAdded._id.toString() === variables.tripId;
    },
  })
  noteAdded(@Args("tripId", ParseObjectIdPipe) tripId: string) {
    return this.pubSub.asyncIterator("noteAdded");
  }
}
