import { Component, OnInit } from '@angular/core';
import { HttpClient ,HttpParams ,HttpHeaders} from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mis-diagnosticos',
  templateUrl: './mis-diagnosticos.component.html',
  styleUrls: ['./mis-diagnosticos.component.css']
})
export class MisDiagnosticosComponent implements OnInit {
  especialista$: any;
  rut: any;
  diagnosticos$: any;
  constructor(private http: HttpClient,private modalService: NgbModal) { 
    this.rut=localStorage.getItem('rut');
  }
    
  ngOnInit(): void {
    this.getEspecialistas();
  }

  async getEspecialistas(){
    let params = new HttpParams().set("rut", this.rut);
    this.especialista$= await this.http.get('http://localhost:8000/getEspecialistas',{headers: new HttpHeaders({
      'Content-Type':'application/json'
      }), params: params}).toPromise();
    console.log(this.especialista$);
    
    
  }
  async getDiagnostico(contenido, rut_medico){
    let params = new HttpParams().set("rut_paciente", this.rut).set("rut_medico", rut_medico);
    this.diagnosticos$ = await this.http.get('http://localhost:8000/getDiagnostico',{headers: new HttpHeaders({
      'Content-Type':'application/json'
      }), params: params}).toPromise();
      
      this.modalService.open(contenido,{ size: 'xl' });
      console.log(this.diagnosticos$.data[0].tratamiento);

  }
}
