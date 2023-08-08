import { Module } from "@nestjs/common";
import { NoteService } from "./note.service";
import { NoteResolver } from "./note.resolver";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "src/auth/auth.module";
import { TripModule } from "src/trip/trip.module";
import { TripSchema } from "src/trip/entities/trip.entity";

@Module({
  imports: [
    MongooseModule.forFeature([{ schema: TripSchema, name: "Trip" }]),
    AuthModule,
    TripModule,
  ],
  providers: [NoteResolver, NoteService],
})
export class NoteModule {}
