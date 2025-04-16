import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsCreateComponentComponent } from './subs-create-component.component';

describe('SubsCreateComponentComponent', () => {
  let component: SubsCreateComponentComponent;
  let fixture: ComponentFixture<SubsCreateComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubsCreateComponentComponent]
    });
    fixture = TestBed.createComponent(SubsCreateComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
