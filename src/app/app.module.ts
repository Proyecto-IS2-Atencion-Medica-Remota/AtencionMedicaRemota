import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import { JwtModule } from '@auth0/angular-jwt';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistroComponent } from './registro/registro.component';
import { EspecialistasComponent } from './especialistas/especialistas.component';
import { VerEspecialistaComponent } from './ver-especialista/ver-especialista.component';
import { PerfilPacienteComponent } from './perfil-paciente/perfil-paciente.component';
import { PerfilMedicoComponent } from './perfil-medico/perfil-medico.component';
import { RegistropacienteComponent } from './registropaciente/registropaciente.component';
import { RegistroespecialistaComponent } from './registroespecialista/registroespecialista.component';
import { HomeMedicoComponent } from './home-medico/home-medico.component';
import { HomePacienteComponent } from './home-paciente/home-paciente.component';
import { NavbarPacienteComponent } from './navbar-paciente/navbar-paciente.component';
import { NavbarMedicoComponent } from './navbar-medico/navbar-medico.component';
import { DetallesMedicosComponent } from './detalles-medicos/detalles-medicos.component';
import { EditarEspecialistaComponent } from './editar-especialista/editar-especialista.component';
import { ChatComponent } from './chat/chat.component';
import { CookieService } from 'ngx-cookie-service';
export function tokenGetter() {
  return localStorage.getItem('access_token');
}

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

//videochat

import { NgxAgoraModule } from 'ngx-agora';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistroComponent,
    EspecialistasComponent,
    VerEspecialistaComponent,
    PerfilPacienteComponent,
    PerfilMedicoComponent,
    RegistropacienteComponent,
    RegistroespecialistaComponent,
    HomeMedicoComponent,
    HomePacienteComponent,
    NavbarPacienteComponent,
    NavbarMedicoComponent,
    DetallesMedicosComponent,
    EditarEspecialistaComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:8000'],
        blacklistedRoutes: ['localhost:8000/auth']
      }
    }),
    MatDialogModule,
    BrowserAnimationsModule,
    MatButtonModule,
    NgxAgoraModule.forRoot({AppID:'a4e11f3ef92b479d91bc1139ffe207ac'})
  ],
  providers: [
    AuthService,
    AuthGuard,
    CookieService
  ],
  bootstrap: [AppComponent],
  entryComponents:[]
})
export class AppModule { }
