import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

import {Bill} from '../models/bill.model';
import {BaseApi} from '../../../shared/core/base-api';


@Injectable()
export class BillService extends BaseApi {
  constructor(public http: HttpClient) {
    super(http);
  }

  getBill(): Observable<Bill> {
    return this.get('bill');
  }


  // in future would be better paid plan subscribing API for all currency...
  getCurrency(base: string = 'USD'): Observable<any> {
    return this.http.get(`https://api.exchangeratesapi.io/latest?base=${base}`)
      .pipe(
        map((response: Response) => response)
      );
  }

}
