import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { PasarDatosService } from "../pasar-datos.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public especialidad:string;
  constructor(private router: Router,private data: PasarDatosService) { }

  ngOnInit(): void {
  }

  logout() {
    //this.auth.logout();
    this.router.navigate(['']);
  }
   openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
  }
  
   closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
    document.body.style.backgroundColor = "white";
  }

  save(event) {
    this.data.CambiarMensaje(event.target.value);
    this.router.navigate(['/especialistas']);

  }

  mandarMensaje(){
    this.data.CambiarMensaje(this.especialidad);
  }
}
