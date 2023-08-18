import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {ThemePalette} from '@angular/material/core';
import {GENERAL_CONSTANTS} from '../../../../shared/constants/global-constants';
import * as uuid from 'uuid';
import {MyErrorStateMatcher} from '../my-error-state.class';
type validatorType = (
  control: AbstractControl<any, any>,
) => ValidationErrors | null;
const ENTER_KEY_CODE = 13;
const SPACE_KEY_CODE = 32;
const num8 = 8;
const num37 = 37;
const num39 = 39;
const num46 = 46;
const num32 = 32;
const num64 = 64;
const num90 = 90;
const num65 = 65;

@Component({
  selector: 'input-text-box',
  templateUrl: './input-box.component.html',
  styleUrls: ['./input-box.component.scss'],
})
export class InputBoxComponent implements OnInit, AfterViewInit {
  hide = true;
  ValidatorsArray: any[] = [];
  matcher = new MyErrorStateMatcher();
  inputControl: FormControl = new FormControl('', []);
  @Input() type:
    | 'text'
    | 'email'
    | 'area'
    | 'number'
    | 'password'
    | 'date'
    | 'time'
    | 'textDescription' = 'text';

  @Input() autoCompleteRequired = false;
  @Input() text = '';
  @Input() min = 0;
  @Input() max: number | undefined;
  @Input() icon = '';
  @Input() email = false;
  @Input() label = '';
  @Input() color: ThemePalette = 'warn';
  @Input() textId = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() readOnlyText = false;
  @Input() maxlength: number | undefined;
  @Input() minlength: number;
  @Input() minDate = '';
  @Input() maxDate = '';
  @Input() pattern: string;
  @Input() customErrorMessage: string | null;
  @Input() suffixText = '';
  @Input() suffixIcon = '';
  @Input() prefixText = '';
  @Input() operatorPrefix = '';
  @Input() prefixIcon = '';
  @Input() noPadding = false;
  @Input() textAreaRow = 1;
  @Input() placeholder = '';
  @Input() validateType = '';
  @Input() validateArray: any = []; //NOSONAR
  @Input() emailPattern = true;
  @Input() passwordToggle = false;
  @Input() decimals = false;
  @Input() noAutocomplete = false;
  @Input() toggleButtonSize = '';
  @Input() toggleButtonRight = false;
  @Input() defaultToggleButtonRight = true;
  @Input() hideRequiredMarker = false;
  @Input() errorLabel = '';
  //: FormControl = new FormControl('', []);
  @Input() control: any; // NOSONAR
  @Input() errorMessages: (control: FormControl) => string;
  @Input() description = '';
  @Input() hintText = '';
  @Input() tooltipHint: string;
  @Input() tooltipPosition: 'below' | 'above' | 'left' | 'right' = 'above';
  @Input('automation-id') automationId = '';
  @Input() showCharCount = false;
  @Input() cssClass: string;
  @Input() maskValue = '';
  @Input() maskSuffix = '';
  @Input() maskPrefix = '';
  @Input() suffixInputGroupText = '';
  @Input() requiredErrMessage = '';
  @Input() showEndDateHint = false;
  @Output() enter = new EventEmitter();
  @Output() textChange = new EventEmitter();
  @Output() uploadedFile = new EventEmitter();
  @Output() onIconClick = new EventEmitter();
  @Output() focusOut = new EventEmitter();
  @Output() onPasteEvent = new EventEmitter();
  @Output() targetValue = new EventEmitter();
  @Input() infoText = '';
  @Input() _id = uuid.v4();
  @Input() achievementInput = false;
  @Input() weighatgeEdit = false;
  @Input() nolabel = false;
  @Input() source = '';
  @Input() extraErrorMessages: (control: FormControl) => string;
  @Input() uptoDecimalPlace: number;
  @Input() allowNegativeValues = false;
  @Input() customScoreInput = false;
  decimalError = '';
  inFocus = false;
  private navigationKeys = [
    'Backspace',
    'Delete',
    'Tab',
    'Escape',
    'Enter',
    'Home',
    'End',
    'ArrowLeft',
    'ArrowRight',
    'Clear',
    'Copy',
    'Paste',
  ];
  notAllowedNumberSymbols = ['e', 'E', '=', ',', '.', '+'];
  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    if (this.suffixIcon) {
      this.setDecimalErrorMessage();
    }
    if (this.required) this.ValidatorsArray.push(Validators.required);
    if (this.type === 'email') this.ValidatorsArray.push(Validators.email);
    if (this.minlength)
      this.ValidatorsArray.push(Validators.minLength(this.minlength));
    if (this.maxlength)
      this.ValidatorsArray.push(Validators.maxLength(this.maxlength));
    if (this.min) this.ValidatorsArray.push(Validators.min(this.min));
    if (this.max) this.ValidatorsArray.push(Validators.max(this.max));
    if (this.pattern)
      this.ValidatorsArray.push(Validators.pattern(this.pattern));
    if (this.type === 'email') {
      this.ValidatorsArray.push(
        Validators.pattern(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        ),
      );
    }
    if (!this.allowNegativeValues) {
      this.notAllowedNumberSymbols.push('-');
    }

