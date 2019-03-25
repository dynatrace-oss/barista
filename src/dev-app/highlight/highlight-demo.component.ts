import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `
    <p dt-highlight term="s">
      Some <b>text where</b> a part should be highlighted
    </p>
    <hr>
    <p dt-highlight term="wher">Some text where a part should be highlighted</p>
    <hr>
    <span dt-highlight term="s">Some text where some parts should be highlighted</span>
    <hr>
    <span dt-highlight term="s" caseSensitive>
      Case sensetivSome text where some parts should be highlighted
    </span>
    <hr>
    <p dt-highlight term="wher">
      asdf Some <b>text where</b> a part should be highlighted
    </p>
    <hr>
    <div dt-highlight term="wher">
      <p>DIV text where a part should be highlighted</p>
    </div>
    <hr>
    <p dt-highlight term="wher">
      Some text where a part should <em>be</em> highlighted
    </p>
    <hr>
    <p dt-highlight term="">
     NO highlight text where a part should <em>be</em> highlighted
    </p>
    <hr>
    <dt-highlight term="pa">
     NO highlight text where a part should <em>be</em> highlighted
    </dt-highlight>
    <hr>
  `,
})
export class HighlightDemo {}
