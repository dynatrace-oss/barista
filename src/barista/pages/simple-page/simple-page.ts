import { Component } from '@angular/core';
import { BaPageContents } from 'shared/page-contents';

@Component({
  selector: 'ba-simple-page',
  templateUrl: 'simple-page.html',
})
export class BaSimplePage {
  content: BaPageContents;
}
