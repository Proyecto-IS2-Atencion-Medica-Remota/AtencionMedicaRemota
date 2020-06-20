import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators , ReactiveFormsModule} from '@angular/forms';
import { AuthService } from '../auth.service';
import {Router} from '@angular/router';
import { first } from 'rxjs/operators';
import swal from 'sweetalert2'
import { ChatServiceService } from '.././chat-service.service'
import { CookieService } from 'ngx-cookie-service'
//import swal from'sweetalert2'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  LoginForm: FormGroup;

  constructor(private cookie: CookieService,private chat: ChatServiceService, private router: Router,private formBuilder: FormBuilder, private auth: AuthService ) { 
    this.LoginForm =  this.formBuilder.group({
      rut: new FormControl('',Validators.required),
      pass: new FormControl('',Validators.required),
      
    });
  }

  ngOnInit(): void {
    this.auth.logout();
    document.querySelector('.img__btn').addEventListener('click', function() {
      document.querySelector('.cont').classList.toggle('s--signup');
    });
  }

  public onSubmitPaciente() {
    console.log(this.LoginForm.value.rut);
    console.log(this.LoginForm.value.pass);
    const cargo="Paciente";
    localStorage.setItem('rut', this.LoginForm.value.rut);
    //poner aca en el setR que se inicialice de una el socket
    //y quizas no del componente chat
    this.chat.setR(this.LoginForm.value.rut)
    this.cookie.set(this.LoginForm.value.rut,"Paciente")
    
    this.auth.login(this.LoginForm.value.rut, this.LoginForm.value.pass, cargo)
      .pipe(first())
      .subscribe( 
        result => this.router.navigate(['/homePaciente']),
        err => swal.fire('Usuario y/o Contraseña Incorrecta')
  
      );

  }

  public onSubmitEspecialista() {
    console.log(this.LoginForm.value.rut);
    console.log(this.LoginForm.value.pass);
    const cargo="Especialista";
    localStorage.setItem('rut', this.LoginForm.value.rut);
    
    this.chat.setR(this.LoginForm.value.rut)
    this.cookie.set(this.LoginForm.value.rut,"Especialista")

    this.auth.login(this.LoginForm.value.rut, this.LoginForm.value.pass, cargo)
      .pipe(first())
      .subscribe( 
        result => this.router.navigate(['/homeMedico']),
        err => swal.fire('Usuario y/o Contraseña Incorrecta')
  
      );

  }

}
