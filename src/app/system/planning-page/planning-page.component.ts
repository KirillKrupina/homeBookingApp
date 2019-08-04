import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {combineLatest} from 'rxjs';

import {BillService} from '../shared/services/bill.service';
import {CategoriesService} from '../shared/services/categories.service';
import {EventsService} from '../shared/services/events.service';
import {Bill} from '../shared/models/bill.model';
import {Category} from '../shared/models/category.model';
import {RecordEvent} from '../shared/models/event.model';


@Component({
  selector: 'app-planning-page',
  templateUrl: './planning-page.component.html',
  styleUrls: ['./planning-page.component.scss']
})
export class PlanningPageComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  bill: Bill;
  categories: Category[] = [];
  events: RecordEvent[] = [];

  isLoaded = false;

  constructor(
    private billService: BillService,
    private categoryService: CategoriesService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.subscription = combineLatest(
      this.billService.getBill(),
      this.categoryService.getCategories(),
      this.eventsService.getEvents()
    ).subscribe((data: [ Bill, Category[], RecordEvent[] ]) => {
      this.bill = data[0];
      this.categories = data[1];
      this.events = data[2];
      this.isLoaded = true;
    });
  }

  getCategoryCost(category: Category): number {
    const categoryEvents = this.events.filter(e => e.category === category.id && e.type === 'outcome');
    return categoryEvents.reduce((total, e) => {
      total += e.amount;
      return total;
    }, 0);
  }

  private getPercent(category: Category): number {
    const percent = (100 * this.getCategoryCost(category)) / category.capacity;
    return percent > 100 ? 100 : percent;
  }

  getCategoryPercent(category: Category): string {
    return this.getPercent(category) + '%';
  }

  getCategoryColorClass(category: Category): string {
    const percent = this.getPercent(category);
    return percent < 60 ? 'success' : percent >= 100 ? 'danger' : 'warning';
  }

  ngOnDestroy() {
    if (this.subscription) { this.subscription.unsubscribe(); }
  }

}
