import { Document } from "mongoose";

export interface TripDocument extends Document {
  readonly destination: string;

  readonly fromDate: Date;

  readonly toDate: Date;

  readonly collaborators: string[];
}
