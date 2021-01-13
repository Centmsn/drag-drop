// simple interface to indicate which properties can be validated
export interface Validable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

export function validate(validableInput: Validable) {
  // initial state
  let isValid = true;

  // validation
  if (validableInput.required) {
    isValid = isValid && !!validableInput.value.toString().trim().length;
  }

  if (validableInput.minLength && typeof validableInput.value === "string") {
    isValid =
      isValid && validableInput.value.length >= validableInput.minLength;
  }

  if (validableInput.maxLength && typeof validableInput.value === "string") {
    isValid =
      isValid && validableInput.value.length <= validableInput.maxLength;
  }

  if (validableInput.min && typeof validableInput.value === "number") {
    isValid = isValid && validableInput.value >= validableInput.min;
  }

  if (validableInput.max && typeof validableInput.value === "number") {
    isValid = isValid && validableInput.value <= validableInput.max;
  }

  return isValid;
}
