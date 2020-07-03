import { Component, OnInit,AfterViewInit, OnDestroy, AfterViewChecked,ElementRef, ViewChild } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { ChatServiceService } from '.././chat-service.service'
import { Inject } from '@angular/core'; 
import { CookieService } from 'ngx-cookie-service'
import { HttpClient } from '@angular/common/http';
import {Historial} from '../modelos/historial'
import { DOCUMENT } from '@angular/common';

//videochat
import { NgxAgoraService, Stream, AgoraClient, ClientEvent } from 'ngx-agora'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'], 
  providers:[
    {provide: 'rut',useValue: "ss"},
    ChatServiceService,
    NgxAgoraService
  ],
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked, AfterViewInit{
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  public rut:any;
  userChat = {
    from:'',
    to:'',
    text:''
  }
  aux_mensajes = {
    from:'',
    to:'',
    text:''
  }
  soy_paciente: boolean = false;
  soy_medico: boolean = false;
  room = {
    paciente: ' ',
    medico: ' '
  }
  //mensajes que se estan viendo actualmente
  allmensajes:Historial[] = []
  //con el que se va a hablar
  hablando_con:string = ''
  //si soy paciente aca van los medicos a los que puedo hablarle
  contactos_medicos:any=[]
  //si soy medico aca estan los pacientes a los que les puedo hablar
  contactos_pacientes:any = []
  //contacto que se selecciona desde la lista
  contacto:any;
  mensajes;
  rut_url:any;
  eventName = "send-message";
  //VIDEO CHAT
  salaVideo:string;
  salaVideo2:string;
  localCallId = 'agora-local'
  remoteCalls:string[] = []
  hay_seleccionado:boolean=false;
  terminar_video:boolean=false;


  private client: AgoraClient;
  private localStream:Stream;
  private uid: number;

  private alguien_seleccionado:boolean = false;
  constructor(
  @Inject(DOCUMENT) private document,
  private http: HttpClient,
  private cookie: CookieService,
  private elementRef: ElementRef, 
  private router: ActivatedRoute,
  private chatService: ChatServiceService,
  private agoraService:NgxAgoraService ) { 
    
    this.uid = Math.floor(Math.random()*1000)
    

  //  this.chatService.setR(this.router.snapshot.paramMap.get("rut"))
    this.rut_url = this.router.snapshot.paramMap.get("id");
    this.getContactos();
    this.chatService.emit("setConectado",true);
    this.router.params.subscribe(params =>{
      this.rut = params['id'];
    })
    
    this.userChat.from = this.rut;
    this.chatService.listen('text-event').subscribe((data)=>{
      this.mensajes = data;

        this.allmensajes.push({
          de_usuario: this.mensajes.from,
          para_usuario: this.mensajes.to,
          mensaje: this.mensajes.text,
          fecha: ''
        });
        setTimeout(() => this.scrollToBottom(),100);
        
    })
    
    if(this.cookie.get(this.rut_url) === "Paciente"){
      this.soy_paciente = true;
      this.soy_medico = false;
    }else{
      this.soy_medico = true;
      this.soy_paciente = false;
    }

  }

  ngAfterViewInit() {
    const s = this.document.createElement('script');
    s.type = 'text/javascript';
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/simple-peer/6.2.1/simplepeer.min.js";
    this.elementRef.nativeElement.appendChild(s);

    
  }

  ngAfterViewChecked(): void {
   
  }
  ngOnDestroy(): void {
    console.log("me desconecté del chat")
  }
  scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }                 
}
  ngOnInit(): void {

    this.chatService.socket.on('llamada_terminada',()=>{
      this.stop()
    })

    this.chatService.socket.on('llamando',(data)=>{
      Swal.fire({
        title: 'Llamada entrante',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Rechazar'
      }).then((result)=>{
        if(result.value){
          this.chatService.socket.emit('estado_llamada',[this.salaVideo,true])
        }else{
          this.chatService.socket.emit('estado_llamada',[this.salaVideo,false])
        }
      })
    })
  //  this.assignLocalStreamHandlers();
    //
    this.chatService.socket.on('estado-llamada',(data)=>{
      console.log("aceptó?",data)
      if(data){
        this.start()
        this.terminar_video = true;
      }
    })

    this.chatService.socket.on('terminar_llamada',()=>{
      this.stop()
      this.terminar_video = false;
    })
  }




  join(onSuccess?: (uid: number | string) => void, onFailure?: (error: Error) => void): void {
    this.client.join(null,this.salaVideo as string, this.uid, onSuccess, onFailure);
  }

  publish(): void {
    this.client.publish(this.localStream, err => console.log('Publish local stream error: ' + err));
  }

  private initLocalStream(onSuccess?: () => any): void {
    this.localStream.init(
      () => {
         // The user has granted access to the camera and mic.
         this.localStream.play(this.localCallId);
         if (onSuccess) {
           onSuccess();
         }
      },
      err => console.error('getUserMedia failed', err)
    );
  }

  private assignClientHandlers(): void {
    this.client.on(ClientEvent.LocalStreamPublished, evt => {
      const stream = evt.stream as Stream;
      
      console.log('Publish local stream successfully', "URL", this.localStream);
    });


    this.client.on(ClientEvent.Error, error => {
      console.log('Got error msg:', error.reason);
      if (error.reason === 'DYNAMIC_KEY_TIMEOUT') {
        this.client.renewChannelKey(
          '',
          () => console.log('Renewed the channel key successfully.'),
          renewError => console.error('Renew channel key failed: ', renewError)
        );
      }
    });
    this.client.on(ClientEvent.LiveStreamingStopped, evt =>{
      const stream = evt.stream as Stream;
      this.client.subscribe(stream, { audio: false, video: false }, err => {
        console.log('Subscribe stream failed', err);
      });
    })
    this.client.on(ClientEvent.RemoteStreamAdded, evt => {
      const stream = evt.stream as Stream;
      this.client.subscribe(stream, { audio: true, video: true }, err => {
        console.log('Subscribe stream failed', err);
      });
    });

    this.client.on(ClientEvent.RemoteStreamSubscribed, evt => {
      const stream = evt.stream as Stream;
      const id = this.getRemoteId(stream);
      if (true) {
        this.remoteCalls.push(id);
        console.log("LLAMADAS REMOTAS", this.remoteCalls)
        setTimeout(() => stream.play(id), 1000);
      }
    });

    this.client.on(ClientEvent.RemoteStreamRemoved, evt => {
      const stream = evt.stream as Stream;
      if (stream) {
        stream.stop();
        this.remoteCalls = [];
        console.log(`Remote stream is removed ${stream.getId()}`);
      }
    });

    this.client.on(ClientEvent.PeerLeave, evt => {
      const stream = evt.stream as Stream;
      if (stream) {
        stream.stop();
        this.remoteCalls = this.remoteCalls.filter(call => call !== `${this.getRemoteId(stream)}`);
        console.log(`${evt.uid} left from this channel`);
      }
    });
  }

  private getRemoteId(stream: Stream): string {
    return `agora_remote-${stream.getId()}`;
  }


  getContactos(){
    if(this.cookie.get(this.rut_url) === "Paciente"){
      //si soy paciente
      this.http.get(`http://localhost:8000/get_contactos_medicos/${this.rut_url}`).subscribe(
        res => {
        this.contactos_medicos = res as [];
        console.log("Contactos: ",this.contactos_medicos);
     });
    }else{
      //si soy medico
      this.http.get(`http://localhost:8000/get_contactos_pacientes/${this.rut_url}`).subscribe(
        res => {
        this.contactos_pacientes = res as [];
        console.log("Contactos: ",this.contactos_pacientes);
     });
    }
  }

    setDestinatario(s:string,j:any){
      if(this.cookie.get(this.rut_url) === "Paciente"){

        for(let i of this.contactos_medicos.data){
          if(i.rut === s)this.hablando_con = "Hablando con Dr. " + i.apellidos
        }
      }else{
        for(let i of this.contactos_pacientes.data){
          if(i.rut === s)this.hablando_con = "Hablando con "+ i.nombres
        }
      }
      this.userChat.to = s;
      if(this.cookie.get(this.rut_url) === "Paciente"){
        this.room.paciente = this.rut_url
        this.room.medico = s;
      }else{
        this.room.paciente = s;
        this.room.medico = this.rut_url
      }
      this.chatService.emit('hablar',this.room)
      this.chatService.emit('getHistorial',this.room)
      this.chatService.socket.on('historial',(data)=>{
      this.allmensajes = data;
      setTimeout(() => this.scrollToBottom(),100);
      })
      this.chatService.socket.on('getRoom',(data)=>{
        this.salaVideo = data as string;
        console.log("ROOM",this.salaVideo)
      })
      this.hay_seleccionado = true;
      this.alguien_seleccionado = true;
      
      
    }

    start(){

     this.client = this.agoraService.createClient({ mode: 'live', codec: 'h264' });
    this.assignClientHandlers();
    this.localStream = this.agoraService.createStream({ streamID: this.uid, audio: true, video: true, screen: false });
    this.initLocalStream(() => this.join(uid => this.publish(), error => console.error(error)));

    }
    stop(){
      
      this.localStream.stop()
      this.localStream.close()
      this.client.leave()
      this.localStream = null
    }

    llamar(){
    
    this.chatService.emit('llamar',this.salaVideo)  
    this.salaVideo2=this.salaVideo;
   // this.client = this.agoraService.createClient({ mode: 'live', codec: 'h264' });
   // this.assignClientHandlers();
   // this.localStream = this.agoraService.createStream({ streamID: this.uid, audio: true, video: true, screen: false });
   // this.initLocalStream(() => this.join(uid => this.publish(), error => console.error(error)));
      
  
    }
    terminar_llamada(){
      this.chatService.emit('terminar-llamada',this.salaVideo2)
      this.chatService.emit('terminar-llamada',this.salaVideo)

    }
    misMensajes(){
      this.chatService.emit(this.eventName,[this.userChat , this.room ]);
      //this.allmensajes.push({de_usuario:this.userChat.from, para_usuario:this.userChat.to, mensaje:this.userChat.text,fecha:'hoyxxd'})
      this.userChat.text = '';
    }

}