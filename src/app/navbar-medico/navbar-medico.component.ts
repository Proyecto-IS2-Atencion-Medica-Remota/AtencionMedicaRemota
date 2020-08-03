import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import * as $ from 'jquery/dist/jquery.min.js';
import { HttpClient ,HttpParams ,HttpHeaders} from '@angular/common/http';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { MessagingService } from 'src/app/service/messaging.service';

@Component({
  selector: 'app-navbar-medico',
  templateUrl: './navbar-medico.component.html',
  styleUrls: ['./navbar-medico.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarMedicoComponent implements OnInit {
  rut: any;
  especialista$ :any ;
  message: any;
  token: any;
  notif: any;
  notificaciones = [];
  public isCollapsed = true;
  public newnotif = false;
  public especialidad:string;
  constructor(private router: Router, public auth: AuthService,private http: HttpClient, private afMessaging: AngularFireMessaging, private messagingService: MessagingService, public cdr: ChangeDetectorRef) {
    this.rut=localStorage.getItem('rut');
   }

   ngOnInit(): void {
    this.getEspecialista();
    this.messagingService.requestPermission(this.rut);
    this.messagingService.receiveMessage();
    this.message = this.messagingService.currentMessage;
    this.getToken();
    this.getNotif();
  }
  
  requestPermission() {
    this.afMessaging.requestToken
      .subscribe(
        (token) => { this.token = token;},
        (error) => { console.error(error); },  
      );
  }
  async getEspecialista(){
    console.log(this.rut);
    let params = new HttpParams().set("rut", this.rut);
    await this.http.get('http://localhost:8000/perfilEspecialista',{headers: new HttpHeaders({
      'Content-Type':'application/json'
      }), params: params}).toPromise().then(resp =>
      this.especialista$ = resp as []
    )
    
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['']);
    
  }
  async getToken(){
    console.log("gettoken");
    let params = new HttpParams().set("rut", this.rut);
    await this.http.get('http://localhost:8000/getToken',{headers: new HttpHeaders({
      'Content-Type':'application/json'
      }), params: params}).toPromise().then(resp =>
      this.token = resp
    )
  }
  async getNotif(){
    console.log("recibido nuevo mensaje");
    let params = new HttpParams().set("rut", this.rut);
    await this.http.get('http://localhost:8000/getNotif',{headers: new HttpHeaders({
      'Content-Type':'application/json'
      }), params: params}).toPromise().then(resp =>
      this.notif = resp
    )
    for(var i = Object.keys(this.notif.data).length-1; i >= 0; i--){
      this.notificaciones.push(this.notif.data[i].mensaje)
    }
    console.log("dljfclkxv");
  }
  clearNotif(){
    this.isCollapsed = !this.isCollapsed
    this.newnotif = false;
  }
  async pushMsg(msg){
    if(this.messagingService.currentMessage != null){
      var auxm = msg;
      this.newnotif = true;
      await this.notificaciones.unshift(msg);
      //console.log(msg);
      this.messagingService.currentMessage.next(null);
      //console.log(this.notif.data);
    }
  }
}
