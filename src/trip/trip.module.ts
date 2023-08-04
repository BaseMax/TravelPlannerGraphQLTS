import { Module } from '@nestjs/common';
import { TripService } from './trip.service';
import { TripResolver } from './trip.resolver';

@Module({
  providers: [TripResolver, TripService]
})
export class TripModule {}
