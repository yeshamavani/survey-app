import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-no-data-found',
  templateUrl: './no-data-found.component.html',
  styleUrls: ['./no-data-found.component.scss'],
})
export class NoDataFoundComponent {
  imageUrl = '';
  @Input()
  imagePath!: string;
  @Input()
  titleText!: string;
  @Input()
  subtitleText!: string;
  @Input() containerClass = 'no-data-container';
  @Input() addNewBtn = false;
  @Input() addSecondButton = false;
  @Input() showSubtitleText = true;
  @Input() addButtonText = 'Add new';
  @Input() secondButtonText = 'Add new2';
  @Output() buttonClick = new EventEmitter();
  @Output() secondButtonClick = new EventEmitter();
  @Input()
  height!: string;
  @Input() isFilterApplied = '';
  @Input() lineBreakInSubtitleText = false;

  constructor() {
  }

  ngOnInit() {
    this.imageUrl = `assets/images/clm-images/no-data-found/${this.imagePath}.svg`;
  }

  addNew() {
    this.buttonClick.emit();
  }

  secondButtonClickHandler() {
    this.secondButtonClick.emit();
  }
}
