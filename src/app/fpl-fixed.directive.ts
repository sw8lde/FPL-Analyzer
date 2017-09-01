import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[fpl-fixed]'
})
export class FplFixedDirective {
  constructor(private el: ElementRef) {}

  ngOnInit() {
    let parent = document.querySelector(this.parentSelector);
    parent.addEventListener('scroll', () => {
      this.el.nativeElement.style.transform = `translateY(${parent.scrollTop}px)`;
    });
  }

  @Input('fpl-fixed') parentSelector: string;
}
