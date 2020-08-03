import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpClient ,HttpParams ,HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-perfil-medico',
  templateUrl: './perfil-medico.component.html',
  styleUrls: ['./perfil-medico.component.css']
})
export class PerfilMedicoComponent implements OnInit {
  rut: any;
  especialista$ :any ;
  constructor(private http: HttpClient) {
    this.rut=localStorage.getItem('rut');
  }
  ngOnInit(): void {
    this.getEspecialista();
  }

  getEspecialista(){
    console.log(this.rut);
    let params = new HttpParams().set("rut", this.rut);
    this.http.get('http://localhost:8000/perfilEspecialista',{headers: new HttpHeaders({
      'Content-Type':'application/json'
      }), params: params}).subscribe(resp =>
      this.especialista$ = resp as []
    )
    console.log("waiting");
    //console.log(this.especialista$.data);
    console.log("pass");
  }

}