import { Component, OnInit } from '@angular/core';
import { HttpClient ,HttpParams ,HttpHeaders} from '@angular/common/http';
import { JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-detalles-medicos',
  templateUrl: './detalles-medicos.component.html',
  styleUrls: ['./detalles-medicos.component.css']
})

export class DetallesMedicosComponent implements OnInit {
  public estatura_actual: any;
  public peso_actual:any;
  public gs_actual:any;

  paciente$: any ;
  public nombre:string;
  public apellido:string;
  


  public into: any = [];

//DATOS GENERALES
public _hay_generales = {
estatura:0,
peso:0,
g_sanguineo:''
};
  public hay_generales: any = [];
  public datos_generales = {
    id:'',
    estatura:0,
    peso:0,
    g_sanguineo:''
  }
  public tabla_datos_paciente = {
    id_datos:'',
    rut:''
  }
  public todas_generales: any = [];
  public isGenerales: Boolean = false;
  //DATOS ALERGIAS
  public _hay_alergias: any = [];
  public datos_alergias = {
    id:'',
    nombre:''
  }
  public tabla_datos_alergias = {
    rut:'',
    id_alergias:''

  }
  public id_alergias;
  public todas_alergias = [{
    id:'',
    nombre:''
  }]
  public newAlergia:any;
  public al:Boolean =false;

  //DATOS INTOLERANCIAS
  public newIntolerancia:any;
  public _hay_intolerancias: any = [];
  public datos_intolerancias = {
    id: '',
    nombre:''
  }
  public tabla_datos_intolerancias = {
    rut:'',
    id_intolerancias:''
  }
  public id_intolerancias;

  public todas_intolerancias = [{
    id:'',
    nombre:''
  }]

  //DATOS CIRUGIAS
  public _hay_cirugias:any = [];
  public datos_cirugias = {
    id:'',
    fecha:'',
    nombre:''
  }
  public tabla_datos_cirugias = {
    rut:'',
    id_cirugias:''
  }
  public id_cirugias;
  public todas_cirugias = [{
    id:'',
    fecha:'',
    nombre:''
  }]
  public newCirugia:any;
  public newFecha:any;
  //------------------//
  public id_generales;
  public hay_alergias: any = [];
  public hay_intolerancias:any = [];
  public hay_cirugias:any = [];
  public id:String;
  public imgname;

  //BOLEANOS BOTONES GENERAL
  public editarEstatura:Boolean = false;
  public editarPeso:Boolean = false;
  public editarGS:Boolean = false;
  //BOLEANOS BOTONES ALERGIAS
  public editarAlergia:Boolean = false;
  public guardarAlergia:Boolean = false;
  public borrarAlergia:Boolean = true;
  public agregarAlergia:Boolean = false;
 //BOTONES INTOLERANCIAS
  public editarIntolerancia:Boolean = false;
  public guardarIntolerancia: Boolean = false;
  public borrarIntolerancia:Boolean = true;
  public agregarIntolerancia:Boolean = false;
  //BOTONES CIRUGIAS
  public editarCirugia:Boolean = false;
  public guardarCirugia:Boolean = false;
  public borrarCirugia:Boolean = true;
  public agregarCirugia:Boolean = false;

  public general = {
    estatura: '',
    peso:'',
    g_sanguineo:''
  }
  public rut_usuario;

  constructor(private http: HttpClient,  private router: Router) {
    this.rut_usuario=localStorage.getItem('rut');
    

    this.datos_Usuario();
    this.hay_General();
    this.hay_Alergias();
    this.hay_Intolerancias();
    this.hay_Cirugias();
    console.log(this.paciente$)

   }
   
  
  ngOnInit(): void {
  }

   makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

 hay_General(){
  this.http.get(`http://localhost:8000/hay_generales/${this.rut_usuario}/`).subscribe(
    res => {

      try {
        this._hay_generales = res as {id,estatura,peso,g_sanguineo};
        this.hay_generales = res as [];
        this.id_generales = this.hay_generales.data[0].id;        
        this.http.get(`http://localhost:8000/get_generales/${this.id_generales}`).subscribe(res =>{
        this.todas_generales = res as [];
        this._hay_generales =  res as {estatura,peso,g_sanguineo};
        this.estatura_actual = this.todas_generales.data[0].estatura;
        this.peso_actual = this.todas_generales.data[0].peso;
        this.gs_actual = this.todas_generales.data[0].g_sanguineo;
        });
      } catch (error) {

        var idG = this.makeid(20);
      this.http.post(`http://localhost:8000/post_generales/`,[{id:idG,estatura:0,peso:0,g_sanguineo:' '}]).subscribe(res=>{
        this.http.post(`http://localhost:8000/post_generales_data/`,[{id_datos:idG,rut:this.rut_usuario}]).subscribe(res=>{
          this.http.get(`http://localhost:8000/get_generales/${idG}`).subscribe(res =>{
            this._hay_generales =  res as {estatura,peso,g_sanguineo};
            this.id_generales = idG;
            this.estatura_actual = this._hay_generales.estatura;
            this.peso_actual = this._hay_generales.peso;
            this.gs_actual = this._hay_generales.g_sanguineo;
            });
         });
             });
      }
      

    }
  );
 }


