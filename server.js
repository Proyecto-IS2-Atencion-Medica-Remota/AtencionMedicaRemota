const express = require('express');
const app = express();
const msql = require("mysql");
const cors = require('cors');

const bodyParser = require('body-parser')


const _ = require('lodash');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

    // config for your database

const con = msql.createConnection({

        user: 'root',
        password: '',
        server: 'DESKTOP-LI1BLEM',
        database: 'atencionmedicaremota',
        insecureAuth : true
    });




con.connect(function (err) {

        if (err) console.log(err);
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
        console.log(result);
        if (err){
          	return res.send(err)
       	}else{
           	return res.json({

                   data: result

           	})
        }
   	});
});

app.get('/perfilPaciente', (req, res) => {
    console.log("llegueeeeeeeeeeeeeeeeeeeeeeeeee")
    var id=req.param('rut');
    console.log(id);

    const select_query=`select *, DATE_FORMAT(u.fechaderegistro, '%Y-%m-%d') as fecharegistro, DATE_FORMAT(u.fechaderegistro, '%H:%i') as horaregistro from usuario as u, paciente as p where u.rut=p.rut and u.rut=?;`
    con.query(select_query,id, (err, result) => {
     console.log(result);
     if (err){
           return res.send(err)
        }else{
            return res.json({

                data: result

            })
     }
    });
    
});


app.get('/verEspecialista', (req, res) => {
    var id=req.param('rut');
    console.log(id);

    const select_query=`select * ,DATE_FORMAT(u.fechaderegistro, '%Y-%m-%d') as fecharegistro, DATE_FORMAT(u.fechaderegistro, '%H:%i') as horaregistro from especialista as e, usuario as u where e.rut =u.rut and e.rut=?`
    con.query(select_query,id, (err, result) => {
     console.log(result);
     if (err){
           return res.send(err)
        }else{
            return res.json({

                data: result

            })
     }
    });
    
});


//claudio

app.post('/pfmedico',(req,res) => {
    console.log("??");
    console.log(req.body);
    const result =  con.query('INSERT INTO datos_medicos set ?', [req.body]);
    res.json({ message: 'Datos Guardados' });
});

app.get('/getuser/:rut',(req,res) => {
    const {rut} = req.params;
    con.query('SELECT * FROM usuario,paciente WHERE paciente.rut = ? and paciente.rut = usuario.rut ',rut,(err,result)=>{
        console.log(result);
        if (err){
            return res.send(err)
         }else{
             return res.json({

                 data: result

             })
      }

    });
});
//INTOLERANCIAS
app.get('/get_intolerancias/:rut',(req,res)=>{
    const {rut} = req.params;
    con.query('SELECT intolerancias.id,intolerancias.nombre FROM intolerancias,datos_intolerancias,paciente WHERE intolerancias.id = datos_intolerancias.id_intolerancias and datos_intolerancias.rut = paciente.rut and paciente.rut = ?',rut, (err,result) => {
        if(err){
            return res.send(err);
        }else{
            return res.json({
                data: result  
            }) 
        }
    })
});

app.get('/hay_intolerancias/:rut',(req,res)=>{
    const {rut} = req.params;
    con.query('SELECT intolerancias.id FROM intolerancias,datos_intolerancias,paciente WHERE intolerancias.id = datos_intolerancias.id_intolerancias and datos_intolerancias.rut = paciente.rut and paciente.rut = ?',rut, (err,result) => {
        if(err){
            return res.send(err);
        }else{
            return res.json({
                data: result  
            }) 
        }
    })
});

app.post('/post_intolerancias',(req,res)=>{
    con.query('INSERT INTO intolerancias set ?',[req.body]);
    res.json({message: "DATOS intolerancias guardados"});
});

app.post('/post_intolerancias_paciente',(req,res)=>{
    con.query('INSERT INTO datos_intolerancias set ?',[req.body]);
    res.json({message:"DATOS_intolerancias(tabla) SAVED"});
});

app.post('/newIntolerancia',(req,res)=>{
    console.log(req.body);
    con.query('INSERT INTO intolerancias (id,nombre) values (?,?) ',[req.body[1],req.body[2]],(err,result)=>{
        if(err){
            send(err);
        }
    });
    con.query('INSERT INTO datos_intolerancias (rut,id_intolerancias) values (?,?)', [req.body[0],req.body[1]],(err,result)=>{
        if(err){
            send(err);
        }else{
            return res.send("OK");
        }
    });
    
});

