import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: `<dt-key-value-list dt-column="3">
      <dt-key-value-list-item>
        <ng-container key><a href="https://www.dynatrace.com/" class="dt-link" target="_blank">Please visit dynatrace.com for more information</a></ng-container>
        <ng-container value><a href="https://www.dynatrace.com/" class="dt-link" target="_blank">dynatrace.com</a></ng-container>
      </dt-key-value-list-item>

      <dt-key-value-list-item>
        <ng-container key>Use the &lt;kbd&gt; to indicate input that is typically entered via keyboard</ng-container>
        <ng-container value>
          For global search, press <kbd><kbd>ctrl</kbd> + <kbd>shift</kbd> + <kbd>f</kbd></kbd>
        </ng-container>
      </dt-key-value-list-item>

      <dt-key-value-list-item>
        <ng-container key>&lt;abbr&gt; element</ng-container>
        <ng-container value>
          <abbr title="attribute">attribute</abbr>
        </ng-container>
      </dt-key-value-list-item>

      <dt-key-value-list-item>
        <ng-container key>&lt;mark&gt; element</ng-container>
        <ng-container value>
          You can use the mark tag to <mark>highlight</mark> text.
        </ng-container>
      </dt-key-value-list-item>

      <dt-key-value-list-item>
        <ng-container key>&lt;del&gt; element</ng-container>
        <ng-container value>
          This text contains some <del>deleted</del> text.
        </ng-container>
      </dt-key-value-list-item>

      <dt-key-value-list-item>
        <ng-container key>&lt;ins&gt; element</ng-container>
        <ng-container value>
          This line of text is meant to be <ins>treated as an addition</ins> to the document.
        </ng-container>
      </dt-key-value-list-item>

      <dt-key-value-list-item>
        <ng-container key>&lt;strong&gt; element</ng-container>
        <ng-container value>
          Example <strong>usage of bold text</strong>
        </ng-container>
      </dt-key-value-list-item>

      <dt-key-value-list-item>
        <ng-container key>For indicating sample output from a program use the &lt;samp&gt; tag</ng-container>
        <ng-container value>
          <samp>This text is meant to be treated as sample output from a computer program.</samp>
        </ng-container>
      </dt-key-value-list-item>

      <dt-key-value-list-item>
        <ng-container key>Superscript and subscript texts</ng-container>
        <ng-container value>This text contains <sup>superscript</sup> and <sub>subscript</sub> texts</ng-container>
      </dt-key-value-list-item>

      <dt-key-value-list-item>
        <ng-container key>The &lt;q&gt; tag defines a short quotation. Browsers normally insert quotation marks around the quotation.</ng-container>
        <ng-container value>Dynatrace: <q>Software intelligence for the enterprise cloud</q> Go beyond APM with our all-in-one platform
        </ng-container>
      </dt-key-value-list-item>

</dt-key-value-list>`,
})
@OriginalClassName('HtmlKeyValueListExampleComponent')
export class HtmlKeyValueListExampleComponent {
}
