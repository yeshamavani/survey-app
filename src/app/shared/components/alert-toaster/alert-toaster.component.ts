import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-alert-toaster',
  templateUrl: './alert-toaster.component.html',
  styleUrls: ['./alert-toaster.component.scss'],
})
export class AlertToasterComponent {
  @Input() firstMsg = '';
  @Input() linkMsg = '';
  @Input() secondMsg = '';
  @Output() goTo = new EventEmitter();
  @Output() close = new EventEmitter();
}