 hay_Alergias(){
  this.http.get(`http://localhost:8000/hay_alergias/${this.rut_usuario}`).subscribe(
    res => {
      try {
        this._hay_alergias = res as [];
        this.id_alergias = this._hay_alergias.data[0].id;
        this.http.get(`http://localhost:8000/get_alergias/${this.rut_usuario}`).subscribe(res=>{
          this._hay_alergias = res as [];
        });
        this.al = true;
      } catch (error) {
        this.datos_alergias.id = this.makeid(20);
        this.tabla_datos_alergias.id_alergias = this.datos_alergias.id;
        this.tabla_datos_alergias.rut = this.rut_usuario;

      
       
     
      }
 });
}

hay_Intolerancias(){
  
  this.http.get(`http://localhost:8000/hay_intolerancias/${this.rut_usuario}`).subscribe(
    res => {
      try {
        this._hay_intolerancias = res as [];
        this.id_intolerancias = this._hay_intolerancias.data[0].id;
        this.http.get(`http://localhost:8000/get_intolerancias/${this.rut_usuario}`).subscribe(res=>{
          this._hay_intolerancias = res as [];
        });
      } catch (error) {
        this.datos_intolerancias.id = this.makeid(20);
        this.tabla_datos_intolerancias.id_intolerancias = this.datos_intolerancias.id;
        this.tabla_datos_intolerancias.rut = this.rut_usuario;
     
      }
 });
}

hay_Cirugias(){
  
  this.http.get(`http://localhost:8000/hay_cirugias/${this.rut_usuario}`).subscribe(
    res => {
      try {
        this._hay_cirugias = res as [];
        this.id_cirugias = this._hay_cirugias.data[0].id;
        this.http.get(`http://localhost:8000/get_cirugias/${this.rut_usuario}`).subscribe(res=>{
          this._hay_cirugias = res as [];
        });
      } catch (error) {
        this.datos_cirugias.id = this.makeid(20);
        this.tabla_datos_cirugias.id_cirugias = this.datos_cirugias.id;
        this.tabla_datos_cirugias.rut = this.rut_usuario;
      }
 });
}



datos_Usuario(){

  let params = new HttpParams().set("rut", this.rut_usuario);
  

  this.http.get('http://localhost:8000/perfilPaciente',{headers: new HttpHeaders({
    'Content-Type':'application/json'
    }), params: params}).subscribe(resp =>
    this.paciente$ = resp as []
  )
 

  
}

editEstatura(){
  this.editarEstatura = !this.editarEstatura;
}
editPeso(){
  this.editarPeso = !this.editarPeso;
}
editGS(){
  this.editarGS= !this.editarGS;
}


guardarEstatura(){
this.http.put(`http://localhost:8000/update_estatura/`,[this.id_generales,this.general.estatura]).subscribe(res=>{

});
this.estatura_actual = this.general.estatura;
this.editarEstatura = false;
}


guardarPeso(){
this.http.put(`http://localhost:8000/update_peso/`,[this.id_generales,this.general.peso]).subscribe(res=>{});
this.peso_actual = this.general.peso;
this.editarPeso = false;
}

guardarGS(){
  this.http.put(`http://localhost:8000/update_gs/`,[this.id_generales,this.general.g_sanguineo]).subscribe(res=>{});
  this.gs_actual = this.general.g_sanguineo;
  this.editarGS = false;
}

editAlergia(){
  this.guardarAlergia = !this.guardarAlergia;
  this.borrarAlergia = !this.borrarAlergia;
}
deleteAlergia(s:string,i:number){
  if(confirm("¿Estás seguro de querer borrar esta alergia?")) {
    this._hay_alergias.data.splice(i,1);
    this.http.post(`http://localhost:8000/deleteAlergia/`,[this.rut_usuario,s]).subscribe(
      res=>{
      },
      err =>{
      }
    );

    }
}

aAlergia(){
  this.agregarAlergia = !this.agregarAlergia;
}

saveAlergia(){
  if(this.newAlergia != null){

    var newid = this.makeid(20);
    this.http.post(`http://localhost:8000/newAlergia/`,[this.rut_usuario,newid,this.newAlergia]).subscribe(
      res=>{
      },
      err =>{
      }
    );
    this._hay_alergias.data.push({id:newid,nombre:this.newAlergia});
    console.log(this._hay_alergias);
    this.newAlergia = null;

  }

}

deleteIntolerancia(s:string,i:number){
  if(confirm("¿Estás seguro de querer borrar esta intolerancia?")) {
    this._hay_intolerancias.data.splice(i,1);
    this.http.post(`http://localhost:8000/deleteIntolerancia/`,[this.rut_usuario,s]).subscribe(
      res=>{
      },
      err =>{
      }
    );
  }
}
aIntolerancia(){
 this.agregarIntolerancia = !this.agregarIntolerancia;
}
saveIntolerancia(){
  if(this.newIntolerancia != null){

    var newid = this.makeid(20);
  this.http.post(`http://localhost:8000/newIntolerancia/`,[this.rut_usuario,newid,this.newIntolerancia]).subscribe(
    res=>{
    },
    err =>{
    }
  );
  this._hay_intolerancias.data.push({id:newid,nombre:this.newIntolerancia});
  this.newIntolerancia = null;

  }
  
}

aCirugia(){
  this.agregarCirugia = !this.agregarCirugia;
}

saveCirugia(){
  if(this.newCirugia != null){

  var newid = this.makeid(20);
  this.http.post(`http://localhost:8000/newCirugia/`,[this.rut_usuario,newid,this.newCirugia,this.newFecha]).subscribe(
    res=>{
    },
    err =>{
    }
  );
  this._hay_cirugias.data.push({id:newid,fecha:this.newFecha,nombre:this.newCirugia});
  console.log(this._hay_cirugias.data);
  this.newCirugia = null;
  this.newFecha = null;
  }
  
}

deleteCirugia(s:string,i:number){
  if(confirm("¿Estás seguro de querer borrar esta cirugia?")) {
  this._hay_cirugias.data.splice(i,1);
  this.http.post(`http://localhost:8000/deleteCirugia/`,[this.rut_usuario,s]).subscribe(
    res=>{
    },
    err =>{
    }
  );
  }
}

}