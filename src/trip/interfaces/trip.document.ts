import { Document } from "mongoose";
import { NoteDocument } from "src/note/interfaces/note.document";

export interface TripDocument extends Document {
  readonly destination: string;

  readonly fromDate: Date;

  readonly toDate: Date;

  readonly collaborators: string[];

  readonly notes: NoteDocument;
}
