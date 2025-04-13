import { TestBed } from '@angular/core/testing';

import { PoblemService } from './poblem.service';

describe('PoblemService', () => {
  let service: PoblemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoblemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
