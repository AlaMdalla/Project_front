import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListereclamationComponent } from './listereclamation.component';

describe('ListereclamationComponent', () => {
  let component: ListereclamationComponent;
  let fixture: ComponentFixture<ListereclamationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListereclamationComponent]
    });
    fixture = TestBed.createComponent(ListereclamationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
