import { Document } from "mongoose";

export interface TripDocument extends Document {
  readonly destination: string;

  readonly dates: Date[];

  readonly calibrators: string[];
}
