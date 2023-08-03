import { Injectable } from "@nestjs/common";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserDocument } from "./interfaces/user.document";

@Injectable()
export class UserService {
  constructor(@InjectModel("User") private userModel: Model<UserDocument>) {}
  async create(createUserInput: CreateUserInput) {
    return this.userModel.create(createUserInput);
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email });
  }
  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
