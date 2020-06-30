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
  diagnostico: any;
  constructor(private http: HttpClient,private modalService: NgbModal) { 
    this.rut=localStorage.getItem('rut');
  }
    
  ngOnInit(): void {
    this.getEspecialistas();
  }

  getEspecialistas(){
    let params = new HttpParams().set("rut", this.rut);
    this.http.get('http://localhost:8000/getEspecialistas',{headers: new HttpHeaders({
      'Content-Type':'application/json'
      }), params: params}).subscribe(resp =>
      this.especialista$ = resp as []
    )
    console.log(this.especialista$);
    
  }
async getDiagnostico(contenido){
  let params = new HttpParams().set("rut", this.rut);
  this.diagnostico = await this.http.get('http://localhost:8000/getDiagnostico',{headers: new HttpHeaders({
    'Content-Type':'application/json'
    }), params: params}).toPromise();

    this.modalService.open(contenido);
    console.log(this.diagnostico.data[0].tratamiento);
  }
  openScrollableContent(longContent) {
    this.modalService.open(longContent);
  }
}
