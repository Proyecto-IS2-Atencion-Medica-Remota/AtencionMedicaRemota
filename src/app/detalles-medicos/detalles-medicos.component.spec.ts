import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesMedicosComponent } from './detalles-medicos.component';

describe('DetallesMedicosComponent', () => {
  let component: DetallesMedicosComponent;
  let fixture: ComponentFixture<DetallesMedicosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetallesMedicosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallesMedicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
