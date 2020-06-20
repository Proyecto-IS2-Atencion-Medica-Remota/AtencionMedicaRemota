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

  ngOnInit(): void {
    this.getEspecialistas();
  }

  getEspecialistas(){
    this.http.get('http://localhost:8000/especialistas').subscribe(resp =>
      this.especialistas$ = resp as []
    )
    console.log(this.especialistas$.data)
  }
}