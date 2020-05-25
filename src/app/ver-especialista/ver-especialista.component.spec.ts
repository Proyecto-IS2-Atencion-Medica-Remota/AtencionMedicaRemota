import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerEspecialistaComponent } from './ver-especialista.component';

describe('VerEspecialistaComponent', () => {
  let component: VerEspecialistaComponent;
  let fixture: ComponentFixture<VerEspecialistaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerEspecialistaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerEspecialistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
