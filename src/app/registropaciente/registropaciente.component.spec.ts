import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistropacienteComponent } from './registropaciente.component';

describe('RegistropacienteComponent', () => {
  let component: RegistropacienteComponent;
  let fixture: ComponentFixture<RegistropacienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistropacienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistropacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
