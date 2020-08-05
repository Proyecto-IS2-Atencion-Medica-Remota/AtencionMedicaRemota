import { Component, OnInit } from '@angular/core';
import { HttpClient ,HttpParams ,HttpHeaders} from '@angular/common/http';


@Component({
  selector: 'app-especialistas',
  templateUrl: './especialistas.component.html',
  styleUrls: ['./especialistas.component.css']
})
export class EspecialistasComponent implements OnInit {
  especialistas$: any = [ ];

  constructor(private http: HttpClient) { }
  public foros: Array<Object> = [
    { nombre: "Nombre", checked: false },
    { nombre: "Apellido", checked: true },
    { nombre: "Rut", checked: false },
    { nombre: "Valoracion", checked: false }]
  filterPost='';
  opcionSeleccionado1: string = 'opt2';
  opcionSeleccionado: string  = 'todoslosprofesionales';
  verSeleccion: string        = '';
  rangeValoracion = '0';

  ngOnInit(): void {
    this.getEspecialistas();
  }

  getEspecialistas(){
    this.http.get('http://localhost:8000/especialistas').subscribe(resp =>
      this.especialistas$ = resp as []
    )
    console.log(this.especialistas$.data)
  }
  capturar() {
    // Pasamos el valor seleccionado a la variable verSeleccion
    this.verSeleccion = this.opcionSeleccionado;
  }

}