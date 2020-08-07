import { Component, OnInit } from '@angular/core';
import { HttpClient ,HttpParams ,HttpHeaders} from '@angular/common/http';


@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.css']
})
export class CitasComponent implements OnInit {
  rut_paciente: any;
  rut_medico:any;
  cargo: any;
  citas$: any;
  constructor(private http: HttpClient) {
    this.cargo=localStorage.getItem('cargo');
    if(this.cargo=="Paciente"){
      this.rut_paciente=localStorage.getItem('rut');
    }else{
      this.rut_medico=localStorage.getItem('rut');
    }
  }

  ngOnInit(): void {
    console.log(this.cargo)
    this.getCitas();
  }

  async getCitas(){
    let params;
    if(this.cargo=="Paciente"){
      params = new HttpParams().set("rut", this.rut_paciente).set("cargo", this.cargo)
    }else{
      params = new HttpParams().set("rut", this.rut_medico).set("cargo", this.cargo)
    }
    this.citas$= await this.http.get('http://localhost:8000/misCitas',{headers: new HttpHeaders({
      'Content-Type':'application/json'
      }), params: params}).toPromise();
    console.log(this.citas$);
    console.log(this.citas$.data.length);

    for (var i in this.citas$.data) {
      if(this.citas$.data[i].bloque=="1"){
        this.citas$.data[i].bloque="10:00-11:00"
      }else if(this.citas$.data[i].bloque=="2"){
        this.citas$.data[i].bloque="11:00-12:00"
      }else if(this.citas$.data[i].bloque=="3"){
        this.citas$.data[i].bloque="12:00-13:00"
      }else if(this.citas$.data[i].bloque=="4"){ 
        this.citas$.data[i].bloque="13:00-14:00"
      }
    }


    

    console.log(this.citas$.data);
    
  }

}
