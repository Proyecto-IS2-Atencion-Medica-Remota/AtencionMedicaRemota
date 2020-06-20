import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as io from 'socket.io-client'
import {Observable, Subscriber} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ChatServiceService{

  socket:any;
  server = "http://localhost:7000"
  r:any;
  constructor(http :HttpClient) {
   // console.log("ruuut",localStorage.getItem('rut'));
    this.socket = io(this.server);
   // this.socket = io(this.server,{query: `rut=${localStorage.getItem('rut')}`});
   }
   destroy(){
    this.socket.emit('adios',{rut: localStorage.getItem('rut')});
   }

   setR(r:string){
     this.r = r;
     console.log("this.r ",this.r);
     //this.socket.emit('join',{rut: this.r})
   }

   listen(eventName: String){
     return new Observable((Subscriber)=>{
       this.socket.on(eventName,(data)=>{
         Subscriber.next(data);
       })
     })
   }

   emit(eventName: String,data: any){
     this.socket.emit(eventName,data);
   }


}
