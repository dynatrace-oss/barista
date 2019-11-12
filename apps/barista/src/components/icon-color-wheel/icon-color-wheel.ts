import { Component, ElementRef, Input, ViewChild } from '@angular/core';

import { DtSwitchChange } from '@dynatrace/barista-components/switch';
import { DtColors } from '@dynatrace/barista-components/theming';

interface BaColorWheelBlob {
  colorName: string;
  isLight: boolean;
  fillColor: string;
  colorgroup: string;
  border: string;
  cx?: number;
  cy?: number;
  r?: number;
}

let uniqueColorwheelId = 0;

@Component({
  selector: 'ba-icon-color-wheel',
  templateUrl: './icon-color-wheel.html',
  styleUrls: ['./icon-color-wheel.scss'],
})
export class BaIconColorWheel {
  @Input() iconname: string;

  /** @internal */
  @ViewChild('colorwheel', { static: true }) _colorwheel: ElementRef;

  /** @internal whether the background of the preview circle is dark */
  _previewCircleColorIsDark = false;
  /** @internal unique id of the icon */
  _iconId: string;
  /** @internal current fill color of the icon */
  _iconFillColor = DtColors.GRAY_700;
  /** @internal all colored circle blobs */
  _coloredBlobs: BaColorWheelBlob[];

  /** whether the icon should be downloaded as png */
  private _convertToPng = false;

  constructor() {
    const groupedBlobs = Object.keys(DtColors)
      .map((key): BaColorWheelBlob | undefined => {
        /* tslint:disable no-magic-numbers */
        const parts = key.split('_');
        const colorgroup = parts[0] !== 'WHITE' ? parts[0] : 'GRAY';
        const lightness = parseInt(parts[1], 10);
        const isLight = lightness < 500 || !lightness;
        let border = 'none';

        if (isLight) {
          const borderColor = `${colorgroup}_500`;
          border = `${DtColors[borderColor]}`;
        }

        if (lightness && lightness % 100 !== 0) {
          return;
        }

        return {
          colorName: key.toLocaleLowerCase(),
          isLight,
          fillColor: DtColors[key],
          colorgroup,
          border,
        };
      })
      .filter(Boolean)
      .reduce((aggregator, colorBlob: BaColorWheelBlob) => {
        aggregator[colorBlob.colorgroup] =
          aggregator[colorBlob.colorgroup] || [];
        aggregator[colorBlob.colorgroup].push(colorBlob);
        return aggregator;
      }, new Map<string, BaColorWheelBlob[]>());

    const blobs = Object.entries(groupedBlobs)
      .map(
        (
          [_colorGroupName, colorBlobGroup],
          groupIndex,
          originalGroupedBlobsArray,
        ) => {
          const colorBlobs = colorBlobGroup.map((colorBlob, blobIndex) => {
            const blobIndexBaseOne = Number(blobIndex) + 1;
            const sigma = (Math.PI / 20) * blobIndexBaseOne;

            // Angle based on the current group index, spread around the whole cirle.
            const groupSigma =
              (groupIndex - 1) *
              ((Math.PI * 2) / originalGroupedBlobsArray.length);

            const vt = blobIndexBaseOne * 3;
            const c = blobIndexBaseOne * 2.5;

            // Calculate a starting position around the center circle
            const baseCircleRadius = 10;
            const circleBorderX = baseCircleRadius * Math.cos(groupSigma);
            const circleBorderY = baseCircleRadius * Math.sin(groupSigma);

            // Calculate the x and y position of each
            const cx = circleBorderX + (vt + c) * Math.cos(sigma + groupSigma);
            const cy = circleBorderY + (vt + c) * Math.sin(sigma + groupSigma);

            const minRadius = 2;
            const r = blobIndex * 0.3 + minRadius;
            /* tslint:enable no-magic-numbers */
            const newBlob = {
              ...colorBlob,
              cx,
              cy,
              r,
            };
            return newBlob;
          });
          return colorBlobs;
        },
      )
      .reduce(
        (aggregator, element) => [...aggregator, ...element],
        [] as BaColorWheelBlob[],
      );

    this._coloredBlobs = blobs;
    this._iconId = `ba-icon-color-wheel-iconId-${++uniqueColorwheelId}`;
  }

