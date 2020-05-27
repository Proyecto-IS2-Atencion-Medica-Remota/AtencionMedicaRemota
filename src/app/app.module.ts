import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RegistroComponent } from './registro/registro.component';
import { EspecialistasComponent } from './especialistas/especialistas.component';
import { VerEspecialistaComponent } from './ver-especialista/ver-especialista.component';
import { PerfilPacienteComponent } from './perfil-paciente/perfil-paciente.component';
import { PerfilMedicoComponent } from './perfil-medico/perfil-medico.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavbarComponent,
    RegistroComponent,
    EspecialistasComponent,
    VerEspecialistaComponent,
    PerfilPacienteComponent,
    PerfilMedicoComponent,
   
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
