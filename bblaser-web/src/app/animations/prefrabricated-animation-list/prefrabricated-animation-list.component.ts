import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'bb-prefrabricated-animation-list',
  template: `
    <p>
      prefrabricated-animation-list works!
    </p>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrefrabricatedAnimationListComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
