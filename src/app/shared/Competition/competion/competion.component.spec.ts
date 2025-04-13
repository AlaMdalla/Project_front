import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetionComponent } from './competion.component';

describe('CompetionComponent', () => {
  let component: CompetionComponent;
  let fixture: ComponentFixture<CompetionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompetionComponent]
    });
    fixture = TestBed.createComponent(CompetionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
