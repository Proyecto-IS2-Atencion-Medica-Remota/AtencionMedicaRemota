import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    const resultPosts = []
    for(const post of value){
      if((post.nombres.toLowerCase().indexOf(args[0].toLowerCase()) > -1 || post.apellidos.toLowerCase().indexOf(args[0].toLowerCase())>-1) && (args[1]==post.especialidad || args[1]=='todoslosprofesionales') || post.rut.indexOf(args[0])>-1){
        if(args[2]=='0'){
          resultPosts.push(post);
        }else if(args[2]=='1' && post.valoracionpromedio>=0.0 && post.valoracionpromedio<=1.0){
          console.log("entro a uno");
          resultPosts.push(post);
        }else if(args[2]=='2' && post.valoracionpromedio>1.0 && post.valoracionpromedio<=2.0){
          resultPosts.push(post);
        }else if(args[2]=='3' && post.valoracionpromedio>2.0 && post.valoracionpromedio<=3.0){
          resultPosts.push(post);
        }else if(args[2]=='4' && post.valoracionpromedio>3.0 && post.valoracionpromedio<=4.0){
          resultPosts.push(post);
        }else if(args[2]=='5' && post.valoracionpromedio>4.0 && post.valoracionpromedio<=5.0){
          resultPosts.push(post);
        }         
      }
    }
    return resultPosts;
  }

}
