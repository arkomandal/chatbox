import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionoutComponent } from './sessionout.component';

describe('SessionoutComponent', () => {
  let component: SessionoutComponent;
  let fixture: ComponentFixture<SessionoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
