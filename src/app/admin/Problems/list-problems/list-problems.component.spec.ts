import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProblemsComponent } from './list-problems.component';

describe('ListProblemsComponent', () => {
  let component: ListProblemsComponent;
  let fixture: ComponentFixture<ListProblemsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListProblemsComponent]
    });
    fixture = TestBed.createComponent(ListProblemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
