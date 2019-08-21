import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface StateGroup {
  letter: string;
  names: string[];
}

export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
};

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <form [formGroup]="stateForm">
      <dt-form-field>
        <input
          type="text"
          dtInput
          placeholder="States Group"
          aria-label="States group"
          formControlName="stateGroup"
          [dtAutocomplete]="autoGroup"
        />
        <dt-autocomplete #autoGroup="dtAutocomplete">
          <dt-optgroup
            *ngFor="let group of stateGroupOptions | async"
            [label]="group.letter"
          >
            <dt-option *ngFor="let name of group.names" [value]="name">
              {{ name }}
            </dt-option>
          </dt-optgroup>
        </dt-autocomplete>
      </dt-form-field>
    </form>
  `,
})
export class AutocompleteGroupsExample implements OnInit {
  stateForm: FormGroup = this.fb.group({
    stateGroup: '',
  });

  stateGroups: StateGroup[] = [
    {
      letter: 'A',
      names: ['Alabama', 'Alaska', 'Arizona', 'Arkansas'],
    },
    {
      letter: 'C',
      names: ['California', 'Colorado', 'Connecticut'],
    },
    {
      letter: 'D',
      names: ['Delaware'],
    },
    {
      letter: 'F',
      names: ['Florida'],
    },
    {
      letter: 'G',
      names: ['Georgia'],
    },
    {
      letter: 'H',
      names: ['Hawaii'],
    },
    {
      letter: 'I',
      names: ['Idaho', 'Illinois', 'Indiana', 'Iowa'],
    },
  ];

  stateGroupOptions: Observable<StateGroup[]>;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.stateGroupOptions = this.stateForm
      .get('stateGroup')!
      .valueChanges.pipe(
        startWith(''),
        map((value: string) => this._filterGroup(value)),
      );
  }

  private _filterGroup(value: string): StateGroup[] {
    if (value) {
      return this.stateGroups
        .map(group => ({
          letter: group.letter,
          names: _filter(group.names, value),
        }))
        .filter(group => group.names.length > 0);
    }

    return this.stateGroups;
  }
}
