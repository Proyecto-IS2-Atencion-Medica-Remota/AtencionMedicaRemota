import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as io from 'socket.io-client'
import {Observable, Subscriber} from 'rxjs'
import { Component, OnInit, AfterViewChecked,ElementRef, ViewChild } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatServiceService implements OnInit, OnDestroy{

  socket:any;
  server = "http://localhost:7000"
  r:any;
  constructor(http :HttpClient) {
    this.socket = io(this.server);
   }
  ngOnDestroy(): void {
    console.log("servicio chat desconectado")
  }
  ngOnInit(): void {
   
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
