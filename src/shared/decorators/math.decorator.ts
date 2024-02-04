import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  equals,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'Match' })
export class MatchConstraint implements ValidatorConstraintInterface {
  validate(value: unknown, validationArguments: ValidationArguments): boolean {
    const [propertyNameToCompare] = validationArguments.constraints || [];

    return equals(validationArguments.object[propertyNameToCompare], value);
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    const [propertyNameToCompare] = validationArguments.constraints;

    return `${validationArguments.property} and ${propertyNameToCompare} does not match`;
  }
}

export const Match =
  <T>(property: keyof T, options?: ValidationOptions) =>
  (object: object, propertyName: string) =>
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      constraints: [property],
      validator: MatchConstraint,
    });
