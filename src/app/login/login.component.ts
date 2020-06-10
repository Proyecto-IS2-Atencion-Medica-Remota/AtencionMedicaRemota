import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators , ReactiveFormsModule} from '@angular/forms';
import { AuthService } from '../auth.service';
import {Router} from '@angular/router';
import { first } from 'rxjs/operators';
import swal from'sweetalert2'

//import swal from'sweetalert2'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  LoginForm: FormGroup;

  constructor(private router: Router,private formBuilder: FormBuilder, private auth: AuthService ) { 
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
    
    this.auth.login(this.LoginForm.value.rut, this.LoginForm.value.pass, cargo)
      .pipe(first())
      .subscribe( 
        result => this.router.navigate(['/homeMedico']),
        err => swal.fire('Usuario y/o Contraseña Incorrecta')
  
      );

  }

}
