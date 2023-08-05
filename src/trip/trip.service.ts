import { Injectable } from "@nestjs/common";
import { CreateTripInput } from "./dto/create-trip.input";
import { UpdateTripInput } from "./dto/update-trip.input";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TripDocument } from "./interfaces/trip.document";

@Injectable()
export class TripService {
  constructor(@InjectModel("Trip") private tripModel: Model<TripDocument>) {}

  async create(
    createTripInput: CreateTripInput,
    userId: string
  ): Promise<TripDocument> {
    return await this.tripModel.create({
      ...createTripInput,
      calibrators: userId,
    });
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
