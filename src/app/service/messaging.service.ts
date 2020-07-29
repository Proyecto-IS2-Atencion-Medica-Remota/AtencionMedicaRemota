import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
@Injectable()
export class MessagingService {
  currentMessage = new BehaviorSubject(null);

  constructor(private angularFireMessaging: AngularFireMessaging, private httpClient: HttpClient) {
    this.angularFireMessaging.messaging.subscribe((_messaging) => {
      _messaging.onMessage = _messaging.onMessage.bind(_messaging);
      _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
    });
  }
  requestPermission(rut) {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        this.setToken(token,rut);
        console.log(token);
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }
  
  receiveMessage() {
    this.angularFireMessaging.messages.subscribe((payload) => {
      //console.log('new message received. ', payload.notification.body);
      this.currentMessage.next(payload);
    });
  }

  sendPushMessage(title, message,token){
    let data = {
        "notification": {
            "title": title,
            "body": message,
            "click_action": "http://localhost:4200/",
            "icon": "https://i0.pngocean.com/files/501/90/524/video-game-gaymer-gamer-queer-red-cross-hospital-icon.jpg",
            "sound" : "default"
        },
        "to": token
    }
    console.log(token);
    console.log("asdas");
    let postData = JSON.stringify(data);    
    let url ="https://fcm.googleapis.com/fcm/send" ;
    this.httpClient.post(url,  postData, {
      headers: new HttpHeaders()
      // put the server key here
          .set('Authorization', 'key=AAAAv4_xnKA:APA91bH05rVxeILOJMHb3E9rQd-7zwEm8B90nEAYXmtDldv4ETqxEKR1xREuN_VSAd0RtLcd6pSA2v8HIkFiD3me1UY2Z6-D1Es38ay1lISdXpkVnOf8lLYxYTirbAluS2IEE8lrAWxP')
          .set('Content-Type', 'application/json'),
     })
     .subscribe((response: Response) => {
        console.log(response)
      },
      (error: Response) => {
        console.log(error);
        console.log("error" + error);
      });

  }

  setToken(token: string,rut: string){
    this.httpClient.post(`http://localhost:8000/setToken`,[token,rut]).subscribe(
      res=>{
      },
      err =>{
      }
    );
  }
  
}
