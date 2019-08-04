import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription, combineLatest} from 'rxjs';

import {CategoriesService} from '../shared/services/categories.service';
import {EventsService} from '../shared/services/events.service';
import {Category} from '../shared/models/category.model';
import {RecordEvent} from '../shared/models/event.model';

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss']
})
export class HistoryPageComponent implements OnInit, OnDestroy {

  subscription: Subscription

  constructor(
    private categoriesService: CategoriesService,
    private eventService: EventsService
    ) { }

  isLoaded = false;

  categories: Category[] = [];
  events: RecordEvent[] = [];

  chartData = [];

  ngOnInit() {
    this.subscription = combineLatest(
      this.categoriesService.getCategories(),
      this.eventService.getEvents()
    ).subscribe((data: [Category[], RecordEvent[]]) => {
      this.categories = data[0];
      this.events = data[1];

      this.calculateChartData();

      this.isLoaded = true;
    });
  }

  calculateChartData(): void {
    this.chartData = [];
    this.categories.forEach((category) => {
      const categoryEvent = this.events.filter( e => e.category === category.id && e.type === 'outcome');
      // used data in ngx-charts-pie-chart
      this.chartData.push({
        name: category.name,
        value: categoryEvent.reduce((total, e) => {
          total += e.amount;
          return total;
        }, 0)
      });
    });
  }

  ngOnDestroy() {
    if (this.subscription) { this.subscription.unsubscribe(); }
  }

}
