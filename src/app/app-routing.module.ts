import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegistroComponent } from './registro/registro.component';
import { EspecialistasComponent } from './especialistas/especialistas.component';
import { VerEspecialistaComponent } from './ver-especialista/ver-especialista.component';
import { PerfilPacienteComponent } from './perfil-paciente/perfil-paciente.component';
import { PerfilMedicoComponent } from './perfil-medico/perfil-medico.component';
import { PerfilEspecialistaComponent } from './perfil-especialista/perfil-especialista.component'; 
import { EditarEspecialistaComponent } from './editar-especialista/editar-especialista.component';


const routes: Routes = [
  {path:'', component: LoginComponent},
  {path: 'home', component: HomeComponent },
  {path: 'registro', component: RegistroComponent},
  {path: 'especialistas', component: EspecialistasComponent},
  {path: 'verEspecialista/:id', component: VerEspecialistaComponent},
  {path: 'perfilPaciente', component: PerfilPacienteComponent},
  {path: 'perfilMedico/:id', component: PerfilMedicoComponent},
  {path: 'perfilEspecialista', component: PerfilEspecialistaComponent},
  {path: 'editarEspecialista/:id', component: EditarEspecialistaComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
