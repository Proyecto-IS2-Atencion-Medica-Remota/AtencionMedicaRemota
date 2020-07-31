import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaMedicoComponent } from './agenda-medico.component';

describe('AgendaMedicoComponent', () => {
  let component: AgendaMedicoComponent;
  let fixture: ComponentFixture<AgendaMedicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgendaMedicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaMedicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
