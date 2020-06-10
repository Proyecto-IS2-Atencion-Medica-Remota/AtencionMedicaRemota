import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeMedicoComponent } from './home-medico.component';

describe('HomeMedicoComponent', () => {
  let component: HomeMedicoComponent;
  let fixture: ComponentFixture<HomeMedicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeMedicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeMedicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
