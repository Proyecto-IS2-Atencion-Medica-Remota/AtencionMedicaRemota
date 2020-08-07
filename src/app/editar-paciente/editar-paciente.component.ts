import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient ,HttpParams ,HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';
import swal from 'sweetalert2';


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

  onSubmit() {
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: '¿Estás seguro de querer realizar estos cambios?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, guardar cambios',
      cancelButtonText: 'No, cancelar',
      
    }).then((result) => {
      if (result.value) {
        console.log(this.checkoutForm.value)

        this.http.post(`http://localhost:8000/updateDatosPaciente`,[this.rut,this.checkoutForm.value]).subscribe(
          resp => swalWithBootstrapButtons.fire(
            'Realizado!',
            'Cambios realizados con éxito',
            'success'
          ).then((result) => {
            location.reload();
          }),
          error => swalWithBootstrapButtons.fire(
            'Error',
            'Error al guardar cambios',
            'error'
          )
        )
      } else if (
        
        result.dismiss === swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'Se cancelaron los cambios',
          'error'
        )
      }
    })
  }

    

}