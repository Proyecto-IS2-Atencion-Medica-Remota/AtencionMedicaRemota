import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarMedicoComponent } from './navbar-medico.component';

describe('NavbarMedicoComponent', () => {
  let component: NavbarMedicoComponent;
  let fixture: ComponentFixture<NavbarMedicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarMedicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarMedicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
