import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemSubmitionComponent } from './problem-submition.component';

describe('ProblemSubmitionComponent', () => {
  let component: ProblemSubmitionComponent;
  let fixture: ComponentFixture<ProblemSubmitionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProblemSubmitionComponent]
    });
    fixture = TestBed.createComponent(ProblemSubmitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
