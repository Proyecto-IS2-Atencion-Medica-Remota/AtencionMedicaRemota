import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpClient ,HttpParams ,HttpHeaders} from '@angular/common/http';
import { ImageService } from './../image.service';



@Component({
  selector: 'app-ver-especialista',
  templateUrl: './ver-especialista.component.html',
  styleUrls: ['./ver-especialista.component.css']
})
export class VerEspecialistaComponent implements OnInit {
  recomendaciones$: any;
  rut: any;
  promedio:any;
  especialista$: any=[];
  imageFile: File;
  
  constructor(private rutaActiva: ActivatedRoute,private http: HttpClient ,private imageService:ImageService) {
      this.rut=this.rutaActiva.snapshot.paramMap.get('id');
    
      
  }

  ngOnInit(): void {
    console.log(this.rut);
    this.getEspecialista();
    this.getRecomendaciones();

  }

  async getEspecialista(){

    let params = new HttpParams().set("rut", this.rut);
    

    this.especialista$ = await this.http.get('http://localhost:8000/verEspecialista',{headers: new HttpHeaders({
      'Content-Type':'application/json'
    }), params: params}).toPromise();

    
  }

  async getRecomendaciones(){
    let params = new HttpParams().set("rut", this.rut);
    this.recomendaciones$ = await this.http.get('http://localhost:8000/misRecomendaciones',{headers: new HttpHeaders({
      'Content-Type':'application/json'
      }), params: params}).toPromise();
    console.log(this.recomendaciones$);
  }

  

}
