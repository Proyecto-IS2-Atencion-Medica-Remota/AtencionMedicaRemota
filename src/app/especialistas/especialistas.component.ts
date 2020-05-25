import { Component, OnInit } from '@angular/core';
import { HttpClient ,HttpParams ,HttpHeaders} from '@angular/common/http';
import { PasarDatosService } from "../pasar-datos.service";
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-especialistas',
  templateUrl: './especialistas.component.html',
  styleUrls: ['./especialistas.component.css']
})
export class EspecialistasComponent implements OnInit {
  especialistas$: any = [ ];
  especialidad:any = 'none';
  aux = 5;
  constructor( private router: Router,private http: HttpClient, public data: PasarDatosService) { 
    
    this.data.currentMessage.subscribe(message => this.especialidad = message);
    this.router.routeReuseStrategy.shouldReuseRoute = function(){
      return false;
   }
   this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
         this.router.navigated = false;
         window.scrollTo(0, 0);
      }
  });
  
    
  }


  ngOnInit(): void {
    this.getEspecialistas();
  }

  initialiseInvites() {
    // Set default values and re-fetch any data you need.
  }

  getEspecialistas(){

    if(this.especialidad == 'none'){
      this.http.get('http://localhost:8000/especialistas').subscribe(resp =>{
        this.especialistas$ = resp as []
      }
     
    );
    console.log(this.especialistas$.data)
    }else{
      var aux = JSON.stringify(this.especialidad);
      console.log(this.especialidad);
      this.http.get(`http://localhost:8000/esp/${this.especialidad}`).subscribe(resp =>{
        this.especialistas$ = resp as []
        this.data.setDefault();
      }
      );
      
        
    }
   
  }
}
