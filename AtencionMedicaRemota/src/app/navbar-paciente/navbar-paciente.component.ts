import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClient ,HttpParams ,HttpHeaders} from '@angular/common/http';


@Component({
  selector: 'app-navbar-paciente',
  templateUrl: './navbar-paciente.component.html',
  styleUrls: ['./navbar-paciente.component.css']
})
export class NavbarPacienteComponent implements OnInit {
  rut: any;
  paciente$ :any ;

  constructor(private router: Router, public auth: AuthService,private http: HttpClient) {
    this.rut=localStorage.getItem('rut');
   }

  ngOnInit(): void {
    this.getPaciente();
    console.log(this.paciente$.data[0].nombres)
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['']);
    
  }
  getPaciente(){

    let params = new HttpParams().set("rut", this.rut);
    

    this.http.get('http://localhost:8000/perfilPaciente',{headers: new HttpHeaders({
      'Content-Type':'application/json'
      }), params: params}).subscribe(resp =>
      this.paciente$ = resp as []
    )

    
  }
   

}
