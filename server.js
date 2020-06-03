const express = require('express');
const app = express();
const msql = require("mysql");
const cors = require('cors');
const bodyParser = require('body-parser')

const Pool = require('pg');

const _ = require('lodash');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

    // config for your database
/*
const con = msql.createConnection({

        user: 'isw2020e',
        password: 'isw2020e',
        host: 'http://plop.inf.udec.cl/phppgadmin/',
        database: 'public',
        insecureAuth : true
    });

*/
const con = new Pool.Client("postgres://isw2020e:isw2020e@plop.inf.udec.cl:5432/");
con.connect();

con.on('error',function (error,client) {

        if (error) console.log(error);
        console.log("Connected!");
       });

       
       app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
        res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
        
        next();
    });
  


app.use(bodyParser.json());

app.get('/especialistas', (req, res) => {
    console.log("holaaaaaaaaaaa")
       const select_query=`select u.nombres, u.apellidos, u.rut, e.especialidad, e.formacionacademica, e.experiencia, e.cantcitasrealizadas, e.horariodisponible, u.contacto from especialista as e, usuario as u where e.rut=u.rut;`
  con.query(select_query, (err, result) => {
        if (err){
          	return res.send(err)
       	}else{
           	return res.json({

                   data: result.rows

           	})
        }
   	});
});


app.get('/perfilPaciente', (req, res) => {
    const  id=req.query.rut;
    console.log(id);
    const values = [id]
    const select_query=`select *, date(u.fechaderegistro)::text as fecharegistro from usuario as u, paciente as p where u.rut=p.rut and u.rut=$1;`
    con.query(select_query,values, (err, result) => {
     if (err){
           return res.send(err)
        }else{
            return res.json({

                data: result.rows

            })
     }
    });
    
});





app.get('/verEspecialista', (req, res) => {
    var id=req.query.rut;
    console.log(id);

    const select_query=`select * ,date(u.fechaderegistro)::text as fecharegistro, date(u.fechaderegistro)::text as horaregistro from especialista as e, usuario as u where e.rut =u.rut and e.rut=$1`
    con.query(select_query,[id], (err, result) => {
     if (err){
           return res.send(err)
        }else{
            return res.json({

                data: result.rows

            })
     }
    });
    
});


//claudio

//para buscar especialistas especificos por especialidad
app.get('/esp/:e',async (req,res)=>{
    const {e} = req.params;
    con.query(`select u.nombres, u.apellidos, u.rut, e.especialidad, e.formacionacademica, e.experiencia, e.cantcitasrealizadas, e.horariodisponible, u.contacto from especialista as e, usuario as u where e.rut=u.rut and e.especialidad  LIKE $1;`,['%' + e + '%'],(err,result)=>{
        if (err){
            return res.send(err)
         }else{
             return res.json({

                 data: result.rows

             })
      }

    });
});

app.post('/pfmedico',(req,res) => {
    console.log("??");
    const result =  con.query('INSERT INTO datos_medicos VALUES ($1,$2)', [req.body]);
    res.json({ message: 'Datos Guardados' });
});

app.get('/getuser/:rut',(req,res) => {
    const rut = req.params.rut;
    const values = [rut]
    con.query('SELECT * FROM usuario,paciente WHERE paciente.rut = $1 and paciente.rut = usuario.rut ',[rut],(err,result)=>{
        if (err){
            return res.send(err)
         }else{
             return res.json({

                 data: result.rows

             })
      }

    });
});
//INTOLERANCIAS
app.get('/get_intolerancias/:rut',(req,res)=>{
    const {rut} = req.params;
    con.query('SELECT intolerancias.id,intolerancias.nombre FROM intolerancias,datos_intolerancias,paciente WHERE intolerancias.id = datos_intolerancias.id_intolerancias and datos_intolerancias.rut = paciente.rut and paciente.rut = $1',[rut], (err,result) => {
        if(err){
            return res.send(err);
        }else{
            return res.json({
                data: result.rows  
            }) 
        }
    })
});

