import { Component, OnInit , ViewChild,TemplateRef} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpClient ,HttpParams ,HttpHeaders} from '@angular/common/http';
import swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe ,registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { MessagingService } from 'src/app/service/messaging.service';


registerLocaleData(localeEs);

import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
  endOfWeek,
  startOfWeek,
} from 'date-fns';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { send } from 'process';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
  green: {
    primary: '#008000',
    secondary: '#b7d5ac',
  },
};


@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.component.html',
  styleUrls: ['./horarios.component.css'],
  providers: [DatePipe]
})
export class HorariosComponent implements OnInit {
  
  myDate = new Date();
  rut_medico: any;
  rut_paciente:any;
  horarios$:any=[];
  bloque:any;
  borrar:boolean;
  token: any;
  nombre_paciente: any;
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-trash-o" aria-hidden="true"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.borrarHora('Edited', event);
      },
    }
  ];

 

  events:CalendarEvent[];
  

  ngOnInit(): void {
    this.getHorario();
    this.getNombre();
    console.log("hola")
    this.events = [];
  }
  

  refresh: Subject<any> = new Subject();

  
  activeDayIsOpen: boolean = false;

  constructor(private rutaActiva: ActivatedRoute, private http: HttpClient,private datePipe: DatePipe,private afMessaging: AngularFireMessaging, private messagingService: MessagingService) { 
    this.rut_medico=this.rutaActiva.snapshot.paramMap.get('id');
    this.rut_paciente=localStorage.getItem('rut');
    console.log(this.rut_medico);

    
  }
  borrarHora(action: string, event: CalendarEvent): void {
    console.log(action, event);
    this.borrar=false;
    if("10:00-11:00: Agendado por "+this.rut_paciente==event.title ){
      this.borrar=true;
      this.bloque="bloque 1";
    }else if("11:00-12:00: Agendado por "+this.rut_paciente==event.title){
      this.borrar=true;
      this.bloque="bloque 2";
    }else if("12:00-13:00: Agendado por "+this.rut_paciente==event.title){
      this.borrar=true;
      this.bloque="bloque 3";
    }else if("13:00-14:00: Agendado por "+this.rut_paciente==event.title){
      this.borrar=true;
      this.bloque="bloque 4";
    }
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    if(this.borrar){
      console.log("la hora es mia");
   
      console.log(event.title)
      console.log("borrar")
      
      
      swalWithBootstrapButtons.fire({
        title: '¿Estás seguro de querer eliminar está hora?',
        text: "No podrás revertir esto",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, eliminar hora',
        cancelButtonText: 'No, cancelar',
        reverseButtons: true
      }).then((result) => {
        if (result.value) {
          const fecha = this.datePipe.transform(event.start, 'yyyy-MM-dd');
          console.log(event.title, fecha)
          if(event.title=="10:00-11:00"){
            this.bloque="bloque 1";
          }else if(event.title=="11:00-12:00"){
            this.bloque="bloque 2";
          }else if(event.title=="12:00-13:00"){
            this.bloque="bloque 3";
          }else if(event.title=="13:00-14:00"){
            this.bloque="bloque 4";
          }
          console.log(fecha);
          console.log(this.bloque);
          let params = new HttpParams().set("fecha", fecha).set("bloque",this.bloque).set("rut_medico", this.rut_medico).set("rut_paciente",this.rut_paciente);
          this.http.get('http://localhost:8000/borrarHora',{headers: new HttpHeaders({
          'Content-Type':'application/json'
          }), params: params}).subscribe(
            resp => swalWithBootstrapButtons.fire(
              'Realizado!',
              'Hora eliminada con éxito',
              'success'
            ).then((result) => {
              
              location.reload();
            }),
            error => swalWithBootstrapButtons.fire(
              'Error',
              'Error al eliminar la hora',
              'error'
            )
          )
          
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelado',
            'Se canceló eliminar esta hora',
            'error'
          )
        }
      })
    }else{
      swalWithBootstrapButtons.fire(
        'Error',
        'La hora no corresponde a una hora suya',
        'error'
      )
    }
      
    
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
   
    
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }
  
  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    
  }

 

  addEvent(fecha:Date, bloque:any): void {
    if(bloque=="bloque 1"){
      this.events = [
        ...this.events,
        {
          title: '10:00-11:00',
          start: fecha,
          end: fecha,
          color: colors.green,
          
          
        },
      ];
    }else if(bloque=="bloque 2"){
      this.events = [
        ...this.events,
        {
          title: '11:00-12:00',
          start: fecha,
          end: fecha,
          color: colors.green,
          
          
        },
      ];
    }else if(bloque=="bloque 3"){
      this.events = [
        ...this.events,
        {
          title: '12:00-13:00',
          start: fecha,
          end: fecha,
          color: colors.green,
          
         
        },
      ];
    }else if(bloque=="bloque 4"){
      this.events = [
        ...this.events,
        {
          title: '13:00-14:00',
          start: fecha,
          end: fecha,
          color: colors.green,
          
          
        },
      ];
    }else{
      this.events = [
        ...this.events,
        {
          title: bloque,
          start: fecha,
          end: fecha,
          color: colors.red,
          actions: this.actions,
          
        },
      ];
    }
    
  }



  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  

  async getHorario(){
    let params = new HttpParams().set("rut", this.rut_medico);
    

    this.horarios$= await this.http.get('http://localhost:8000/verHorarios',{headers: new HttpHeaders({
      'Content-Type':'application/json'
      }), params: params}).toPromise();
    
    console.log(this.horarios$.data)
    
    this.horarios$.data.forEach((entry, index)  => {
      
      console.log(index)
      const fechahoy = this.datePipe.transform(addDays(startOfWeek(new Date()), 1), 'dd-MM-yyyy');
      console.log(entry.fecha,fechahoy )
      const fecha=addDays(startOfWeek(new Date()), index+1)
      
          if(entry.bloque_1=="0000000-0"){
            console.log("añadir")
            this.addEvent(fecha, "bloque 1");
          }else{
            this.addEvent(fecha, "10:00-11:00: Agendado por "+entry.bloque_1);
          }
          if(entry.bloque_2=="0000000-0"){
            console.log("añadir")
            this.addEvent(fecha, "bloque 2");
          }else{
            this.addEvent(fecha, "11:00-12:00: Agendado por "+entry.bloque_2);
          }
          if(entry.bloque_3=="0000000-0"){
            console.log("añadir")
            this.addEvent(fecha, "bloque 3");
          }else{
            this.addEvent(fecha, "12:00-13:00: Agendado por "+entry.bloque_3);
          }
          if(entry.bloque_4=="0000000-0"){
            console.log("añadir")
            this.addEvent(fecha, "bloque 4");
          }else{
            this.addEvent(fecha, "13:00-14:00: Agendado por "+entry.bloque_4);
          }
     
    });
        
    
    
  }

 

  clickEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    const fecha = this.datePipe.transform(event.start, 'yyyy-MM-dd');
    
    console.log(event.title, fecha)
  }
  agendarHora( event: CalendarEvent){
    console.log(this.nombre_paciente.data[0].nombres);
    const fecha = this.datePipe.transform(event.start, 'fullDate');
    console.log(event.title, fecha)
    var f = this.parseDate(fecha);
    if(event.title=="10:00-11:00"){
      this.bloque="bloque 1";
    }else if(event.title=="11:00-12:00"){
      this.bloque="bloque 2";
    }else if(event.title=="12:00-13:00"){
      this.bloque="bloque 3";
    }else if(event.title=="13:00-14:00"){
      this.bloque="bloque 4";
    }
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: '¿Quieres agendar esta hora?',
      text: "No podrás revertir esto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, agendar hora',
      cancelButtonText: 'No, cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        console.log(fecha);
        console.log(this.bloque);

        let params = new HttpParams().set("fecha", fecha).set("bloque",this.bloque).set("rut_medico", this.rut_medico).set("rut_paciente",this.rut_paciente);
        this.http.get('http://localhost:8000/agendarHora',{headers: new HttpHeaders({
          'Content-Type':'application/json'
        }), params: params}).subscribe(
          resp => swalWithBootstrapButtons.fire(
            'Realizado!',
            'Hora agendada con éxito',
            'success'
            ).then((result) => {
              this.sendNotif(f,event.title);
              this.delay(1500).then(any=>{
                location.reload();
              });
              //location.reload();
            }),
          error => swalWithBootstrapButtons.fire(
            'Error',
            'El paciente ya cuenta con una hora agendada',
            'error'
          )
        )
        
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'Se canceló el agendado de esta hora',
          'error'
        )
      }
    })
    
    
      
      
    
  }
  async sendNotif(fecha,hora){
    hora = hora.split("-");
    await this.getToken();
    var msg = "Tienes una nueva cita con: "+this.nombre_paciente.data[0].nombres+" "+this.nombre_paciente.data[0].apellidos+", el día "+fecha[0]+" "+fecha[2]
    +" de "+fecha[1]+" del "+fecha[3]+" a las "+hora[0]+" hrs.";
    console.log(msg);
    this.messagingService.sendPushMessage("Hola",msg,this.token.data.token);
    this.http.post(`http://localhost:8000/postNotif`,[msg,this.rut_medico]).subscribe(
      res=>{
      },
      err =>{
      }
    );
  }

 async getToken(){
    console.log("gettoken");
    let params = new HttpParams().set("rut", this.rut_medico);
    await this.http.get('http://localhost:8000/getToken',{headers: new HttpHeaders({
      'Content-Type':'application/json'
      }), params: params}).toPromise().then(resp =>
      this.token = resp
    )
    //console.log("asdadadada: ",this.token.data.token);
    console.log("cvbc");
  }
  async getNombre(){
    let params = new HttpParams().set("rut", this.rut_paciente);
    await this.http.get('http://localhost:8000/getNombre',{headers: new HttpHeaders({
      'Content-Type':'application/json'
      }), params: params}).toPromise().then(resp =>
      this.nombre_paciente = resp
    )
  }
  async delay(ms: number) {
    await new Promise(resolve => setTimeout(()=>resolve(), ms)).then(()=>console.log("fired"));
  }


  parseDate(fecha){
    var f = fecha.split(/ |, | /);
    if(f[0] == "Monday"){ f[0] = "Lunes";}
    else if(f[0] == "Tuesday"){ f[0] = "Martes";}
    else if(f[0] == "Wednesday"){ f[0] = "Miércoles";}
    else if(f[0] == "Thursday"){ f[0] = "Jueves";}
    else if(f[0] == "Friday"){ f[0] = "Viernes";}
    else if(f[0] == "Saturday"){ f[0] = "Sábado";}
    else if(f[0] == "Sunday"){ f[0] = "Domingo";}
    if(f[1] == "January"){ f[1] = "Enero";}
    else if(f[1] == "February"){ f[1] = "Febrero";}
    else if(f[1] == "March"){ f[1] = "Marzo";}
    else if(f[1] == "April"){ f[1] = "Abril";}
    else if(f[1] == "May"){ f[1] = "Mayo";}
    else if(f[1] == "June"){ f[1] = "Junio";}
    else if(f[1] == "July"){ f[1] = "Julio";}
    else if(f[1] == "August"){ f[1] = "Agosto";}
    else if(f[1] == "September"){ f[1] = "Septiembre";}
    else if(f[1] == "October"){ f[1] = "Octubre";}
    else if(f[1] == "November"){ f[1] = "Noviembre";}
    else if(f[1] == "December"){ f[1] = "Diciembre";}
    return f;
  }
  
}
