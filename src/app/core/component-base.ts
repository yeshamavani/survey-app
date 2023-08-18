import {Component, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

@Component({
  template: '',
})
export class ComponentBase implements OnDestroy {
  protected _subscriptions: Subscription[] = [];
  constructor() {
    // Intentional
  }
  ngOnDestroy() {
    this.clearAllSubscriptions();
  }

  clearAllSubscriptions() {
    this._subscriptions.forEach(subscription => {
      if (subscription) {
        console.log('Unscribing Subscription');
        subscription.unsubscribe();
      }
    });
    this._subscriptions = [];
  }
}
