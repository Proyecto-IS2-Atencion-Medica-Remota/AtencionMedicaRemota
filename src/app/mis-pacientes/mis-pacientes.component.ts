import { Component, OnInit } from '@angular/core';
import { HttpClient ,HttpParams ,HttpHeaders} from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe ,registerLocaleData } from '@angular/common';
import swal from 'sweetalert2';

@Component({
  selector: 'app-mis-pacientes',
  templateUrl: './mis-pacientes.component.html',
  styleUrls: ['./mis-pacientes.component.css'],
  providers: [DatePipe]
})
export class MisPacientesComponent implements OnInit {
  paciente$: any;
  rut_medico: any;
  rut_paciente:any;
  fecha:any;
  formulario: any;
  editForm: any;
  addForm:any;
  diagnosticos$: any;
  editar:any;
  diagEdit$:any;


  datos_generales:any
  datos_intolerancias:any
  datos_alergias:any
  datos_cirugias:any
  datos_preexistencias:any
  datos_medicamentos:any
  constructor(private modalService: NgbModal,private http: HttpClient,private formBuilder: FormBuilder,private datePipe: DatePipe) { 
    this.formulario = this.formBuilder.group({
      tratamiento:  '',
      diagnostico: '',
    });

    this.editForm = this.formBuilder.group({
      diagnostico: '',
      tratamiento: '',
    });

    this.addForm = this.formBuilder.group({
      diagnostico: '',
      tratamiento: '',
      fecha: '',
    });
    this.rut_medico=localStorage.getItem('rut');
    this.editar=0;
  }

  ngOnInit(): void {
    this.getPacientes();
  }

  async getPacientes(){
    let params = new HttpParams().set("rut", this.rut_medico);
    this.paciente$ = await this.http.get('http://localhost:8000/misPacientes',{headers: new HttpHeaders({
      'Content-Type':'application/json'
      }), params: params}).toPromise();
    console.log(this.paciente$);
    
  }
  async getDiagnostico(contenido, rut_paciente){
    this.rut_paciente=rut_paciente;
    let params = new HttpParams().set("rut_paciente", rut_paciente).set("rut_medico", this.rut_medico);
    this.diagnosticos$ = await this.http.get('http://localhost:8000/getDiagnostico',{headers: new HttpHeaders({
      'Content-Type':'application/json'
      }), params: params}).toPromise();

      this.modalService.open(contenido,{ size: 'xl' });
      console.log(this.diagnosticos$.data);

  }

  async getHistorial(contenido,rut_paciente){
    this.datos_medicamentos = await this.http.get(`http://localhost:8000/get_medicamentos/${rut_paciente}`).toPromise()
    this.datos_generales= await this.http.get(`http://localhost:8000/get_ge/${rut_paciente}`).toPromise()
    this.datos_intolerancias= await this.http.get(`http://localhost:8000/get_intolerancias/${rut_paciente}`).toPromise()
    this.datos_alergias = await this.http.get(`http://localhost:8000/get_alergias/${rut_paciente}`).toPromise()
    this.datos_cirugias= await this.http.get(`http://localhost:8000/get_cirugias/${rut_paciente}`).toPromise()
    this.datos_preexistencias= await this.http.get(`http://localhost:8000/get_preexistencias/${rut_paciente}`).toPromise()
    
    this.modalService.open(contenido,{ size: 'xl' });
    console.log(this.datos_medicamentos,this.datos_generales,this.datos_intolerancias,this.datos_alergias,this.datos_cirugias,this.datos_preexistencias)
  }

  submitDiagnostico(customerData,paciente) {
    this.http.post(`http://localhost:8000/postDiagnostico`,[customerData.diagnostico,paciente,this.rut_medico]).subscribe(
      res=>{
      },
      err =>{
      }
    );
    this.formulario.reset();
    console.log("enviado");
    
  }
  submitTratamiento(customerData,paciente) {
    this.http.post(`http://localhost:8000/postTratamiento`,[customerData.tratamiento,paciente,this.rut_medico]).subscribe(
      res=>{
      },
      err =>{
      }
    );
    this.formulario.reset();
  }

  async modificar(contenido, diagnostico, tratamiento, fecha){
    this.fecha=fecha;
    console.log("modificar") 
    this.modalService.open(contenido,{ size: 'xl' });
    console.log(fecha)
    this.editForm.setValue({
      diagnostico: diagnostico,
      tratamiento: tratamiento,
    })
    console.log(this.editForm.value.fecha)
  }

  onSubmit(contenido){

    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    console.log(this.editForm.value)
    console.log(this.rut_medico,this.rut_paciente)
    this.http.post(`http://localhost:8000/updateDiagnostico`,[this.rut_medico,this.rut_paciente,this.fecha,this.editForm.value]).subscribe(
      resp => swalWithBootstrapButtons.fire(
        'Realizado!',
        'Actualización hecha con éxito',
        'success'
      ).then((result) => {
        
        location.reload();
      }),
      error => swalWithBootstrapButtons.fire(
        'Error',
        'Ocurrió un error al tratar de actualizar',
        'error'
      )
    );
    
  }

  addSubmit(){
    console.log("add");
    console.log(this.addForm.value);
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    console.log(this.rut_medico,this.rut_paciente)
    this.http.post(`http://localhost:8000/addDiagnostico`,[this.rut_medico,this.rut_paciente,this.addForm.value]).subscribe(
      resp => swalWithBootstrapButtons.fire(
        'Realizado!',
        'Diagnóstico y tratamiento añadido con éxito',
        'success'
      ).then((result) => {
        
        location.reload();
      }),
      error => swalWithBootstrapButtons.fire(
        'Error',
        'Ocurrió un error al tratar de añadir',
        'error'
      )
    );
  }
  addDiagnostico(contenido){
    console.log(this.rut_medico, this.rut_paciente)
    this.modalService.open(contenido,{ size: 'xl' });
  }
  eliminar(diagnostico,tratamiento, fecha){
    console.log("eliminar")
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        cancelButton: 'btn btn-danger',
        confirmButton: 'btn btn-success'
        
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: '¿Estás seguro de querer eliminar este diagnóstico y tratamiento?',
      text: "No podrás revertir esto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, cancelar',
      
      
    }).then((result) => {
      if (result.value) {
        
        console.log("borrar")
        let params = new HttpParams().set("rut_medico", this.rut_medico).set("rut_paciente",this.rut_paciente).set("diagnostico",diagnostico).set("tratamiento",tratamiento).set("fecha",fecha);
          this.http.delete('http://localhost:8000/borrarDiagnostico',{headers: new HttpHeaders({
          'Content-Type':'application/json'
          }), params: params}).subscribe(
            resp => swalWithBootstrapButtons.fire(
              'Realizado!',
              'Diagnóstico y tratamiento eliminado con éxito',
              'success'
            ).then((result) => {
              
              location.reload();
            }),
            error => swalWithBootstrapButtons.fire(
              'Error',
              'Error al eliminar el diagnóstico y tratamiento',
              'error'
            )
          )
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'Se canceló el eliminar este diagnóstico y tratamiento',
          'error'
        )
      }
    })
  }

}