    const controlDisabled = this.disabled ? {value: '', disabled: true} : '';
    this.control = !this.control
      ? new FormControl(controlDisabled, this.ValidatorsArray)
      : this.control;
    this.getErrorMessage = this.errorMessages
      ? this.errorMessages
      : this.getErrorMessage;
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  setDecimalErrorMessage() {
    this.decimalError = `Value with up to ${this.uptoDecimalPlace} decimal places allowed`;
  }

  getErrorMessage(control: FormControl) {
    if (this.customErrorMessage) return this.customErrorMessage;
    return control.hasError('alphaNumeric')
      ? 'Only alphanumeric are allowed'
      : control.hasError('specialCharactersAllowingAND')
      ? `These ${GENERAL_CONSTANTS.SPECIAL_CHAR}special characters are allowed only`
      : control.hasError('specialCharactersAllowingANDandPercentage')
      ? `These ${GENERAL_CONSTANTS.SPECIAL_CHAR}special characters are allowed only`
      : control.hasError('specialCharactersAllowingAndPercentageEnter')
      ? `These ${GENERAL_CONSTANTS.SPECIAL_CHAR}special characters are allowed only`
      : control.hasError('specialCharacters')
      ? 'These  , . ! @ # * ( ) - ? { } [ ] " special characters are allowed only'
      : control.hasError('required')
      ? this.validateArray.hasOwnProperty('required')
        ? this.validateArray.required
        : 'Please enter a value'
      : control.hasError('email')
      ? this.validateArray.hasOwnProperty('email')
        ? this.validateArray.email
        : 'Invalid Email entered'
      : control.hasError('min')
      ? this.validateArray.hasOwnProperty('min')
        ? this.validateArray.min
        : `Enter number greater than ${this.min}`
      : control.hasError('max')
      ? this.validateArray.hasOwnProperty('max')
        ? this.validateArray.max
        : `Enter number lower than ${this.max}`
      : control.hasError('minlength')
      ? this.validateArray.hasOwnProperty('minlength')
        ? this.validateArray.minlength
        : `Minimum characters required: ${this.minlength}`
      : control.hasError('maxlength')
      ? this.validateArray.hasOwnProperty('maxlength')
        ? this.validateArray.maxlength
        : `"Maximum characters allowed: ${this.maxlength}`
      : control.hasError('pattern')
      ? this.validateArray.hasOwnProperty('pattern')
        ? this.validateArray.pattern
        : 'Invalid value entered'
      : control.hasError('rangeError')
      ? this.validateArray.hasOwnProperty('rangeError')
        ? this.validateArray.pattern
        : 'Invalid Range'
      : control.hasError('decimalPlacesExceeded');
  }
  change(value: string) {
    this.text = value;
    this.textChange.emit(value);
  }

  customScoreChange(value: string) {
    this.text = value;
    this.textChange.emit(parseFloat(value));
  }
  onFocusOutEvent(event: Event) {
    this.focusOut.emit();
  }

  setTarget(event: any) {
    this.targetValue.emit(event);
  }

  checkLength(event: {keyCode: number; preventDefault: () => void}) {
    if (
      this.text &&
      this.maxlength &&
      this.text.toString().length >= this.maxlength &&
      event.keyCode !== num8
    )
      event.preventDefault();
    if (
      (event.keyCode === ENTER_KEY_CODE || event.keyCode === SPACE_KEY_CODE) &&
      this.achievementInput
    ) {
      this.focusOut.emit();
    }
    // if (this.checkValue(event.key, 'number') && event.keyCode !== 8)
    //   event.preventDefault();
  }

