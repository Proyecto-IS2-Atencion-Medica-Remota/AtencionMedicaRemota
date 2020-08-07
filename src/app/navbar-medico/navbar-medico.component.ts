import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import * as $ from 'jquery/dist/jquery.min.js';
import { HttpClient ,HttpParams ,HttpHeaders} from '@angular/common/http';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { MessagingService } from 'src/app/service/messaging.service';
import swal from 'sweetalert2';

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
  notificaciones = [];
  public isCollapsed = true;
  public newnotif = false;
  public especialidad:string;
  notificaciones2$: any;
  num:any;


  intervalHolder: any;

  abrir: boolean= false;
  constructor(private router: Router, public auth: AuthService,private http: HttpClient, private afMessaging: AngularFireMessaging, private messagingService: MessagingService, public cdr: ChangeDetectorRef) {
    this.rut=localStorage.getItem('rut');
    this.num=0;
   }

   async ngOnInit(){
    this.getEspecialista();
    this.messagingService.requestPermission(this.rut);
    this.messagingService.receiveMessage();
    this.message = this.messagingService.currentMessage;
    this.getToken();
    this.num= await this.getNotif();
    console.log(this.num)

    this.intervalHolder =  setInterval(()=>{
      this.cdr.markForCheck();
      this.getData();
    }, 5000);

    console.log(this.num)
  }
  async getData(){
    this.num=await this.getNotif();
  }


  
  
  requestPermission() {
    this.afMessaging.requestToken
      .subscribe(
        (token) => { this.token = token;},
        (error) => { console.error(error); },  
      );
  }

  open(){
    this.abrir=true;
  }
  close(){
    this.abrir=false;
  }

  async borrar( rut_usario, mensaje){
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    console.log(rut_usario, mensaje)
    let params = new HttpParams().set("rut_usuario", rut_usario).set("mensaje",mensaje);
    this.http.delete('http://localhost:8000/borrarNotificacion',{params: params}).subscribe(
      resp => swalWithBootstrapButtons.fire(
        'Realizado!',
        'Notificación eliminada',
        'success'
      ).then((result) => {   
        this.num=this.getNotif();
      })
      )
    
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
    this.notif= await this.http.get('http://localhost:8000/getNotif',{headers: new HttpHeaders({
      'Content-Type':'application/json'
      }), params: params}).toPromise();
    console.log(this.notif)
    return this.notif.data.length;
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