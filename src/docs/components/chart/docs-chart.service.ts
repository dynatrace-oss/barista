import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { timer } from 'rxjs/observable/timer';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';

@Injectable()
export class ChartService {
  getStreamedChartdata(): Observable<any> {
    console.log('called streamed data');
    return timer(5000, 5000)
    .pipe(map(() => {
      const data = [];
      for (let i = 0; i < 10; i++) {
        const now = new Date();
        data.push([
          Math.floor(now.getTime() + Math.random() * 100000),
          Math.floor(Math.random() * 100 + 100),
        ]);
      }

      data.sort((a, b) => {
        return a[0] - b[0];
      });

      return [{
        color: '#C396E0',
        name: 'Actions/min',
        data,
      }];
    }));
  }
}
