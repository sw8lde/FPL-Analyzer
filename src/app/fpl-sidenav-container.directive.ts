import { Directive } from '@angular/core';

@Directive({
  selector: 'fpl-sidenav-container',
  host: {
    '[style.display]': '"block"',
  }
})
export class FplSidenavContainerDirective {}