app.post('/deleteIntolerancia',(req,res) =>{
    con.query('DELETE FROM datos_intolerancias WHERE rut = ? and id_intolerancias = ?',[req.body[0],req.body[1]]);
    con.query('DELETE FROM intolerancias WHERE id = ?',[req.body[1]]);
    console.log(req.body[0],req.body[1]);
});

//ALERGIAS
app.post('/newAlergia',(req,res)=>{
    console.log(req.body);
    con.query('INSERT INTO alergias (id,nombre) values (?,?) ',[req.body[1],req.body[2]],(err,result)=>{
        if(err){
            send(err);
        }
    });
    con.query('INSERT INTO datos_alergias (rut,id_alergias) values (?,?)', [req.body[0],req.body[1]],(err,result)=>{
        if(err){
            send(err);
        }else{
            return res.send("OK");
        }
    });
    
});

app.post('/deleteAlergia',(req,res) =>{
    con.query('DELETE FROM datos_alergias WHERE rut = ? and id_alergias = ?',[req.body[0],req.body[1]]);
    con.query('DELETE FROM alergias WHERE id = ?',[req.body[1]]);
    console.log(req.body[0],req.body[1]);
});

app.get('/get_alergias/:rut',(req,res)=>{
    const {rut} = req.params;
    con.query('SELECT alergias.id, alergias.nombre FROM alergias,datos_alergias,paciente WHERE alergias.id = datos_alergias.id_alergias and datos_alergias.rut = paciente.rut and paciente.rut = ?',rut, (err,result) => {
        if(err){
            return res.send(err);
        }else{
            return res.json({
                data: result  
            }) 
        }
    })
});

app.get('/hay_alergias/:rut',(req,res)=>{
    const {rut} = req.params;
    con.query('SELECT alergias.id FROM alergias,datos_alergias,paciente WHERE alergias.id = datos_alergias.id_alergias and datos_alergias.rut = paciente.rut and paciente.rut = ?',rut, (err,result) => {
        if(err){
            return res.send(err);
        }else{
            return res.json({
                data: result  
            }) 
        }
    })
});

app.post('/post_alergias',(req,res)=>{
    con.query('INSERT INTO alergias set ?',[req.body]);
    res.json({message: "DATOS ALERGIAS guardados"});
});

app.post('/post_alergias_paciente',(req,res)=>{
    con.query('INSERT INTO datos_alergias set ?',[req.body]);
    res.json({message:"DATOS_ALERGIAS(tabla) SAVED"});
})
//DATOS CIRUGIAS

app.post('/newCirugia',(req,res)=>{
    console.log(req.body);
    con.query('INSERT INTO cirugias (id,fecha,nombre) values (?,?,?) ',[req.body[1],req.body[3],req.body[2]],(err,result)=>{
        if(err){
            send(err);
        }
    });
    con.query('INSERT INTO datos_cirugias (rut,id_cirugias) values (?,?)', [req.body[0],req.body[1]],(err,result)=>{
        if(err){
            send(err);
        }else{
            return res.send("OK");
        }
    });
    
});

app.post('/deleteCirugia',(req,res) =>{
    con.query('DELETE FROM datos_cirugias WHERE rut = ? and id_cirugias = ?',[req.body[0],req.body[1]]);
    con.query('DELETE FROM cirugias WHERE id = ?',[req.body[1]]);
    console.log(req.body[0],req.body[1]);
});

app.get('/get_cirugias/:rut',(req,res)=>{
    const {rut} = req.params;
    con.query('SELECT cirugias.id, DATE_FORMAT(cirugias.fecha,"%M %e %Y") as fecha, cirugias.nombre FROM cirugias,datos_cirugias,paciente WHERE cirugias.id = datos_cirugias.id_cirugias and datos_cirugias.rut = paciente.rut and paciente.rut = ?',rut, (err,result) => {
        if(err){
            return res.send(err);
        }else{
            console.log(result);
            return res.json({
                data: result  
            }) 
        }
    })
});

app.get('/hay_cirugias/:rut',(req,res)=>{
    const {rut} = req.params;
    con.query('SELECT cirugias.id FROM cirugias,datos_cirugias,paciente WHERE cirugias.id = datos_cirugias.id_cirugias and datos_cirugias.rut = paciente.rut and paciente.rut = ?',rut, (err,result) => {
        if(err){
            return res.send(err);
        }else{
            return res.json({
                data: result  
            }) 
        }
    })
});

