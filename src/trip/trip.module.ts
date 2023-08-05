import { Module } from "@nestjs/common";
import { TripService } from "./trip.service";
import { TripResolver } from "./trip.resolver";
import { MongooseModule } from "@nestjs/mongoose";
import { TripSchema } from "./entities/trip.entity";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ schema: TripSchema, name: "Trip" }]),
    AuthModule,
  ],
  providers: [TripResolver, TripService],
})
export class TripModule {}
