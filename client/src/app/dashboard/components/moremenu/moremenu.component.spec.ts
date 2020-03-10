import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoremenuComponent } from './moremenu.component';

describe('MoremenuComponent', () => {
  let component: MoremenuComponent;
  let fixture: ComponentFixture<MoremenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoremenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoremenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
