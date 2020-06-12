import { Component, OnInit } from '@angular/core';
import { HorarioService } from "../horario.service";
import { Horario } from "../horario";
import { SelectMultipleControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-ver-horario',
  templateUrl: './ver-horario.component.html',
  styleUrls: ['./ver-horario.component.css']
})
export class VerHorarioComponent implements OnInit {
  horarios: Horario[];
  lineas_horarios: number[] = new Array<number>();


  constructor(private horarioService: HorarioService) { }

  ngOnInit(): void {
    //this.getHorarios()
    this.horarios = Array<Horario>(this.horarioService.crearHorario());
    this.horarios.forEach((horario) => this.lineas_horarios.push(horario.dias.reduce((sum, dia) => sum + dia.horas.length, 0)))
  }

  getHorarios() {
    this.horarioService.getAll().subscribe(horarios => this.horarios = horarios)
  }
}