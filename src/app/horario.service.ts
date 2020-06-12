import { Injectable } from '@angular/core';
import { Horario } from "../app/horario";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HorarioService {

  constructor(private http: HttpClient) { }

  crearHorario() {
    let nuevoHorario: Horario = {
      id: -1, fecha_inicio: new Date(), duracion_dias: 4, dias: JSON.parse('[{"dia": 1,"horas": [{"inicio": "8:00","fin": "9:00"},\
                                                                                                 {"inicio": "10:00","fin": "12:00"}]},\
                                                                             {"dia": 3,"horas": [{"inicio": "10:00","fin": "1:00"},\
                                                                                                 {"inicio": "18:00","fin": "19:00"}]}]'), fecha_fin: new Date()};
    return nuevoHorario
  }

  getAll(): Observable<Horario[]> {
    return this.http.get<Horario[]>('http://localhost:8000/verEspecialista', {headers: new HttpHeaders({'Content-Type':'application/json'})})
  }
}
