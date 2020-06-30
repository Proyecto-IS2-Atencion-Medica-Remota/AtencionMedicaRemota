import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators , ReactiveFormsModule} from '@angular/forms';
import { AuthService } from '../auth.service';
import {Router} from '@angular/router';
import { first } from 'rxjs/operators';
import swal from 'sweetalert2';
@Component({
  selector: 'app-registroespecialista',
  templateUrl: './registroespecialista.component.html',
  styleUrls: ['./registroespecialista.component.css']
})
export class RegistroespecialistaComponent implements OnInit {
  LoginForm: FormGroup;
  constructor(private router: Router,private formBuilder: FormBuilder,private auth: AuthService) { 
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
    if(this.LoginForm.value.contrasena1!=this.LoginForm.value.contrasena2){
      swal.fire('No coinciden las contrasenas');
    }else if(String(this.LoginForm.value.telefono).length<=7){
      swal.fire('Numero de telefono invalido');
    }else if(!(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(String(this.LoginForm.value.gmail)))){
      swal.fire('Correo invalido');
    }else{
      this.auth.verificarRegistro(this.LoginForm.value.rut, "verrut")
        .pipe(first())
        .subscribe( 
          result => swal.fire('Usuario ya se encuentra registrado'),
          (err) => {this.auth.realizarRegistro(this.LoginForm.value.rut,this.LoginForm.value.nombres,this.LoginForm.value.apellidos,this.LoginForm.value.gmail,this.LoginForm.value.telefono,this.LoginForm.value.contrasena1,"especialista")
          .pipe(first())
          .subscribe(
            (result) => {swal.fire('Se envio solicitud de registro, se notificar por correo cuando su cuenta sea confirmada.');
                      this.router.navigate(['/login']);},
            err => swal.fire('Ha ocurrido un error en el registro')
          )}
          );
    }
  }

}
