import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisPacientesComponent } from './mis-pacientes.component';

describe('MisPacientesComponent', () => {
  let component: MisPacientesComponent;
  let fixture: ComponentFixture<MisPacientesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisPacientesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisPacientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
