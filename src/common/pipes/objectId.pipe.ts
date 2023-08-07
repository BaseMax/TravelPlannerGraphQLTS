import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from "@nestjs/common";
import { isMongoId } from "class-validator";

export class ParseObjectIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const isValidId = isMongoId(value);

    if (!isValidId) {
      throw new BadRequestException("id must be a valid objectId");
    }

    return value;
  }
}
