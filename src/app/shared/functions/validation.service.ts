import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export const INVALID_CHARS = [`=`, `'`, `@`, `|`, `+`, `-`];

export const INVALID_STRINGS = [`cmd`, `.exe`];

const REG_EX = /[=|@|\||+|'|cmd|.exe]/; //NOSONAR

export function specialCharacterValidatorAllowingAndPercentageEnter(
  control: AbstractControl,
) {
  if (!control.value) {
    return null;
  }
  const Regexp = /^[A-Za-z0-9\n,.!@#*&%()? {}$¥£€₹₩|\\:;_+>/<=~`"'[\]-]*$/;
  return Regexp.test(control.value)
    ? null
    : {specialCharactersAllowingAndPercentageEnter: true};
}

export function noWhitespace(control: AbstractControl) {
  const isWhitespace = (control.value || '').trim().length === 0;
  const isValid = !isWhitespace;
  return isValid ? null : {pattern: true};
}

export function specialCharacterValidatorAllowingANDandPercentage(
  control: AbstractControl,
) {
  if (!control.value) {
    return null;
  }
  const Regexp = /^[A-Za-z0-9,.!@#*&%()? {}$¥£€₹₩|\\:;_+>/<=~`"'[\]-]*$/;
  return Regexp.test(control.value)
    ? null
    : {specialCharactersAllowingANDandPercentage: true};
}

/**
 * Checks if two array have same values.
 * Not for Deep equality checks.
 * @param arr1 Array 1 of string, number or boolean
 * @param arr2 Array 2 of string, number or boolean
 * @returns
 */
export function isEqualArray(arr1: string[], arr2: string[]) {
  return (
    arr1?.length === arr2?.length &&
    arr2.every(e => arr1.includes(e)) &&
    arr1.every(e => arr2.includes(e))
  );
}

export function noWhitespaceNonMandatory(control: AbstractControl) {
  if (control.value) {
    const isValid = control.value.trim().length !== 0;
    return isValid ? null : {pattern: true};
  }
  return null;
}
export function uptoDecimalPlaces(val: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const regexpString = `^-?[0-9]\\d*(\\.\\d{0,${val}})?$`;
    const Regexp = new RegExp(regexpString);
    return Regexp.test(control.value) ? null : {decimalPlacesExceeded: true};
  };
}
