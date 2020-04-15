import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenamegroupComponent } from './renamegroup.component';

describe('RenamegroupComponent', () => {
  let component: RenamegroupComponent;
  let fixture: ComponentFixture<RenamegroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenamegroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenamegroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
