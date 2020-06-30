import { Component, OnInit } from '@angular/core';
import { HttpClient ,HttpParams ,HttpHeaders} from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mis-pacientes',
  templateUrl: './mis-pacientes.component.html',
  styleUrls: ['./mis-pacientes.component.css']
})
export class MisPacientesComponent implements OnInit {
  paciente$: any;
  rut: any;
  formulario: any;
  constructor(private modalService: NgbModal,private http: HttpClient,private formBuilder: FormBuilder) { 
    this.formulario = this.formBuilder.group({
      tratamiento:  '',
      diagnostico: '',
    });
    this.rut=localStorage.getItem('rut');
  }

  ngOnInit(): void {
    this.getPacientes();
  }

  getPacientes(){
    let params = new HttpParams().set("rut", this.rut);
    this.http.get('http://localhost:8000/getPacientes',{headers: new HttpHeaders({
      'Content-Type':'application/json'
      }), params: params}).subscribe(resp =>
      this.paciente$ = resp as []
    )
    console.log(this.paciente$);
    
  }
  openScrollableContent(longContent) {
    this.modalService.open(longContent, { scrollable: true });
  }
  submitDiagnostico(customerData,paciente) {
    this.http.post(`http://localhost:8000/postDiagnostico`,[customerData.diagnostico,paciente,this.rut]).subscribe(
      res=>{
      },
      err =>{
      }
    );
    this.formulario.reset();
    console.log("enviado");
    
  }
  submitTratamiento(customerData,paciente) {
    this.http.post(`http://localhost:8000/postTratamiento`,[customerData.tratamiento,paciente,this.rut]).subscribe(
      res=>{
      },
      err =>{
      }
    );
    this.formulario.reset();
  }

}
