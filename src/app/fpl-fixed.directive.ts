import { Directive, ElementRef, Input } from '@angular/core';
import { WindowRefService } from './window-ref.service';

@Directive({
  selector: '[fpl-fixed]'
})
export class FplFixedDirective {
  constructor(private el: ElementRef, private windowRef: WindowRefService) {}

  ngOnInit() {
    let parent;
    if(this.parentSelector === 'window') {
      parent = this.windowRef.nativeWindow;
      parent.addEventListener('scroll', () => {
        this.el.nativeElement.style.transform = `translateY(${parent.pageYOffset}px)`;
      });
    } else {
      parent = document.querySelector(this.parentSelector);
      parent.addEventListener('scroll', () => {
        this.el.nativeElement.style.transform = `translateY(${parent.scrollTop}px)`;
      });
    }
  }

  @Input('fpl-fixed') parentSelector: string;
}