app.get('/hay_intolerancias/:rut',(req,res)=>{
    const {rut} = req.params;
    con.query('SELECT intolerancias.id FROM intolerancias,datos_intolerancias,paciente WHERE intolerancias.id = datos_intolerancias.id_intolerancias and datos_intolerancias.rut = paciente.rut and paciente.rut = $1',[rut], (err,result) => {
        if(err){
            return res.send(err);
        }else{
            return res.json({
                data: result.rows  
            }) 
        }
    })
});

app.post('/post_intolerancias',(req,res)=>{
    const values = [
        req.body[0].id,
        req.body[0].nombre
    ]
    con.query('INSERT INTO intolerancias VALUES ($1,$2)',values);
    res.json({message: "DATOS intolerancias guardados"});
});

app.post('/post_intolerancias_paciente',(req,res)=>{
    const values = [
        req.body[0].rut,
        req.body[0].id_intolerancias
    ]
    con.query('INSERT INTO datos_intolerancias VALUES ($1,$2)',values);
    res.json({message:"DATOS_intolerancias(tabla) SAVED"});
});

app.post('/newIntolerancia',(req,res)=>{
 
    con.query('INSERT INTO intolerancias (id,nombre) values ($1,$2) ',[req.body[1],req.body[2]],(err,result)=>{
        if(err){
            send(err);
        }
    });
    con.query('INSERT INTO datos_intolerancias (rut,id_intolerancias) values ($1,$2)', [req.body[0],req.body[1]],(err,result)=>{
        if(err){
            send(err);
        }else{
            console.log("Se guardó into: ",req.body[0],req.body[1],req.body[2]);
            return res.send("OK");
        }
    });
    
});

app.post('/deleteIntolerancia',(req,res) =>{
    con.query('DELETE FROM datos_intolerancias WHERE rut = $1 and id_intolerancias = $2',[req.body[0],req.body[1]]);
    con.query('DELETE FROM intolerancias WHERE id = $1',[req.body[1]]);
    console.log("Se borró into: ",req.body[0],req.body[1]);
});

//ALERGIAS
app.post('/newAlergia',(req,res)=>{
    con.query('INSERT INTO alergias (id,nombre) values ($1,$2) ',[req.body[1],req.body[2]],(err,result)=>{
        if(err){
            send(err);
        }
    });
    con.query('INSERT INTO datos_alergias (rut,id_alergias) values ($1,$2)', [req.body[0],req.body[1]],(err,result)=>{
        if(err){
            send(err);
        }else{
            console.log("Se insertó ALERGIA: ",req.body);
            return res.send("OK");
        }
    });
    
});

app.post('/deleteAlergia',(req,res) =>{
    con.query('DELETE FROM datos_alergias WHERE rut = $1 and id_alergias = $2',[req.body[0],req.body[1]]);
    con.query('DELETE FROM alergias WHERE id = $1',[req.body[1]]);
    console.log("Se borró ALERGIA: ",req.body[0],req.body[1]);
});

app.get('/get_alergias/:rut',(req,res)=>{
    const {rut} = req.params;
    con.query('SELECT alergias.id, alergias.nombre FROM alergias,datos_alergias,paciente WHERE alergias.id = datos_alergias.id_alergias and datos_alergias.rut = paciente.rut and paciente.rut = $1',[rut], (err,result) => {
        if(err){
            return res.send(err);
        }else{
            return res.json({
                data: result.rows  
            }) 
        }
    })
});

app.get('/hay_alergias/:rut',(req,res)=>{
    const {rut} = req.params;
    con.query('SELECT alergias.id FROM alergias,datos_alergias,paciente WHERE alergias.id = datos_alergias.id_alergias and datos_alergias.rut = paciente.rut and paciente.rut = $1',[rut], (err,result) => {
        if(err){
            return res.send(err);
        }else{
            return res.json({
                data: result.rows  
            }) 
        }
    })
});

//DATOS CIRUGIAS

app.post('/newCirugia',(req,res)=>{
    
    con.query('INSERT INTO cirugias (id,fecha,nombre) values ($1,$2,$3) ',[req.body[1],req.body[3],req.body[2]],(err,result)=>{
        if(err){
            send(err);
        }
    });
    con.query('INSERT INTO datos_cirugias (rut,id_cirugias) values ($1,$2)', [req.body[0],req.body[1]],(err,result)=>{
        if(err){
            send(err);
        }else{
            console.log("Se insertó cirugia: ",req.body);
            return res.send("OK");
        }
    });
    
});

