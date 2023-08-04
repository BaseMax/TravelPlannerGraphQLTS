import { Injectable } from '@nestjs/common';
import { CreateTripInput } from './dto/create-trip.input';
import { UpdateTripInput } from './dto/update-trip.input';

@Injectable()
export class TripService {
  create(createTripInput: CreateTripInput) {
    return 'This action adds a new trip';
  }

  findAll() {
    return `This action returns all trip`;
  }

  findOne(id: number) {
    return `This action returns a #${id} trip`;
  }

  update(id: number, updateTripInput: UpdateTripInput) {
    return `This action updates a #${id} trip`;
  }

  remove(id: number) {
    return `This action removes a #${id} trip`;
  }
}
