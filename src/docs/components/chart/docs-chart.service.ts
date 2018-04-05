import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { interval } from 'rxjs/observable/interval';
import { map } from 'rxjs/operators/map';

@Injectable()
export class ChartService {
  getStreamedChartdata(): Observable<any> {
    return interval(8000)
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

      return {
        color: '#C396E0',
        name: 'Actions/min',
        data,
      };
    }));
  }
}

//     return new Observable((observer: Observer<any>): void => {
//       setTimeout(() => {
//           observer.next([{
//             color: '#C396E0',
//             name: 'Actions/min',
//           }]);
//       }, 1000);
//       setTimeout(() => {
//           observer.next([{
//             color: '#C396E0',
//             name: 'Actions/min',
//             data: [
//               [
//                 1370390400000,
//                 120,
//               ],
//               [
//                 1370476800000,
//                 170,
//               ],
//               [
//                 1370563200000,
//                 170,
//               ],
//               [
//                 1370736000000,
//                 180,
//               ],
//               [
//                 1370822400000,
//                 160,
//               ],
//               [
//                 1370908800000,
//                 170,
//               ],
//               [
//                 1370995200000,
//                 90
//               ],
//               [
//                 1371845100000,
//                 140,
//               ],
//             ],
//           }]);
//       }, 10000);
//   });
//   }
// }
