import { Component, Input } from '@angular/core';

@Component({
  selector: 'ba-page-footer',
  templateUrl: 'page-footer.html',
  styleUrls: ['page-footer.scss'],
  host: {
    class: 'ba-page-footer',
  },
})
export class BaPageFooter {
  /** links to pages, which are related to the current page */
  @Input() relatedTopics: string[];

  /** keywords with which the current page is tagged */
  @Input() tags: string[];

  /** @internal */
  get _hasTags(): boolean {
    return this.tags && this.tags.length > 0;
  }

  /** @internal */
  get _hasRelatedTopics(): boolean {
    return this.relatedTopics && this.relatedTopics.length > 0;
  }
}
