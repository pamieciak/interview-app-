import { Directive, ElementRef, input, Input } from '@angular/core';

@Directive({
  selector: '[appProfitColor]',
  standalone: true,
})
export class ProfitColorDirective {
  private _profit!: number;

  @Input() set appProfitColor(value: number) {
    this._profit = value;
    this.updateColor();
  }

  constructor(private el: ElementRef) {}

  private updateColor(): void {
    if (this._profit > 0) {
      this.el.nativeElement.style.color = 'rgb(60, 193, 149)';
    } else if (this._profit < 0) {
      this.el.nativeElement.style.color = 'rgb(249, 76, 76)';
    } else {
      this.el.nativeElement.style.color = null;
    }
  }
}
