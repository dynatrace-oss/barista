import { Component, Input } from "@angular/core";

@Component({
  selector: "loading-indicator",
  styles: [`
    .loader {
      padding: 0 28px;
      line-height: 50px;
      height: 50px;
      background-color: rgba(25,25,25,0.65);
      border-radius: 3px;
      white-space: nowrap;
      overflow: hidden;
    }

    .spinner {
      position: relative;
      display: inline-block;
      width: 28px;
      height: 28px;
      border-color: #b4dc00;
    }

    .text {
      display: inline-block;
      box-sizing: border-box;
      width: calc(100% - 30px); /* 100% - SPINNER_WIDTH */
      padding-left: 15px;
      font-weight: 300;
      color: #b4dc00;
      font-size: 18px;
      vertical-align: middle;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .text:empty {
      display: none;
    }
  `],
  template: `
    <div class="loader">
      <div class="spinner">
        <loading-spinner></loading-spinner>
      </div>
      <span class="text">{{ text }}</span>
    </div>
  `,
})
export class LoadingIndicatorComponent {
  @Input() public text: string;
}
