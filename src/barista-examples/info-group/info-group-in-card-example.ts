import { Component } from '@angular/core';
// tslint:disable: dt-card-needs-title dt-icon-names

@Component({
  moduleId: module.id,
  selector: 'component-barista-example',
  template: `
    <div class="grid">
      <dt-card dtTheme="purple">
        <dt-info-group>
          <dt-info-group-icon
            ><dt-icon name="timemeasurement"></dt-icon
          ></dt-info-group-icon>
          <dt-info-group-title>5 min 30 s</dt-info-group-title>
          Session duration
        </dt-info-group>
        <dt-info-group>
          <dt-info-group-icon
            ><dt-icon name="user-uem"></dt-icon
          ></dt-info-group-icon>
          <dt-info-group-title>ben</dt-info-group-title>
          User identifier
        </dt-info-group>
        <dt-info-group>
          <dt-info-group-icon
            ><dt-icon name="application"></dt-icon
          ></dt-info-group-icon>
          <dt-info-group-title>easyTravel Protal</dt-info-group-title>
          Application name
        </dt-info-group>
        <dt-info-group>
          <dt-info-group-icon
            ><dt-icon name="finishflag"></dt-icon
          ></dt-info-group-icon>
          <dt-info-group-title>2</dt-info-group-title>
          Conversation goals
        </dt-info-group>
        <dt-info-group>
          <dt-info-group-icon
            ><dt-icon name="realuser-monitorwebsiteusers"></dt-icon
          ></dt-info-group-icon>
          <dt-info-group-title>Satisfied</dt-info-group-title>
          User experience score
        </dt-info-group>
        <dt-info-group>
          <dt-info-group-icon
            ><dt-icon name="incident"></dt-icon
          ></dt-info-group-icon>
          <dt-info-group-title>2</dt-info-group-title>
          Errors and annoyances
        </dt-info-group>
        <dt-info-group>
          <dt-info-group-icon
            ><dt-icon name="ios"></dt-icon
          ></dt-info-group-icon>
          <dt-info-group-title>OS X El Capitan 10.1</dt-info-group-title>
          Operating system
        </dt-info-group>
        <dt-info-group>
          <dt-info-group-icon
            ><dt-icon name="desktop"></dt-icon
          ></dt-info-group-icon>
          <dt-info-group-title>1280x768px</dt-info-group-title>
          Screen size
        </dt-info-group>
        <dt-info-group>
          <dt-info-group-icon
            ><dt-icon name="webpages"></dt-icon
          ></dt-info-group-icon>
          <dt-info-group-title>Chrome 70</dt-info-group-title>
          Browser
        </dt-info-group>
        <dt-info-group>
          <dt-info-group-icon
            ><dt-icon name="pinpoint-location"></dt-icon
          ></dt-info-group-icon>
          <dt-info-group-title>Rome, Italy</dt-info-group-title>
          Geo location
        </dt-info-group>
      </dt-card>
    </div>
  `,
  styles: [
    `
      .grid ::ng-deep .dt-card-content {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-template-rows: repeat(auto-fill, auto);
        grid-column-gap: 20px;
        grid-row-gap: 20px;
      }
    `,
  ],
})
export class InfoCardInCardExample {}
