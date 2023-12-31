import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateNoteInput } from "./dto/create-note.input";
import { UpdateNoteInput } from "./dto/update-note.input";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { NoteDocument } from "./interfaces/note.document";
import { TripDocument } from "src/trip/interfaces/trip.document";

@Injectable()
export class NoteService {
  constructor(@InjectModel("Trip") private tripModel: Model<TripDocument>) {}
  create(
    createNoteInput: CreateNoteInput,
    userId: string
  ): Promise<TripDocument> {
    return this.tripModel.findByIdAndUpdate(
      createNoteInput.tripId,
      {
        $push: { notes: { ...createNoteInput, collaboratorId: userId } },
      },
      {
        returnOriginal: false,
      }
    );
  }

  async isCollaborator(userId: string, tripId: string): Promise<boolean> {
    const trip = await this.tripModel.findOne({
      _id: new mongoose.Types.ObjectId(tripId),
      collaborators: new mongoose.Types.ObjectId(userId),
    });

    return trip ? true : false;
  }

  async findByIdOrThrow(tripId: string, noteId: string): Promise<TripDocument> {
    const trip = await this.tripModel.findOne({
      _id: tripId,
      "notes._id": noteId,
    });

    if (!trip) {
      throw new BadRequestException(
        "there is no note with this id in the trip"
      );
    }
    return trip;
  }

  async updateNote(updateNoteInput: UpdateNoteInput): Promise<TripDocument> {
    return await this.tripModel.findOneAndUpdate(
      {
        _id: updateNoteInput.tripId,
        "notes._id": updateNoteInput.noteId,
      },
      {
        $set: {
          "notes.$[n].content": updateNoteInput.content,
        },
      },

      {
        returnOriginal: false,
        arrayFilters: [
          {
            "n._id": new mongoose.Types.ObjectId(updateNoteInput.noteId),
          },
        ],
      }
    );
  }



  async remove(tripId: string, noteId: string): Promise<TripDocument> {
    return await this.tripModel.findOneAndUpdate(
      {
        _id: tripId,
      },
      {
        $pull: {
          notes: { _id: noteId },
        },
      },

      {
        returnOriginal: false,
      }
    );
  }
}
