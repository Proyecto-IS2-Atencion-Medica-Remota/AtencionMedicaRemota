
import { NgModule } from '@angular/core';
import { AuthGuard } from './auth.guard';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeMedicoComponent } from './home-medico/home-medico.component';
import { HomePacienteComponent } from './home-paciente/home-paciente.component';
import { RegistroComponent } from './registro/registro.component';
import { EspecialistasComponent } from './especialistas/especialistas.component';
import { VerEspecialistaComponent } from './ver-especialista/ver-especialista.component';
import { PerfilPacienteComponent } from './perfil-paciente/perfil-paciente.component';
import { PerfilMedicoComponent } from './perfil-medico/perfil-medico.component';
import { RegistroespecialistaComponent } from './registroespecialista/registroespecialista.component';
import { RegistropacienteComponent } from './registropaciente/registropaciente.component';
import { DetallesMedicosComponent } from './detalles-medicos/detalles-medicos.component';
import { EditarEspecialistaComponent } from './editar-especialista/editar-especialista.component';
import { HorariosComponent } from './horarios/horarios.component';
import { AgendaMedicoComponent } from './agenda-medico/agenda-medico.component';
import { ChatComponent } from './chat/chat.component';
import { MisPacientesComponent } from './mis-pacientes/mis-pacientes.component';
import { MisDiagnosticosComponent } from './mis-diagnosticos/mis-diagnosticos.component';

const routes: Routes = [
  {path:'', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'homePaciente', component: HomePacienteComponent ,canActivate: [AuthGuard]},
  {path: 'homeMedico', component: HomeMedicoComponent, canActivate: [AuthGuard]},
  {path: 'registro', component: RegistroComponent},
  {path: 'registropaciente', component: RegistropacienteComponent},
  {path: 'registroespecialista', component: RegistroespecialistaComponent},
  {path: 'especialistas', component: EspecialistasComponent,canActivate: [AuthGuard]},
  {path: 'verEspecialista/:id', component: VerEspecialistaComponent,canActivate: [AuthGuard]},
  {path: 'perfilPaciente', component: PerfilPacienteComponent,canActivate: [AuthGuard]},
  {path: 'perfilMedico', component: PerfilMedicoComponent,canActivate: [AuthGuard]},
  {path: 'detallesMedicos/:id', component: DetallesMedicosComponent,canActivate: [AuthGuard]},
  {path: 'editarEspecialista/:id', component: EditarEspecialistaComponent,canActivate: [AuthGuard]},
  {path: 'horarios/:id', component: HorariosComponent,canActivate: [AuthGuard]},
  {path: 'agendaMedico', component: AgendaMedicoComponent,canActivate: [AuthGuard]},
  {path: 'chat/:id', component: ChatComponent,canActivate: [AuthGuard]},
  {path: 'misPacientes/:id', component: MisPacientesComponent,canActivate: [AuthGuard]},
  {path: 'misDiagnosticos/:id', component: MisDiagnosticosComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
}
