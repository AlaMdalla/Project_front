import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatFormComponent } from './candidat-form.component';

describe('CandidatFormComponent', () => {
  let component: CandidatFormComponent;
  let fixture: ComponentFixture<CandidatFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CandidatFormComponent]
    });
    fixture = TestBed.createComponent(CandidatFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
