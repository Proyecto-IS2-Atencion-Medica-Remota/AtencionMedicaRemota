import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import { JwtModule } from '@auth0/angular-jwt';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { FlatpickrModule } from 'angularx-flatpickr';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ScheduleModule } from '@syncfusion/ej2-angular-schedule';
import { CookieService } from 'ngx-cookie-service';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistroComponent } from './registro/registro.component';
import { EspecialistasComponent } from './especialistas/especialistas.component';
import { VerEspecialistaComponent } from './ver-especialista/ver-especialista.component';
import { PerfilPacienteComponent } from './perfil-paciente/perfil-paciente.component';
import { PerfilMedicoComponent } from './perfil-medico/perfil-medico.component';
import { RegistropacienteComponent } from './registropaciente/registropaciente.component';
import { RegistroespecialistaComponent } from './registroespecialista/registroespecialista.component';

import { NavbarPacienteComponent } from './navbar-paciente/navbar-paciente.component';
import { NavbarMedicoComponent } from './navbar-medico/navbar-medico.component';
import { DetallesMedicosComponent } from './detalles-medicos/detalles-medicos.component';
import { EditarEspecialistaComponent } from './editar-especialista/editar-especialista.component';
import { HorariosComponent } from './horarios/horarios.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgendaMedicoComponent } from './agenda-medico/agenda-medico.component';
import { ChatComponent } from './chat/chat.component';

import { NgxAgoraModule } from 'ngx-agora';
import { MisPacientesComponent } from './mis-pacientes/mis-pacientes.component';
import { MisDiagnosticosComponent } from './mis-diagnosticos/mis-diagnosticos.component';


import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

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
    
    NavbarPacienteComponent,
    NavbarMedicoComponent,
    DetallesMedicosComponent,
    EditarEspecialistaComponent,
    HorariosComponent,
    AgendaMedicoComponent,
    ChatComponent,
    MisPacientesComponent,
    MisDiagnosticosComponent,
    
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
    BrowserAnimationsModule,
    ScheduleModule,
    CommonModule,
    FormsModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    NgbModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    
    
   
    NgxAgoraModule.forRoot({AppID:'a4e11f3ef92b479d91bc1139ffe207ac'}),
  ],
  providers: [
    AuthService,
    AuthGuard,
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
