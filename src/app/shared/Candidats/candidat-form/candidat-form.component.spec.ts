import { ComponentFixture, TestBed } from '@angular/core/testing';

<<<<<<< HEAD
import { CandidateFormComponent } from './candidat-form.component';

describe('CandidatFormComponent', () => {
  let component: CandidateFormComponent;
  let fixture: ComponentFixture<CandidateFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CandidateFormComponent]
    });
    fixture = TestBed.createComponent(CandidateFormComponent);
=======
import { CandidatFormComponent } from './candidat-form.component';

describe('CandidatFormComponent', () => {
  let component: CandidatFormComponent;
  let fixture: ComponentFixture<CandidatFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CandidatFormComponent]
    });
    fixture = TestBed.createComponent(CandidatFormComponent);
>>>>>>> origin/Formation
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
