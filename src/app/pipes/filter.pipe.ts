import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  
  transform(value: any, ...args: any[]): any {
    const resultPosts = []
    for(const post of value){
      if((post.nombres.toLowerCase().indexOf(args[0].toLowerCase()) > -1 || post.apellidos.toLowerCase().indexOf(args[0].toLowerCase())>-1 || post.rut.indexOf(args[0])>-1) && (args[1]==post.especialidad || args[1]=='todoslosprofesionales') ){
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
    resultPosts.sort(function(a,b){
      if(a.valoracionpromedio>b.valoracionpromedio){
        return 1;
      }else if(a.valoracionpromedio<b.valoracionpromedio){
        return -1;
      }
      return 0;
    });
    resultPosts.sort(function(a,b){
      if(a.apellidos>b.apellidos){
        return 1;
      }else if(a.apellidos<b.apellidos){
        return -1;
      }
      return 0;
    });
    resultPosts.sort(function(a,b){
      if(a.nombres>b.nombres){
        return 1;
      }else if(a.nombres<b.nombres){
        return -1;
      }
      return 0;
    });

    if(args[3]=="opt1"){
      resultPosts.sort(function(a,b){
        if(a.nombres>b.nombres){
          return 1;
        }else if(a.nombres<b.nombres){
          return -1;
        }
        return 0;
      });
    }else if(args[3]=="opt2"){
      resultPosts.sort(function(a,b){
        if(a.apellidos>b.apellidos){
          return 1;
        }else if(a.apellidos<b.apellidos){
          return -1;
        }
        return 0;
      });
    }else{
      resultPosts.sort(function(a,b){
        if(a.rut>b.rut){
          return 1;
        }else if(a.rut<b.rut){
          return -1;
        }
        return 0;
      });
    }
    


    return resultPosts;
  }

}