import { async, TestBed } from '@angular/core/testing';
import { DataAccessStrapiModule } from './data-access-strapi.module';

describe('DataAccessStrapiModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DataAccessStrapiModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(DataAccessStrapiModule).toBeDefined();
  });
});
