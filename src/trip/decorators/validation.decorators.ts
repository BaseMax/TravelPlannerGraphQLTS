import {
  IsMongoId,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from "class-validator";

export function IsArrayOfDates(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "IsArrayOfDates",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!Array.isArray(value)) {
            return false;
          }

          for (const date of value) {
            if (!(date instanceof Date) || isNaN(date.getTime())) {
              return false;
            }
          }

          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be an array of valid dates.`;
        },
      },
    });
  };
}

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
