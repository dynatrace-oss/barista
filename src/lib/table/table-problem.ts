import { Component } from '@angular/core';

@Component({
  selector: 'dt-table-problem',
  templateUrl: './table-problem.html',
  styleUrls: ['./table-problem.scss'],
})
export class DtTableProblem {
  color: 'error' | 'warning' = 'error';
}
