import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilPacienteComponent } from './perfil-paciente.component';

describe('PerfilPacienteComponent', () => {
  let component: PerfilPacienteComponent;
  let fixture: ComponentFixture<PerfilPacienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerfilPacienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
