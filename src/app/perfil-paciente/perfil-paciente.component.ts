import { Component, OnInit } from '@angular/core';
import { HttpClient ,HttpParams ,HttpHeaders} from '@angular/common/http';
import { ImageService } from './../image.service';

@Component({
  selector: 'app-perfil-paciente',
  templateUrl: './perfil-paciente.component.html',
  styleUrls: ['./perfil-paciente.component.css']
})
export class PerfilPacienteComponent implements OnInit {
  rut: any;
  paciente$ :any ;
  imageFile: File;
  datosMedicos$:any =[];
  enfermedades$:any =[];
  medicamentos$:any =[];
  alergias$:any =[];
  intolerancias$:any =[];
  cirugias$:any =[];
  
  constructor( private http: HttpClient,private imageService:ImageService) { 
    this.rut=localStorage.getItem('rut');
    
  }

  ngOnInit(): void {
    this.getPaciente();
    this.getDatosMedicos();
    this.getEnfermedades();
    this.getMedicamentos();
    this.getAlergias();
    this.getIntolerancias();
    this.getCirugias();
  }

  async getPaciente(){

    let params = new HttpParams().set("rut", this.rut);
    

    this.paciente$= await this.http.get('http://localhost:8000/perfilPaciente',{headers: new HttpHeaders({
      'Content-Type':'application/json'
      }), params: params}).toPromise();
      console.log(this.paciente$.data);
    
  }

 async getDatosMedicos(){
  let params = new HttpParams().set("rut", this.rut);
  this.datosMedicos$ = await this.http.get('http://localhost:8000/datosMedicos',{headers: new HttpHeaders({
    'Content-Type':'application/json'
    }), params: params}).toPromise();
  console.log(this.datosMedicos$.data[0])

 }

 async getEnfermedades(){
  let params = new HttpParams().set("rut", this.rut);
  this.enfermedades$ = await this.http.get('http://localhost:8000/datosEnfermedades',{headers: new HttpHeaders({
    'Content-Type':'application/json'
    }), params: params}).toPromise();
  console.log(this.enfermedades$.data.length)

 }

 async getMedicamentos(){
  let params = new HttpParams().set("rut", this.rut);
  this.medicamentos$ = await this.http.get('http://localhost:8000/datosMedicamentos',{headers: new HttpHeaders({
    'Content-Type':'application/json'
    }), params: params}).toPromise();
  console.log(this.medicamentos$)

 }

 async getAlergias(){
  let params = new HttpParams().set("rut", this.rut);
  this.alergias$ = await this.http.get('http://localhost:8000/datosAlergias',{headers: new HttpHeaders({
    'Content-Type':'application/json'
    }), params: params}).toPromise();
  console.log(this.alergias$)

 }
 async getIntolerancias(){
  let params = new HttpParams().set("rut", this.rut);
  this.intolerancias$ = await this.http.get('http://localhost:8000/datosIntolerancias',{headers: new HttpHeaders({
    'Content-Type':'application/json'
    }), params: params}).toPromise();
  console.log(this.intolerancias$)

 }
 async getCirugias(){
  let params = new HttpParams().set("rut", this.rut);
  this.cirugias$ = await this.http.get('http://localhost:8000/datosCirugias',{headers: new HttpHeaders({
    'Content-Type':'application/json'
    }), params: params}).toPromise();
  console.log(this.cirugias$)

 }

  imageInputChange(imageInput:any){
    this.imageFile = imageInput.files[0];
  }
 
  async addImage(){
    var url= await this.imageService.uploadImage(this.imageFile);
    
    console.log(url)

    let params = new HttpParams().set("rut", this.rut).set("url", url);
    

    this.http.post('http://localhost:8000/setImagen',[this.rut,url]).subscribe()
    location.reload();
  }


}