app.post('/deleteCirugia',(req,res) =>{
    con.query('DELETE FROM datos_cirugias WHERE rut = $1 and id_cirugias = $2',[req.body[0],req.body[1]]);
    con.query('DELETE FROM cirugias WHERE id = $1',[req.body[1]]);
    console.log("Se borró cirugía: ",req.body[0],req.body[1]);
});

app.get('/get_cirugias/:rut',(req,res)=>{
    const {rut} = req.params;
    con.query('SELECT cirugias.id, date(cirugias.fecha)::text as fecha, cirugias.nombre FROM cirugias,datos_cirugias,paciente WHERE cirugias.id = datos_cirugias.id_cirugias and datos_cirugias.rut = paciente.rut and paciente.rut = $1',[rut], (err,result) => {
        if(err){
            return res.send(err);
        }else{
            return res.json({
                data: result.rows  
            }) 
        }
    })
});

app.get('/hay_cirugias/:rut',(req,res)=>{
    const {rut} = req.params;
    con.query('SELECT cirugias.id FROM cirugias,datos_cirugias,paciente WHERE cirugias.id = datos_cirugias.id_cirugias and datos_cirugias.rut = paciente.rut and paciente.rut = $1',[rut], (err,result) => {
        if(err){
            return res.send(err);
        }else{
            return res.json({
                data: result.rows  
            }) 
        }
    })
});

//GENERALES
app.put('/update_estatura',(req,res)=>{
    con.query('UPDATE datos_medicos set estatura = $1 where datos_medicos.id = $2',[req.body[1],req.body[0]],(err,result)=>{
        if(err){
            return res.send(err);
        }else{
            console.log("Update ESTATURA: ",req.body[1])
        }
    });
});

app.put('/update_peso',(req,res)=>{
    con.query('UPDATE datos_medicos set peso = $1 where datos_medicos.id = $2',[req.body[1],req.body[0]],(err,result)=>{
        if(err){
            return res.send(err);
        }else{
            console.log("Update PESO: ",req.body[1])
        }
    });
});

app.put('/update_gs',(req,res)=>{
    con.query('UPDATE datos_medicos set g_sanguineo = $1 where datos_medicos.id = $2',[req.body[1],req.body[0]],(err,result)=>{
        if(err){
            return res.send(err);
        }else{
            console.log("Update GS: ",req.body[1])
        }
    });
});

app.get('/get_generales/:id',(req,res)=>{
    const {id} = req.params;
    con.query('SELECT datos_medicos.estatura, datos_medicos.peso, datos_medicos.g_sanguineo FROM datos_medicos WHERE datos_medicos.id = $1 ',[id],(err,result)=>{
        if(err){
            return res.send(err);
        }else{
            return res.json({data:result.rows});
        }
    })
});

app.get('/hay_generales/:rut',(req,res)=>{
    const {rut} = req.params;
    con.query('SELECT datos_medicos.id FROM datos_medicos,datos_paciente,usuario WHERE datos_medicos.id = datos_paciente.id_datos and datos_paciente.rut = usuario.rut and usuario.rut = $1',[rut],(err,result) =>{
        if(err){
            return res.send(err);
        }else{
            return res.json({
                data: result.rows  
            }) 
        }
    });
});
app.post('/post_generales',(req,res) =>{
    const {id, estatura, peso, g_sanguineo} = req.body;
    const values = [
        req.body[0].id,
        req.body[0].estatura,
        req.body[0].peso,
        req.body[0].g_sanguineo
    ]
    const result =  con.query('INSERT INTO datos_medicos values ($1,$2,$3,$4)', values);
    res.json({ message: 'Datos Guardados' });
});

app.post('/post_generales_data',(req,res) =>{
    const values = [
        req.body[0].id_datos,
        req.body[0].rut
    ]
    const result =  con.query('INSERT INTO datos_paciente values  ($1,$2)', values);
    res.json({ message: 'Datos Guardados' });
});

//claudio




var server = app.listen(8000, function () {
    console.log('Server is running..');
});
