import { sanitizeSvg } from './sanitize-svg';
import { async, TestBed } from '@angular/core/testing';
import { Renderer2, Component } from '@angular/core';
describe('sanitizeSvg', () => {

  let renderer: Renderer2;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestApp],
    });

    TestBed.compileComponents();
    const fixture = TestBed.createComponent(TestApp);
    const testComponent = fixture.debugElement.componentInstance;
    renderer = testComponent.renderer;
  }));

  it('should remove script tag inside svg strings', () => {
    expect(sanitizeSvg('<svg><script>alert(1)</script></svg>').outerHTML).toBe('<svg></svg>');
  });
  it('should remove script tag with type inside svg strings', () => {
    expect(sanitizeSvg('<svg><script type="text/javascript">alert(1)</script></svg>').outerHTML).toBe('<svg></svg>');
  });
  it('should remove nested script tags inside svg strings', () => {
    expect(
      sanitizeSvg('<svg><script>alert(1)<script>alert(1)</script></script></svg>')
        .outerHTML).toBe('<svg></svg>');
  });
  it('should remove multiple script tag inside svg strings', () => {
    expect(
      sanitizeSvg('<svg><script>alert(1)</script><script>alert(1)</script></svg>')
      .outerHTML).toBe('<svg></svg>');
  });
  it('should throw an error if no svg tag is found', () => {
    expect(() => sanitizeSvg('<div></div>')).toThrow(new Error('<svg> tag not found'));
    expect(() => sanitizeSvg('')).toThrow(new Error('<svg> tag not found'));
  });
});

@Component({
  selector: 'dt-test-app',
  template: '',
})
class TestApp {

  constructor(public renderer: Renderer2) {}
}
