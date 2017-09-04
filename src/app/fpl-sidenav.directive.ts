import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: 'fpl-sidenav'
})
export class FplSidenavDirective {

  constructor(el: ElementRef) {
    const container = document.querySelector('fpl-sidenav-container'),
        sidenav = el.nativeElement;

    sidenav.toggle = () => {
      sidenav.opened = !sidenav.opened;
      container.classList.toggle('fpl-sidenav-open');
    }
  }
}