  /** @internal */
  _switchChanged(switchChangeEvent: DtSwitchChange<void>): void {
    this._convertToPng = switchChangeEvent.checked;
  }

  /**
   * @internal
   * change the colors of the icon preview
   * accoring to the color of the hovered blob
   */
  _handleBlobHover(fillColor: DtColors, isIconLight: boolean): void {
    this._iconFillColor = fillColor ? fillColor : DtColors.GRAY_700;
    this._previewCircleColorIsDark = isIconLight ? true : false;
  }

  /**
   * @internal
   * handle the click on a blob
   */
  _handleBlobClick(fillColor: string, colorName: string): void {
    const svgSource =
      document
        .getElementById(this._iconId)!
        .innerHTML.replace(/fill="inherit"/g, `fill="${fillColor}"`) || '';

    if (this._convertToPng) {
      this._downloadPNG(svgSource, this.iconname, colorName);
    } else {
      this._downloadSVG(svgSource, this.iconname, colorName);
    }
  }

  /**
   * download the icon as png file
   * @param svgsource path of the svg
   * @param iconname name of the icon
   * @param colorname name of the selected color
   */
  private _downloadPNG(
    svgsource: string,
    iconname: string,
    colorname: string,
  ): void {
    // create a canvas node
    // the canvas has to be created to download the icon as a png file
    // to do so the linting rule has to be disabled.
    const canvas = document.createElement('canvas'); // tslint:disable-line
    canvas.setAttribute('width', '512');
    canvas.setAttribute('height', '512');
    const context = canvas.getContext('2d')!;
    const img = new Image();
    img.onload = () => {
      // once the image is loaded, draw it on the canvas
      context.drawImage(img, 0, 0);
      const name = `${iconname}-${colorname}.png`;
      const data = canvas.toDataURL('img/png');
      if (!window.navigator.msSaveOrOpenBlob) {
        // get the dataURI as PNG
        this._downloadData(name, data);
      } else {
        const parts = data.split(/[:;,]/);
        const type = parts[1];
        const binData = window.atob(parts.pop()!);
        const mx = binData.length;
        const uiArr = new Uint8Array(mx);
        for (let i = 0; i < mx; ++i) {
          uiArr[i] = binData.charCodeAt(i);
        }
        const blob = new Blob([uiArr], {
          type,
        });
        this._downloadEdgeData(name, blob);
      }
    };
    // load the svg image to draw on the canvas
    img.src = `data:image/svg+xml;base64,${window.btoa(svgsource)}`;
  }

  /**
   * download the icon as svg file
   * @param svgsource path of the svg
   * @param iconname name of the icon
   * @param colorname name of the selected color
   */
  private _downloadSVG(
    svgsource: string,
    iconname: string,
    colorname: string,
  ): void {
    const name = `${iconname}-${colorname}.svg`;
    if (!window.navigator.msSaveOrOpenBlob) {
      const data = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
        svgsource,
      )}`;
      this._downloadData(name, data);
    } else {
      const blob = new Blob([svgsource], {
        type: 'image/svg+xml',
      });
      this._downloadEdgeData(name, blob);
    }
  }

  /**
   * download the data uri generated by the conversion functions
   */
  private _downloadData(name: string, data: string): void {
    // the link has to be created to start the download of the icon file
    const downloadLink = document.createElement('a'); // tslint:disable-line
    downloadLink.setAttribute('href', data);
    downloadLink.setAttribute('download', name);
    downloadLink.style.display = 'none';

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  private _downloadEdgeData(name: string, blob: object): void {
    window.navigator.msSaveOrOpenBlob(blob, name);
  }
}
