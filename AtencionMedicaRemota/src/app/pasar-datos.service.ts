import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PasarDatosService {

  private messageSource = new BehaviorSubject('none');
  currentMessage = this.messageSource.asObservable();

  constructor(private router: Router) { }

  CambiarMensaje(message: string) {
    this.messageSource.next(message);
  }
  setDefault(){
    this.messageSource.next('none');
  }

  reload(){
    this.router.navigate(['/especialistas']);
  }

}
