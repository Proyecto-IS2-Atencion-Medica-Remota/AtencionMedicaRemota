import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import * as $ from 'jquery/dist/jquery.min.js';
import { HttpClient ,HttpParams ,HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-navbar-medico',
  templateUrl: './navbar-medico.component.html',
  styleUrls: ['./navbar-medico.component.css']
})
export class NavbarMedicoComponent implements OnInit {
  rut: any;
  especialista$ :any ;
  public especialidad:string;
  constructor(private router: Router, public auth: AuthService,private http: HttpClient) {
    this.rut=localStorage.getItem('rut');
   }

   ngOnInit(): void {
    this.getEspecialista();
  }

  getEspecialista(){
    console.log(this.rut);
    let params = new HttpParams().set("rut", this.rut);
    this.http.get('http://localhost:8000/perfilEspecialista',{headers: new HttpHeaders({
      'Content-Type':'application/json'
      }), params: params}).subscribe(resp =>
      this.especialista$ = resp as []
    )
    
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['']);
    
  }
  
}