  _keyUp(event: KeyboardEvent) {
    const keyCode = event.keyCode;
    if (keyCode === num65) {
      event.stopPropagation();
    }
    const excludedKeys = [num8, num37, num39, num46, num32];
    if (this.validateType) {
      if (this.validateType === 'number') {
        this.allowOnlyNumbers(event);
      }
      if (this.validateType === 'string') {
        if (
          !(
            (keyCode >= num64 && keyCode <= num90) ||
            excludedKeys.includes(keyCode)
          )
        ) {
          event.preventDefault();
        }
      }
    }
    //prevent further event propagation on enter key
    if (event.keyCode === ENTER_KEY_CODE || event.keyCode === SPACE_KEY_CODE) {
      if (!this.weighatgeEdit) {
        event.stopPropagation();
      }
    }
  }

  clearText() {
    this.change('');
  }

  checkValue(value: string, validate?: any) {
    validate = this.validateType || validate;
    if (value) {
      switch (validate) {
        case 'phoneNo':
          return /[^+0-9]/g.test(value);
        case 'number':
          return /[^0-9]/g.test(value);
        case 'floatNumber':
          return /[^0-9.]/g.test(value);
        case 'time':
          return /[^0-9:\b]/g.test(value);
        case 'letterNumber': // all letter and number without special char
          return /[!@#$%^&*()_+\-=\[\]{};':'\\|,.<>\/?]*$/g.test(value);
        case 'letter': // all characters except number
          return /[0-9]/g.test(value);
        case 'alphabet': // only alphabet without special char
          return /[0-9!@#$%^&*()_+\-=\[\]{};':'\\|,.<>\/?]*$/g.test(value);
      }
    }
    return false;
  }

  // sonarignore:start
  allowOnlyNumbers(e: KeyboardEvent) {
    // prevent: "e", "=", ",", "-", "."
    const symbols = this.decimals
      ? this.notAllowedNumberSymbols.filter(v => v !== '.')
      : this.notAllowedNumberSymbols;
    if (
      // Allow: Delete, Backspace, Tab, Escape, Enter, etc
      this.navigationKeys.indexOf(e.key) > -1 ||
      (e.key === 'a' && e.ctrlKey === true) || // Allow: Ctrl+A
      (e.key === 'c' && e.ctrlKey === true) || // Allow: Ctrl+C
      (e.key === 'v' && e.ctrlKey === true) || // Allow: Ctrl+V
      (e.key === 'x' && e.ctrlKey === true) || // Allow: Ctrl+X
      (e.key === 'a' && e.metaKey === true) || // Cmd+A (Mac)
      (e.key === 'c' && e.metaKey === true) || // Cmd+C (Mac)
      (e.key === 'v' && e.metaKey === true) || // Cmd+V (Mac)
      (e.key === 'x' && e.metaKey === true) // Cmd+X (Mac)
    ) {
      return; // let it happen, don't do anything
    }
    // Ensure that it is a number and stop the keypress &  prevent: "e", "=", ",", "-", "."
    if (e.key === ' ' || symbols.includes(e.key) || isNaN(Number(this.text))) {
      e.preventDefault();
    }
  }

  pasteNumber(e: ClipboardEvent) {
    const clipboardData = e.clipboardData;
    const pastedText = clipboardData?.getData('text');

    const array = this.decimals
      ? this.notAllowedNumberSymbols.filter(v => v !== '.')
      : this.notAllowedNumberSymbols;
    if (
      !array.some(v => pastedText?.includes(v)) &&
      (Number(pastedText) || Number(pastedText) === 0)
    ) {
      return;
    } else {
      e.preventDefault();
    }
  }
  // sonarignore:end

  pasteTextNumber(e: ClipboardEvent) {
    if (this.validateType === 'number') {
      this.pasteNumber(e);
    }

    this.emitPastedText(e);
  }

  onIconClickHandle(event: {stopPropagation: () => void}) {
    event.stopPropagation();
    this.onIconClick.emit(true);
  }

  inputBoxFocus(value: boolean) {
    this.inFocus = value;
  }
  onPaste(_event: ClipboardEvent) {
    this.emitPastedText(_event);
  }
  emitPastedText(_event: ClipboardEvent) {
    this.onPasteEvent.emit(_event);
  }
}
