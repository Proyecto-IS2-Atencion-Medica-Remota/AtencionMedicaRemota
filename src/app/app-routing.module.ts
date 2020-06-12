import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegistroComponent } from './registro/registro.component';
import { VerHorarioComponent } from './ver-horario/ver-horario.component';

const routes: Routes = [
  {path:'', component: LoginComponent},
  {path: 'home', component: HomeComponent },
  {path: 'registro', component: RegistroComponent},
  {path: 'horario', component: VerHorarioComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
