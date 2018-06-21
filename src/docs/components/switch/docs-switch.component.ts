import { Component } from '@angular/core';
import { DefaultSwitchExampleComponent } from './examples/default-switch-example.component';
import { DarkThemeSwitchExampleComponent } from './examples/dark-theme-switch-example.component';

@Component({
  moduleId: module.id,
  selector: 'docs-switch',
  templateUrl: 'docs-switch.component.html',
  styleUrls: ['./docs-switch.component.scss'],
})
export class DocsSwitchComponent {
  examples = {
    default: DefaultSwitchExampleComponent,
    darkTheme: DarkThemeSwitchExampleComponent,
  };
}
