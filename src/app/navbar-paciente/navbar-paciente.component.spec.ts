import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarPacienteComponent } from './navbar-paciente.component';

describe('NavbarPacienteComponent', () => {
  let component: NavbarPacienteComponent;
  let fixture: ComponentFixture<NavbarPacienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarPacienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
