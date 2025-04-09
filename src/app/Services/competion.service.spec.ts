import { TestBed } from '@angular/core/testing';

import { CompetionService } from './competion.service';

describe('CompetionService', () => {
  let service: CompetionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompetionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
