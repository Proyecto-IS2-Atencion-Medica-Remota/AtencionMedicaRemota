import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpClient ,HttpParams ,HttpHeaders} from '@angular/common/http';


@Component({
  selector: 'app-ver-especialista',
  templateUrl: './ver-especialista.component.html',
  styleUrls: ['./ver-especialista.component.css']
})
export class VerEspecialistaComponent implements OnInit {
  rut: any;
  promedio:any;
  especialista$: any=[];
  
  constructor(private rutaActiva: ActivatedRoute,private http: HttpClient) {
      this.rut=this.rutaActiva.snapshot.paramMap.get('id');
    
      
  }

  ngOnInit(): void {
    console.log(this.rut);
    this.getEspecialista();

  }

  getEspecialista(){

    let params = new HttpParams().set("rut", this.rut);
    

    this.http.get('http://localhost:8000/verEspecialista',{headers: new HttpHeaders({
      'Content-Type':'application/json'
      }), params: params}).subscribe(resp =>
      this.especialista$ = resp as []
    )

    
  }

}
