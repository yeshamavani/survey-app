import {Component, Input, OnInit, SimpleChanges} from '@angular/core';

const SATURATION = 100;
const LIGHTNESS = 35;
const NUMERIC_HASH = 5;
const HUE = 360;
@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss'],
})
export class UserAvatarComponent implements OnInit {
  @Input()
  name: string;
  @Input() size = '33px'; // size in px
  bgColor = '';
  stringTotal = 0;
  avatarColorCode = ['#50C7AA', '#61AED3', '#21B400', '#8C61D3'];
  // show only first and last name as avatar name
  avtarName = '';

  ngOnInit() {
    this.getTotalIntoString();
    this.bgColor =
      this.avatarColorCode[this.stringTotal % this.avatarColorCode.length];
  }

  getTotalIntoString() {
    const splitCode = this.avtarName.split('');
    let total = 0;
    for (let value of splitCode) {
      total += value.charCodeAt(0);
    }
    this.stringTotal = total;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.['name'].currentValue !== changes?.['name'].previousValue) {
      const name = this.name.split(' ');
      const nameArr = [name[0]];
      if (name?.length > 1) {
        nameArr.push(name[name.length - 1]);
      }
      this.avtarName = nameArr.join(' ');
    }
  }
}
