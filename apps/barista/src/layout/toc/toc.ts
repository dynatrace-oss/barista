import { AfterViewInit, Component, Input, ViewChildren } from '@angular/core';

import { BaTocService } from '../../shared/toc.service';

@Component({
  selector: 'ba-toc',
  templateUrl: 'toc.html',
  styleUrls: ['toc.scss'],
  host: {
    class: 'ba-toc',
  },
})
export class BaToc implements AfterViewInit {
  @Input() data: string;

  /** @internal all TOC entries */
  @ViewChildren('headline') _headlines;

  /** @internal all headlines, which should be represented in the TOC  */
  _headings;
  /** @internal whether the Toc is expanded  */
  _expandToc: boolean;

  /** the toc entry that is currently active */
  private _activeElement;

  constructor(private tocService: BaTocService) {
    const docElement = document.getElementById('all-content') || undefined;
    this.tocService.genToc(docElement);
    this._headings = this.tocService.tocItems;
  }

  /** highlight the current headline in the toc */
  ngAfterViewInit(): void {
    this.tocService.activeItem.subscribe(activeItem => {
      if (activeItem) {
        const id = activeItem.getAttribute('id');
        this._headlines.forEach(headline => {
          const headlineId = headline.nativeElement.href.split('#')[1];

          if (headlineId === id) {
            this._activeElement = headline.nativeElement;
            headline.nativeElement.parentNode.classList.add(
              'ba-toc-item-active',
            );
          } else {
            headline.nativeElement.parentNode.classList.remove(
              'ba-toc-item-active',
            );
          }
        });

        if (document.querySelectorAll('.ba-toc-ul-active')[0]) {
          document
            .querySelectorAll('.ba-toc-ul-active')[0]
            .classList.remove('ba-toc-ul-active');
        }

        /* show subheadline list when a subheadline or a headline with
        subheadlines is currently active */
        if (activeItem.tagName.toLowerCase() === 'h3') {
          this._activeElement.parentNode.parentNode.classList.add(
            'ba-toc-ul-active',
          );
        } else if (this._activeElement.parentNode.querySelectorAll('ul')[0]) {
          this._activeElement.parentNode
            .querySelectorAll('ul')[0]
            .classList.add('ba-toc-ul-active');
        }
      }
    });
  }

  /** @internal toggle the expandable menu */
  _expandTocMenu(): void {
    this._expandToc = !this._expandToc;
  }

  /** @internal handle the click on a toc item */
  _handleTocClick(ev: MouseEvent): void {
    /* Preventing the default behavior is necessary, because on Angular component pages
     * there's a base URL defined and the on-page-links are always relative to "/"
     * and not to the current page. */
    ev.preventDefault();
    const targetId = (ev.currentTarget as HTMLElement).getAttribute('href');
    const target = document.querySelector(targetId || '');

    if (target) {
      // Has to be set manually because of preventDefault() above.
      window.location.hash = targetId || '';
      requestAnimationFrame(() => {
        target.scrollIntoView({
          behavior: 'smooth',
        });
      });
    }
  }
}
