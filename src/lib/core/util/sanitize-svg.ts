import { Renderer2 } from '@angular/core';

/** function that sanitizes svg input as string - it removes script tags within */
export function sanitizeSvg(svgString: string): SVGElement {
  // tslint:disable-next-line ban
  const div = document.createElement('div');
  // tslint:disable-next-line dt-ban-inner-html
  div.innerHTML = svgString;
  [].slice.call(div.getElementsByTagName('script')).forEach((script: HTMLScriptElement) => {
    script.parentNode!.removeChild(script);
  });

  const svg = div.getElementsByTagName('svg')[0];

  if (!svg) {
    throw new Error('<svg> tag not found');
  }
  return svg;
}
