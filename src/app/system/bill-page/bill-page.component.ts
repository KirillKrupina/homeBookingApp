import {Component, OnDestroy, OnInit} from '@angular/core';
import {combineLatest, Subscription} from 'rxjs';
import {delay} from 'rxjs/operators';

import {BillService} from '../shared/services/bill.service';
import {Bill} from '../shared/models/bill.model';


@Component({
  selector: 'app-bill-page',
  templateUrl: './bill-page.component.html',
  styleUrls: ['./bill-page.component.scss']
})
export class BillPageComponent implements OnInit, OnDestroy {

  firstSubscription: Subscription;
  secondSubscription: Subscription;

  currency: any;
  bill: Bill;

  isLoaded = false;

  constructor(private billService: BillService) {
  }

  ngOnInit() {
      this.firstSubscription = combineLatest(
      this.billService.getBill(),
      this.billService.getCurrency()
    ).subscribe((data: [Bill, any]) => {
      this.bill = data[0];
      this.currency = data[1];
      this.isLoaded = true;
    });

  }

  onRefresh() {
    this.isLoaded = false;
    this.secondSubscription = this.billService.getCurrency()
      .subscribe((currency: any) => {
        this.currency = currency;
        this.isLoaded = true;
      });
  }

  ngOnDestroy() {
    this.firstSubscription.unsubscribe();
    if (this.secondSubscription) {
      this.secondSubscription.unsubscribe();
    }

  }

}
