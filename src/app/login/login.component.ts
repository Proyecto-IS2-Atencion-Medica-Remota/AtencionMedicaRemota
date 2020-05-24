import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators , ReactiveFormsModule} from '@angular/forms';
import { AuthService } from '../auth.service';
import {Router} from '@angular/router';
import { first } from 'rxjs/operators';
//import swal from'sweetalert2'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  LoginForm: FormGroup;

  constructor(private router: Router,private formBuilder: FormBuilder/*,private auth: AuthService*/ ) { 
    this.LoginForm =  this.formBuilder.group({
      username: new FormControl('',Validators.required),
      password: new FormControl('',Validators.required),
      
    });
  }

  ngOnInit(): void {
  }

  public onSubmit() {
    console.log(this.LoginForm.value.password);
    localStorage.setItem('rut', this.LoginForm.value.username);
    this.router.navigate(['/home']);
    /*this.auth.login(this.LoginForm.value.username, this.LoginForm.value.password)
      .pipe(first())
      .subscribe( 
        result => this.router.navigate(['/home']),
        err => swal.fire('Usuario y/o Contraseña Incorrecta')
  
      );*/

  }

}
