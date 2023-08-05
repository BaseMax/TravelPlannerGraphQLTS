import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from "@nestjs/common";
import { isValidObjectId } from "mongoose";

export class ParseObjectIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const isValidId = isValidObjectId(value);

    if (!isValidId) {
      throw new BadRequestException("id must be a valid objectId");
    }

    return value;
  }
}
