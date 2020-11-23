import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

export interface IStarContext {
  index: number;
  fill: number;
}

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {

  stars: IStarContext[] = [];

  @Input()
  max: number;

  @Input()
  rate: number;

  @Output()
  rateChange = new EventEmitter<number>();

  @Input()
  readonly: boolean;

  constructor(private logger: NGXLogger) {
    this.max = 5;
    this.readonly = false;
    this.rate = 0;
  }

  ngOnInit(): void {
    this.stars = Array.from({ length: this.max }, (v, k) => ({ fill: 0, index: k }));
    this.rate = !this.rate ? 0 : this.rate;

    this.logger.debug(`Using rate: ${this.rate}`);

    this.update(this.rate);
  }

  handleClick(newRate: number): void {
    if (!this.readonly) {

      this.logger.debug(`Rate changed from ${this.rate} to ${newRate}`);

      this.rate = newRate;
      this.rateChange.emit(this.rate);
      this.update(this.rate);
    }
  }

  enter(rate: number): void {
    if (!this.readonly) {
      this.update(rate);
    }
  }

  reset(): void {
    this.update(this.rate);
  }

  private update(rate: number): void {
    this.stars.forEach((context, index) => {
      context.fill = Math.round(Math.max(Math.min(rate - index, 1), 0) * 100);
    });
  }

}
