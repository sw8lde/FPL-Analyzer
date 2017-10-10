import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[fpl-no-click]'
})
export class FplNoClickDirective implements OnInit {
  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.el.nativeElement
      .addEventListener('click', (ev) => {
        ev.stopPropagation();
      });
  }
}
