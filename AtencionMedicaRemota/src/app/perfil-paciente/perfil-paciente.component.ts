import { Component, OnInit } from '@angular/core';
import { HttpClient ,HttpParams ,HttpHeaders} from '@angular/common/http';


@Component({
  selector: 'app-perfil-paciente',
  templateUrl: './perfil-paciente.component.html',
  styleUrls: ['./perfil-paciente.component.css']
})
export class PerfilPacienteComponent implements OnInit {
  rut: any;
  paciente$ :any ;
  constructor( private http: HttpClient) { 
    this.rut=localStorage.getItem('rut');
  }

  ngOnInit(): void {
    this.getPaciente();
  }

  getPaciente(){

    let params = new HttpParams().set("rut", this.rut);
    

    this.http.get('http://localhost:8000/perfilPaciente',{headers: new HttpHeaders({
      'Content-Type':'application/json'
      }), params: params}).subscribe(resp =>
      this.paciente$ = resp as []
    )

    
  }



}
