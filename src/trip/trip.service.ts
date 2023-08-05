import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateTripInput } from "./dto/create-trip.input";
import { UpdateTripInput } from "./dto/update-trip.input";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
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
      collaborators: userId,
    });
  }

  findAll() {
    return `This action returns all trip`;
  }

  async findByIdOrThrow(id: string): Promise<TripDocument> {
    const trip = await this.tripModel.findById(id);
    if (!trip) {
      throw new BadRequestException("trip with this id doesn't exist");
    }
    return trip;
  }

  async getUserTrips(userId: string): Promise<TripDocument[]> {
    return await this.tripModel.find({
      collaborators: new mongoose.Types.ObjectId(userId),
    });
  }
  update(id: number, updateTripInput: UpdateTripInput) {
    return `This action updates a #${id} trip`;
  }

  remove(id: number) {
    return `This action removes a #${id} trip`;
  }
}
