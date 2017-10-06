import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: 'fpl-expandable-menu'
})
export class FplExpandableMenuDirective implements OnInit {
  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.el.nativeElement
      .getElementsByTagName('header')[0]
      .addEventListener('click', () => {
        this.el.nativeElement.classList.toggle('open');
      });
  }
}
