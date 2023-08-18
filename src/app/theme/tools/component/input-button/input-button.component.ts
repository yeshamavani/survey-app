import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'input-button',
  templateUrl: './input-button.component.html',
  styleUrls: ['./input-button.component.scss'],
})
export class InputButtonComponent {
  spinnerId = '';
  btnId = '';
  @Input() type:
    | 'basic'
    | 'stroked-progress'
    | 'raised'
    | 'stroked'
    | 'flat'
    | 'icon'
    | 'icon-stroked'
    | 'icon-stroked-circle' = 'basic';
  @Input() width = '';
  @Input() height = '';
  @Input() value = '';
  @Input() color = '';
  @Input() matIconLeft = '';
  @Input() matIconRight = '';
  @Input() iconType = 'material';
  @Input() fontSet = 'icomoon';
  @Input() progress = 0;

  @Input() margin = '0';

  @Input() badgeCount: number;
  @Input() disabled: boolean | undefined = false;
  @Input() tooltip: string;

  @Input() bgColor = '';
  //@Input() iconType = 'material';
  @Input() textSize = ''; //
  @Input() iconSize = ''; //
  @Input() iconName = '';
  @Input() styleName = 'default'; // default and icon and icon-border -- values =simple, square-simple,  circle-simple
  @Input() textColor = ''; //
  @Input() iconColor = ''; //
  @Input() border = ''; //

  @Input() borderColor = '#D5D5D5';
  @Input() borderRadius = '';
  @Input() stopPropagation = false;
  @Input('automation-id') automationId = '';
  @Input() buttonClass = '';
  @Output() clickButton = new EventEmitter();

  click(event: {stopPropagation: () => void}) {
    if (this.disabled) {
      return;
    }
    if (this.stopPropagation) {
      event.stopPropagation();
    }
    this.clickButton.emit();
  }
}
