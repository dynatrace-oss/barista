import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: `<dt-key-value-list dt-column="3">
  <dt-key-value-list-item>
    <a dtKeyValueListKey href="https://www.dynatrace.com/" class="dt-link" target="_blank">Please visit dynatrace.com for more information</a>
    <a dtKeyValueListValue href="https://www.dynatrace.com/" class="dt-link" target="_blank">dynatrace.com</a>
  </dt-key-value-list-item>

  <dt-key-value-list-item>
    <dt-key-value-list-key>Use the &lt;kbd&gt; to indicate input that is typically entered via keyboard</dt-key-value-list-key>
    <dt-key-value-list-value>
      For global search, press <kbd><kbd>ctrl</kbd> + <kbd>shift</kbd> + <kbd>f</kbd></kbd>
    </dt-key-value-list-value>
  </dt-key-value-list-item>

  <dt-key-value-list-item>
    <dt-key-value-list-key>&lt;abbr&gt; element</dt-key-value-list-key>
    <dt-key-value-list-value>
      <abbr title="attribute">attribute</abbr>
    </dt-key-value-list-value>
  </dt-key-value-list-item>

  <dt-key-value-list-item>
    <dt-key-value-list-key>&lt;mark&gt; element</dt-key-value-list-key>
    <dt-key-value-list-value>
      You can use the mark tag to <mark>highlight</mark> text.
    </dt-key-value-list-value>
  </dt-key-value-list-item>

  <dt-key-value-list-item>
    <dt-key-value-list-key>&lt;del&gt; element</dt-key-value-list-key>
    <dt-key-value-list-value>
      This text contains some <del>deleted</del> text.
    </dt-key-value-list-value>
  </dt-key-value-list-item>

  <dt-key-value-list-item>
    <dt-key-value-list-key>&lt;ins&gt; element</dt-key-value-list-key>
    <dt-key-value-list-value>
      This line of text is meant to be <ins>treated as an addition</ins> to the document.
    </dt-key-value-list-value>
  </dt-key-value-list-item>

  <dt-key-value-list-item>
    <dt-key-value-list-key>&lt;strong&gt; element</dt-key-value-list-key>
    <dt-key-value-list-value>
      Example <strong>usage of bold text</strong>
    </dt-key-value-list-value>
  </dt-key-value-list-item>

  <dt-key-value-list-item>
    <dt-key-value-list-key>For indicating sample output from a program use the &lt;samp&gt; tag</dt-key-value-list-key>
    <dt-key-value-list-value>
      <samp>This text is meant to be treated as sample output from a computer program.</samp>
    </dt-key-value-list-value>
  </dt-key-value-list-item>

  <dt-key-value-list-item>
    <dt-key-value-list-key>Superscript and subscript texts</dt-key-value-list-key>
    <dt-key-value-list-value>This text contains <sup>superscript</sup> and <sub>subscript</sub> texts</dt-key-value-list-value>
  </dt-key-value-list-item>

  <dt-key-value-list-item>
    <dt-key-value-list-key>The &lt;q&gt; tag defines a short quotation. Browsers normally insert quotation marks around the quotation.</dt-key-value-list-key>
    <dt-key-value-list-value>Dynatrace: <q>Software intelligence for the enterprise cloud</q> Go beyond APM with our all-in-one platform</dt-key-value-list-value>
  </dt-key-value-list-item>
</dt-key-value-list>`,
})
@OriginalClassName('HtmlKeyValueListExampleComponent')
export class HtmlKeyValueListExampleComponent {
}
