import { Component, OnInit, OnDestroy, AfterViewChecked,ElementRef, ViewChild } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { ChatServiceService } from '.././chat-service.service'
import { Inject } from '@angular/core'; 
import { CookieService } from 'ngx-cookie-service'
import { HttpClient } from '@angular/common/http';
import {Historial} from '../modelos/historial'


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers:[
    {provide: 'rut',useValue: "ss"},
    ChatServiceService
  ]
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked{
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
  constructor(private http: HttpClient,private cookie: CookieService, private router: ActivatedRoute, private chatService: ChatServiceService) { 
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
    })
    this.scrollToBottom();
    if(this.cookie.get(this.rut_url) === "Paciente"){
      this.soy_paciente = true;
      this.soy_medico = false;
    }else{
      this.soy_medico = true;
      this.soy_paciente = false;
    }

  }
  ngAfterViewChecked(): void {
    this.scrollToBottom();
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
          if(i.rut === s)this.hablando_con = "Hablando con Dr. " + i.nombres
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
     // console.log(this.rut_url,this.room)
      this.chatService.emit('hablar',this.room)
      this.chatService.emit('getHistorial',this.room)
      this.chatService.socket.on('historial',(data)=>{
      this.allmensajes = data;
      })
    }


    misMensajes(){
      this.chatService.emit(this.eventName,[this.userChat , this.room ]);
      //this.allmensajes.push({de_usuario:this.userChat.from, para_usuario:this.userChat.to, mensaje:this.userChat.text,fecha:'hoyxxd'})
      this.userChat.text = '';
    }
}
