import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import * as moment from 'moment';
import {mergeMap} from 'rxjs/operators';

import {Category} from '../../shared/models/category.model';
import {RecordEvent} from '../../shared/models/event.model';
import {EventsService} from '../../shared/services/events.service';
import {BillService} from '../../shared/services/bill.service';
import {Bill} from '../../shared/models/bill.model';
import {Message} from '../../../shared/models/message.model';
import {Subscription} from 'rxjs';



@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit, OnDestroy {

  firstSubscription: Subscription;
  secondSubscription: Subscription;

  @Input() categories: Category[] = [];

  types = [
    {type: 'income', label: 'Доход'},
    {type: 'outcome', label: 'Расход'}
  ];

  message: Message;

  constructor(private eventsService: EventsService, private billService: BillService) { }

  ngOnInit() {
    this.message = new Message('danger', '');
  }

  private showMessage(text: string) {
    this.message.text = text;
    window.setTimeout(() => this.message.text = '', 3000);
  }

  onSubmit(form: NgForm) {
    let { amount, description, category, type } = form.value;
    if (amount < 0) { amount *= -1; }

    const event = new RecordEvent(
      type,
      amount,
      +category,
      moment().format('DD.MM.YYYY HH:mm:ss'), // current date via angular/moment
      description
    );

    this.firstSubscription = this.billService.getBill()
      .subscribe((bill: Bill) => {
        let value = 0;
        if (type === 'outcome') {
          if (amount > bill.value) {
            this.showMessage(`На счету недостаточно средств. Вам не хватает ${amount - bill.value}`);
            return;
          } else {
            value = bill.value - amount;
          }
        } else {
          value = bill.value + amount;
        }

        this.secondSubscription = this.billService.updateBill({value, currency: bill.currency})
          .pipe(
            mergeMap(() => this.eventsService.addEvent(event))
          )
          .subscribe(() => {
            form.setValue({
              amount: 0,
              description: ' ',
              category: 1,
              type: 'outcome'
            });
          });
      });

  }

  ngOnDestroy() {
    if (this.firstSubscription) {  this.firstSubscription.unsubscribe(); }
    if (this.secondSubscription) {  this.secondSubscription.unsubscribe(); }
  }


}
