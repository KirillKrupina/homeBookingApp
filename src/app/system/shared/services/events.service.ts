import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {BaseApi} from '../../../shared/core/base-api';
import {RecordEvent} from '../models/event.model';


@Injectable()
export class EventsService extends BaseApi {
  constructor(public http: HttpClient) {
    super(http);
  }

  addEvent(event: RecordEvent): Observable<RecordEvent> {
    return this.post('events', event);
  }

}
