import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from "@nestjs/common";
import mongoose from "mongoose";
export class ParseObjectIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const isValidId = this.isValidObjectId(value);

    if (!isValidId) {
      throw new BadRequestException("id must be a valid objectId");
    }

    return value;
  }

  isValidObjectId(id: string): boolean {
    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        if (String(new mongoose.Types.ObjectId(id)) === id) return true;
        return false;
      }
      return false;
    } catch {
      return false;
    }
  }
}
