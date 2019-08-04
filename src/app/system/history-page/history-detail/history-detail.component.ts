import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {mergeMap} from 'rxjs/operators';
import {Subscription} from 'rxjs';

import {EventsService} from '../../shared/services/events.service';
import {CategoriesService} from '../../shared/services/categories.service';
import {RecordEvent} from '../../shared/models/event.model';
import {Category} from '../../shared/models/category.model';

@Component({
  selector: 'app-history-detail',
  templateUrl: './history-detail.component.html',
  styleUrls: ['./history-detail.component.scss']
})
export class HistoryDetailComponent implements OnInit, OnDestroy {

  event: RecordEvent;
  category: Category;

  isLoaded = false;
  subcription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventsService,
    private categoriesService: CategoriesService
    ) { }

  ngOnInit() {
    this.subcription = this.route.params
      .pipe(
        mergeMap((params: Params) => this.eventService.getEventById(params['id'])),
        mergeMap((event: RecordEvent) => {
          this.event = event;
          return this.categoriesService.getCategoryById(event.category);
        })
      )
      .subscribe((category: Category) => {
        this.category = category;
        this.isLoaded = true;
      });
  }

  ngOnDestroy() {
    if (this.subcription) { this.subcription.unsubscribe(); }
  }

}
