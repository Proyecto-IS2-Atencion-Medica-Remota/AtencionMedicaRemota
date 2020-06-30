import { Component, OnInit , ViewChild,TemplateRef} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpClient ,HttpParams ,HttpHeaders} from '@angular/common/http';
import swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe ,registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

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
  DAYS_OF_WEEK,
} from 'angular-calendar';


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
  selector: 'app-agenda-medico',
  
  templateUrl: './agenda-medico.component.html',
  styleUrls: ['./agenda-medico.component.css'],
  providers: [DatePipe]
})
export class AgendaMedicoComponent implements OnInit {
  myDate = new Date();
  rut_medico: any;
  rut_paciente:any;
  horarios$:any=[];
  bloque:any;
  borrar:boolean;

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  view: CalendarView = CalendarView.Week;

  

  viewDate: Date = new Date();
  
  

  CalendarView = CalendarView;

  
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
    
    console.log("hola")
    this.events = [];
  }
  

  refresh: Subject<any> = new Subject();

  
  activeDayIsOpen: boolean = true;

  constructor(private rutaActiva: ActivatedRoute, private http: HttpClient,private datePipe: DatePipe) { 
    this.rut_medico=localStorage.getItem('rut');
    
    console.log(this.rut_medico);

    
  }
  borrarHora(action: string, event: CalendarEvent): void {
    console.log(action, event);
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

 

  addEvent(fechainicio:Date,fechafin:Date, bloque:any): void {
    if(bloque!="Disponible"){
      this.events = [
        ...this.events,
        {
          title: bloque,
          start: fechainicio,
          end: fechafin,
          color: colors.blue,
          
          
        },
      ];
    }else{
      this.events = [
        ...this.events,
        {
          title: bloque,
          start: fechainicio,
          end: fechafin,
          color: colors.green,
          
          
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
      
      
      
          if(entry.bloque_1!="0000000-0"){
            console.log("añadir")
            const fechainicio= addDays(addHours(startOfDay(startOfWeek(new Date())), 10),index+1)
            const fechafin= addDays(addHours(startOfDay(startOfWeek(new Date())), 11),index+1)
            this.addEvent(fechainicio,fechafin, "Agendado por "+entry.bloque_1);
          }else{
            const fechainicio= addDays(addHours(startOfDay(startOfWeek(new Date())), 10),index+1)
            const fechafin= addDays(addHours(startOfDay(startOfWeek(new Date())), 11),index+1)
            this.addEvent(fechainicio,fechafin, "Disponible");
          }
          if(entry.bloque_2!="0000000-0"){
            console.log("añadir")
            const fechainicio= addDays(addHours(startOfDay(startOfWeek(new Date())), 11),index+1)
            const fechafin= addDays(addHours(startOfDay(startOfWeek(new Date())), 12),index+1)
            this.addEvent(fechainicio,fechafin, "Agendado por "+entry.bloque_2);
          }else{
            const fechainicio= addDays(addHours(startOfDay(startOfWeek(new Date())), 11),index+1)
            const fechafin= addDays(addHours(startOfDay(startOfWeek(new Date())), 12),index+1)
            this.addEvent(fechainicio,fechafin, "Disponible");
          }
          if(entry.bloque_3!="0000000-0"){
            console.log("añadir")
            const fechainicio= addDays(addHours(startOfDay(startOfWeek(new Date())), 12),index+1)
            const fechafin= addDays(addHours(startOfDay(startOfWeek(new Date())), 13),index+1)
            this.addEvent(fechainicio,fechafin, "Agendado por "+entry.bloque_3);
          }else{
            const fechainicio= addDays(addHours(startOfDay(startOfWeek(new Date())), 12),index+1)
            const fechafin= addDays(addHours(startOfDay(startOfWeek(new Date())), 13),index+1)
            this.addEvent(fechainicio,fechafin, "Disponible");
          }
          if(entry.bloque_4!="0000000-0"){
            console.log("añadir")
            const fechainicio= addDays(addHours(startOfDay(startOfWeek(new Date())), 13),index+1)
            const fechafin= addDays(addHours(startOfDay(startOfWeek(new Date())), 14),index+1)
            this.addEvent(fechainicio,fechafin, "Agendado por "+entry.bloque_4);
          }else{
            const fechainicio= addDays(addHours(startOfDay(startOfWeek(new Date())), 13),index+1)
            const fechafin= addDays(addHours(startOfDay(startOfWeek(new Date())), 14),index+1)
            this.addEvent(fechainicio,fechafin, "Disponible");
          }
     
    });
        
    
    
  }

 

  clickEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    const fecha = this.datePipe.transform(event.start, 'yyyy-MM-dd');
    
    console.log(event.title, fecha)
  }
  agendarHora( event: CalendarEvent){
    const fecha = this.datePipe.transform(event.start, 'yyyy-MM-dd');
    console.log(event.title, fecha)
    
  }
  
}
