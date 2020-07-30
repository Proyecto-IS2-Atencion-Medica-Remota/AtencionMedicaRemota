import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';


interface ImageInfo{
  link:string;
}

@Injectable({
  providedIn: 'root'
})

export class ImageService {
  private images:object[] = [];
  private url: string = 'https://api.imgur.com/3/image';
  private clientId: string = '68c3ed6b2565d20';
  imageLink:any;
  private accessToken:string = "f410305c695fa45b55a076356eeb4427636e1058";
 

  constructor(private http:HttpClient) { }
  
  async uploadImage(imageFile:File){
    let formData = new FormData();
    formData.append('image', imageFile, imageFile.name);

    let header = new HttpHeaders({
      "authorization": 'Bearer '+this.accessToken
});
   
    const imageData = await this.http.post(this.url, formData, {headers:header}).toPromise();
    this.imageLink = imageData['data'].link;

    let newImageObject:ImageInfo = {
     
      link:this.imageLink
    };

    this.images.unshift(newImageObject);
    console.log(newImageObject.link)
    return newImageObject.link
  }

  getImages(){
    return this.images;
  }
}