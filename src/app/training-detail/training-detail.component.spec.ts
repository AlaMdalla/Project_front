import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingDetailComponent } from './training-detail.component';

describe('TrainingDetailComponent', () => {
  let component: TrainingDetailComponent;
  let fixture: ComponentFixture<TrainingDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrainingDetailComponent]
    });
    fixture = TestBed.createComponent(TrainingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
