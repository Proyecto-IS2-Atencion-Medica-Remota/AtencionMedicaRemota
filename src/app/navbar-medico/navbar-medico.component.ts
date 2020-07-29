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
  styleUrls: ['./navbar-medico.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarMedicoComponent implements OnInit {
  rut: any;
  especialista$ :any ;
  message: any;
  token: any;
  notif: any;
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
    this.setPeriodicRefresh(0.5);
  }
  
  requestPermission() {
    this.afMessaging.requestToken
      .subscribe(
        (token) => { this.token = token;},
        (error) => { console.error(error); },  
      );
  }
  sendNotif(){
    //this.messagingService.sendPushMessage("Hola","test",this.token);
    this.message = this.messagingService.currentMessage;
    //console.log("notificaciones activadas, "+this.token);
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
    console.log("asdadadada:",this.token.data.token);
    console.log("cvbc");
  }
  setPeriodicRefresh(minutes) {
		setInterval(() => {
			this.cdr.markForCheck();
		}, minutes * 10 * 6000);
  }

  notificacion(){
    console.log(this.message.value.notification.body);
  }
}
