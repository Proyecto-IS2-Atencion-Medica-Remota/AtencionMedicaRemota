import { Component, OnInit } from '@angular/core';
import { HttpClient ,HttpParams ,HttpHeaders} from '@angular/common/http';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  pacientes$: any = [ ];


  constructor(private http: HttpClient) { }

  ngOnInit(): void {

    this.getPacientes();
  }

  getPacientes(){
    this.http.get('http://localhost:8000/pacientes').subscribe(resp =>
      this.pacientes$ = resp as []
    )
    console.log(this.pacientes$.data)
  }
}
