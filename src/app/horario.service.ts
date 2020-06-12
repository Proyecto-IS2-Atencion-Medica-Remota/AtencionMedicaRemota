import { Injectable } from '@angular/core';
import { Horario } from "../app/horario";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HorarioService {

  constructor(private http: HttpClient) { }

  crearHorario(horario: Horario) {
    let body = new Array();
    for(let [key, value] of Object.entries(horario)){
      if(key == 'dias'){
        body.push(JSON.stringify(value));
      } else if(key != 'id') {
        body.push(value);
      }
    }
    this.http.post('http://localhost:8000/horarioEspecialista', body).subscribe(
      (response) => {console.log(response)},
      (error) => {console.log(error)}
    );
  }

  getAll(): Observable<Horario[]> {
    return this.http.get<Horario[]>('http://localhost:8000/horarioEspecialista', {headers: new HttpHeaders({'Content-Type':'application/json'})})
  }
}
