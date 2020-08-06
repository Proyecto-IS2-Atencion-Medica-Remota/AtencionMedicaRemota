import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient ,HttpParams ,HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editar-paciente',
  templateUrl: './editar-paciente.component.html',
  styleUrls: ['./editar-paciente.component.css']
})
export class EditarPacienteComponent implements OnInit {

  rut: any;
  paciente$ :any ;
  checkoutForm;
  datosPaciente: any;
  update: any;
  constructor(private http: HttpClient,private formBuilder: FormBuilder, private router: Router) {
    this.checkoutForm = this.formBuilder.group({
      nombre: '',
      contacto: '',
      correo: '',
      apellidos: '',
      
    });
    this.rut=localStorage.getItem('rut');
    this.datosPaciente = [];
    this.update = [];
    for(var _i = 0; _i < 7; _i++){
      this.update.push(false);
    }
  }
  async ngOnInit(){
    const result1 = await this.getPaciente();
    this.checkoutForm.setValue({
      nombre: result1.nombres,
      contacto: result1.contacto,
      correo: result1.correo,
      apellidos: result1.apellidos
    })
    this.datosPaciente = this.paciente$.data[0];
    console.log(this.datosPaciente);
  }

  async getPaciente(){

    let params = new HttpParams().set("rut", this.rut);
    this.paciente$ = await this.http.get('http://localhost:8000/perfilPaciente',{headers: new HttpHeaders({
      'Content-Type':'application/json'
      }), params: params}).toPromise();

      return this.paciente$.data[0];
  }

  onSubmit(customerData) {
    const values = Object.keys(customerData).map(key => customerData[key]);
    for(var i = 0; i < values.length; i++){
      if(values[i]) this.datosPaciente[i] = values[i];   
      //else this.datosPaciente[i] = this.paciente$.data[0][i];
    }
      this.http.post('http://localhost:8000/setNombre',[customerData.nombre,this.rut]).subscribe()
      this.http.post('http://localhost:8000/setApellido',[customerData.apellidos,this.rut]).subscribe()
      this.http.post('http://localhost:8000/setCorreo',[customerData.correo,this.rut]).subscribe()
      this.http.post('http://localhost:8000/setFono',[customerData.contacto,this.rut]).subscribe()
    this.checkoutForm.reset();
    console.warn('Your order has been submitted', customerData);
    this.datosPaciente.clear;
location.reload()
  }

}
