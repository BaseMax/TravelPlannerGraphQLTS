import {
  IsMongoId,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from "class-validator";

export function IsArrayOfMongoId(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "IsArrayOfMongoId",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (value === undefined || value === null) {
            return true; // Optional field, validation should pass
          }

          if (!Array.isArray(value)) {
            return false;
          }

          const isValid = value.every((id: any) => {
            return typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);
          });

          return isValid;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be an array of valid MongoDB ObjectIDs`;
        },
      },
    });
  };
}

@ValidatorConstraint({ name: "IsValidDates", async: false })
export class IsValidDates implements ValidatorConstraintInterface {
  validate(date: any, args: ValidationArguments) {
    const fromDate = (args.object as any)[args.constraints[0]] as Date;
    return this.isCorrectDates(fromDate, date);
  }

  defaultMessage(args: ValidationArguments) {
    return `$property date isn't correct with $constraint1`;
  }

  isCorrectDates(fromDate: Date, toDate: Date): boolean {
    return fromDate.getTime() < toDate.getTime() ? true : false;
  }
}
