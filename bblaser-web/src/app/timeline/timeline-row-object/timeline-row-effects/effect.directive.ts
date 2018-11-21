import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[effect-host]'
})
export class EffectDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
