import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroespecialistaComponent } from './registroespecialista.component';

describe('RegistroespecialistaComponent', () => {
  let component: RegistroespecialistaComponent;
  let fixture: ComponentFixture<RegistroespecialistaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroespecialistaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroespecialistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
