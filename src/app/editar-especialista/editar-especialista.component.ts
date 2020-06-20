import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient ,HttpParams ,HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editar-especialista',
  templateUrl: './editar-especialista.component.html',
  styleUrls: ['./editar-especialista.component.css']
})
export class EditarEspecialistaComponent implements OnInit {
  rut: any;
  especialista$ :any ;
  checkoutForm;
  datosEspecialista: any;
  update: any;
  constructor(private http: HttpClient,private formBuilder: FormBuilder, private router: Router) {
    this.checkoutForm = this.formBuilder.group({
      nombre: '',
      contacto: '',
     
      experiencia: '',
      estudios: '',
      especialidad: '',
      horarios: '',
      apellidos: '',
      
    });
    this.rut=localStorage.getItem('rut');
    this.datosEspecialista = [];
    this.update = [];
    for(var _i = 0; _i < 7; _i++){
      this.update.push(false);
    }
  }
  async ngOnInit(){
    const result1 = await this.getEspecialista();
    console.log(result1.nombres);
    this.checkoutForm.setValue({
      nombre: result1.nombres,
      contacto: result1.contacto,
      
      experiencia: result1.experiencia,
      estudios: result1.formacionacademica,
      especialidad: result1.especialidad,
      horarios: result1.horariodisponible,
      apellidos: result1.apellidos
    })
    this.datosEspecialista = this.especialista$.data[0];
    console.log(this.datosEspecialista);
  }

  async getEspecialista(){

    let params = new HttpParams().set("rut", this.rut);
    this.especialista$ = await this.http.get('http://localhost:8000/perfilEspecialista',{headers: new HttpHeaders({
      'Content-Type':'application/json'
      }), params: params}).toPromise();

      return this.especialista$.data[0];
  }

  onSubmit(customerData) {
    console.log("intento");
    const values = Object.keys(customerData).map(key => customerData[key]);
    console.log(this.especialista$.data[0].nombres);
    for(var i = 0; i < values.length; i++){
      if(values[i]) this.datosEspecialista[i] = values[i];   
      //else this.datosEspecialista[i] = this.especialista$.data[0][i];
    }
    console.log(this.datosEspecialista[0]);
    this.http.post(`http://localhost:8000/updateDatosEspecialista`,[this.rut,this.datosEspecialista]).subscribe(
      res=>{
      },
      err =>{
      }
    );
    this.checkoutForm.reset();
    console.warn('Your order has been submitted', customerData);
    this.datosEspecialista.clear;
    this.router.navigate(['/perfilMedico']);
  }
  
}