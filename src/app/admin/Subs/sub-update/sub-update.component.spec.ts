import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubUpdateComponent } from './sub-update.component';

describe('SubUpdateComponent', () => {
  let component: SubUpdateComponent;
  let fixture: ComponentFixture<SubUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubUpdateComponent]
    });
    fixture = TestBed.createComponent(SubUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