app.post('/post_cirugias',(req,res)=>{
    con.query('INSERT INTO cirugias set ?',[req.body]);
    res.json({message: "DATOS CIRUGIAS guardados"});
});

app.post('/post_cirugias_paciente',(req,res)=>{
    con.query('INSERT INTO datos_cirugias set ?',[req.body]);
    res.json({message:"DATOS_cirugias(tabla) SAVED"});
});
//GENERALES
app.put('/update_estatura',(req,res)=>{
    con.query('UPDATE datos_medicos set estatura = ? where datos_medicos.id = ?',[req.body[1],req.body[0]],(err,result)=>{
        if(err){
            return res.send(err);
        }
    });
});

app.put('/update_peso',(req,res)=>{
    con.query('UPDATE datos_medicos set peso = ? where datos_medicos.id = ?',[req.body[1],req.body[0]],(err,result)=>{
        if(err){
            return res.send(err);
        }
    });
});

app.put('/update_gs',(req,res)=>{
    con.query('UPDATE datos_medicos set g_sanguineo = ? where datos_medicos.id = ?',[req.body[1],req.body[0]],(err,result)=>{
        if(err){
            return res.send(err);
        }
    });
});

app.get('/get_generales/:id',(req,res)=>{
    const {id} = req.params;
    console.log(id);
    con.query('SELECT datos_medicos.estatura, datos_medicos.peso, datos_medicos.g_sanguineo FROM datos_medicos WHERE datos_medicos.id = ? ',id,(err,result)=>{
        if(err){
            return res.send(err);
        }else{
            console.log(result);
            return res.json({data:result});
        }
    })
});

app.get('/hay_generales/:rut',(req,res)=>{
    const {rut} = req.params;
    con.query('SELECT datos_medicos.id FROM datos_medicos,datos_paciente,usuario WHERE datos_medicos.id = datos_paciente.id_datos and datos_paciente.rut = usuario.rut and usuario.rut = ?',rut,(err,result) =>{
        if(err){
            return res.send(err);
        }else{
            return res.json({
                data: result  
            }) 
        }
    });
});
app.post('/post_generales',(req,res) =>{
    console.log(req.body);
    const result =  con.query('INSERT INTO datos_medicos set ?', [req.body[0]]);
    res.json({ message: 'Datos Guardados' });
});

app.post('/post_generales_data',(req,res) =>{
    console.log(req.body);
    const result =  con.query('INSERT INTO datos_paciente set ?', [req.body[0]]);
    res.json({ message: 'Datos Guardados' });
});


app.put('/update_generales/:id');

app.get('/intolerancias',(req,res) => {
    const {rut} = req.params;
    con.query('SELECT * FROM intolerancias',(err,result)=>{
        console.log(result);
        if (err){
            return res.send(err)
         }else{
             return res.json({

                 data: result

             })
      }

    });
});


//claudio


//rodrigo

app.get('/perfilEspecialista', (req, res) => {
    var id=req.param('rut');
    const select_query=`SELECT * FROM especialista, usuario where especialista.rut=usuario.rut and especialista.rut=?;`
    con.query(select_query,id, (err, result) => {
     //console.log(result);
     if (err){
           return res.send(err)
        }else{
            return res.json({

                data: result

            })
     }
    });
    
});

app.post('/updateDatosEspecialista', (req,res) =>{
    con.query('UPDATE especialista SET especialidad = ?, experiencia = ?, formacionacademica = ?, horariodisponible = ? WHERE rut = ?;',
    [req.body[1][4],req.body[1][2],req.body[1][3],req.body[1][5],req.body[0]],(err,result)=>{
        if(err){
            return res.send(err);
        }
    });
    console.log(req.body);
    console.log(req.body[1][1]);
    con.query('UPDATE usuario SET nombres = ?, apellidos = ?,contacto = ? WHERE rut = ?;',
    [req.body[1][0],req.body[1][6],req.body[1][1],req.body[0]],(err,result)=>{
        if(err){
            return res.send(err);
        }
    });
    
    console.log("updated");
})





var server = app.listen(8000, function () {
    console.log('Server is running..');
});
