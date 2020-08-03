import { Component, OnInit} from '@angular/core';
import {ComponentFactoryResolver} from '@angular/core'


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  opcionSeleccionado: string  = '0';
  verSeleccion: string        = '';
  opciones;

  constructor() {
    this.opciones=["Paciente","Profesional de la Salud"];
  }
  
  ngOnInit(): void {

  }

}
