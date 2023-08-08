import { Document } from "mongoose";

export interface NoteDocument extends Document {
  readonly content: string;
  readonly tripId: string;
  readonly collaboratorId: string;
  readonly createdAt: Date;
}
