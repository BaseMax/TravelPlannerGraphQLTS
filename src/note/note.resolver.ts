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

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Trip)
  async updateNote(@Args("updateNoteInput") updateNoteInput: UpdateNoteInput) {
    const trip = await this.tripService.findByIdOrThrow(updateNoteInput.tripId);
    const isNoteInTrip = await this.noteService.findByIdOrThrow(
      updateNoteInput.tripId,
      updateNoteInput.noteId
    );

    const updatedNote = await this.noteService.updateNote(updateNoteInput);
    this.pubSub.publish("noteUpdated", {
      noteUpdated: updatedNote,
    });

    return updatedNote;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Trip)
  async removeNote(
    @Args("tripId", ParseObjectIdPipe) tripId: string,
    @Args("noteId", ParseObjectIdPipe) noteId: string,
    @GerCurrentUserId() userId: string
  ) {
    const trip = await this.tripService.findByIdOrThrow(tripId);
    const noteInTrip = await this.noteService.findByIdOrThrow(tripId, noteId);
    const isCollaborator = await this.noteService.isCollaborator(
      userId,
      tripId
    );

    if (!isCollaborator) {
      throw new ForbiddenException("you aren't collaborator in this trip");
    }

    const noteRemoved = await this.noteService.remove(tripId, noteId);

    this.pubSub.publish("noteRemoved", {
      noteRemoved: noteRemoved,
    });

    return noteRemoved;
  }

  @Subscription(() => Trip, {
    filter: (payload, variables) => {
      return payload.noteAdded._id.toString() === variables.tripId;
    },
  })
  noteAdded(@Args("tripId", ParseObjectIdPipe) tripId: string) {
    return this.pubSub.asyncIterator("noteAdded");
  }

  @Subscription(() => Trip, {
    filter: (payload, variables) => {
      return payload.noteUpdated._id.toString() === variables.tripId;
    },
  })
  noteUpdated(@Args("tripId", ParseObjectIdPipe) tripId: string) {
    return this.pubSub.asyncIterator("noteUpdated");
  }

  @Subscription(() => Trip, {
    filter: (payload, variables) => {
      return payload.noteRemoved._id.toString() === variables.tripId;
    },
  })
  noteRemoved(@Args("tripId", ParseObjectIdPipe) tripId: string) {
    return this.pubSub.asyncIterator("noteRemoved");
  }
}
