import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators , ReactiveFormsModule} from '@angular/forms';
import { AuthService } from '../auth.service';
import {Router} from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-registroespecialista',
  templateUrl: './registroespecialista.component.html',
  styleUrls: ['./registroespecialista.component.css']
})
export class RegistroespecialistaComponent implements OnInit {
  LoginForm: FormGroup;
  constructor(private router: Router,private formBuilder: FormBuilder/*,private auth: AuthService*/) { 
    this.LoginForm =  this.formBuilder.group({
      rut: new FormControl('',Validators.required),
      nombres: new FormControl('',Validators.required),
      apellidos: new FormControl('',Validators.required),
      gmail: new FormControl('',Validators.required),
      telefono: new FormControl('',Validators.required),
      contrasena1: new FormControl('',Validators.required),
      contrasena2: new FormControl('',Validators.required),
    });
  }

  ngOnInit(): void {
  }

  public onSubmit() {
    console.log(this.LoginForm.value.rut);
    console.log(this.LoginForm.value.nombres);
    console.log(this.LoginForm.value.apellidos);
    console.log(this.LoginForm.value.gmail);
    console.log(this.LoginForm.value.telefono);
    console.log(this.LoginForm.value.contrasena1);
    console.log(this.LoginForm.value.contrasena2);
    localStorage.setItem('registerrut', this.LoginForm.value.username);
    localStorage.setItem('registernombres', this.LoginForm.value.nombres);
    localStorage.setItem('registerapellidos', this.LoginForm.value.apellidos);
    localStorage.setItem('registergmail', this.LoginForm.value.gmail);
    localStorage.setItem('registertelefono', this.LoginForm.value.telefono);
    localStorage.setItem('registercontrasena1', this.LoginForm.value.contrasena1);
    localStorage.setItem('registercontrasena2', this.LoginForm.value.contrasena2);
  }

}
