const express = require('express');
const app = express();
const msql = require("mysql");
const cors = require('cors');
const bodyParser = require('body-parser')

var nodemailer = require('nodemailer');

const Pool = require('pg');

const _ = require('lodash');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

var ttt = app.listen(8000)
const http = require('http');
const serverHttp = require('http').Server(app);
const io = require('socket.io')(serverHttp).listen(ttt);

    // config for your database
/*
const con = msql.createConnection({
        user: 'Nelsota',
        password: 'Comida123',
        server: 'sLs-Nelsota',
        database: 'atencionmedicaremota',
        insecureAuth : true,
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
  
app.use(expressJwt({secret: 'todo-app-super-shared-secret'}).unless({path: ['/auth','/authen','/newUsuario']}));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());
app.use(bodyParser.json());

//CHAT

io.on('connection',function(socket){
    //console.log(socket.id)

    socket.on('getHistorial',function(data){
        //se ejecuta cuando se selecciona un contacto
        //aca hacer la consulta
        var consulta = 'SELECT * from mensajes_vista where de_usuario = $1 and para_usuario = $2 UNION SELECT * from mensajes where de_usuario = $2 and para_usuario = $1 ORDER BY fecha'
        con.query(consulta,[data.paciente,data.medico],(err,result)=>{
           // console.log(result.rows)
            socket.emit('historial',result.rows)
        })        
    })
    socket.on('hablar',function(data){
        //se ejecuta cuando se selecciona el contacto
        //y se une el socket actual a la room especifica entre ambos (paciente-medico)
        socket.leaveAll(); //antes de unirse a la actual room, deja todas las anteriores     
        socket.join(data.paciente + data.medico)
        socket.emit('getRoom',data.paciente + data.medico)
        //console.log(data.paciente,"hablar entre ellos",data.medico)
    })
    socket.on('estado_llamada',function(data){
        io.sockets.in(data[0]).emit('estado-llamada',data[1])
    })
    socket.on('llamar',function(data){
        socket.in(data).broadcast.emit('llamando',data)
    })
    socket.on('terminar-llamada',function(data){
        io.sockets.in(data).emit('terminar_llamada')
    })
    socket.on('send-message',function(data){

       // console.log(data[0])
        io.sockets.in(data[1].paciente + data[1].medico).emit('text-event',data[0])
        //aca guardar mensaje que se mandó
       con.query('INSERT INTO mensajes (de_usuario,para_usuario,mensaje,fecha) values ($1,$2,$3,CURRENT_TIMESTAMP)',[data[0].from,data[0].to,data[0].text],(err,res)=>{})
    })

    
})

app.get('/get_contactos_medicos/:rut',(req,res)=>{
    const {rut} = req.params;
    con.query('SELECT nombres,especialidad,U.rut FROM usuario as U, especialista as E, pueden_hablar as PH WHERE U.rut = PH.rut_medico and E.rut = U.rut and PH.rut_paciente = $1',[rut],(err,result)=>{
        if(err){
        console.log("hay error en obtener los contactos del paciente");
        }else{
       
        return res.json({

            data: result.rows

        })
        }
    });
})
app.get('/get_contactos_pacientes/:rut',(req,res)=>{
    const {rut} = req.params;
    con.query(' SELECT nombres,apellidos,U.rut FROM usuario as U, pueden_hablar as PH WHERE U.rut = PH.rut_paciente and PH.rut_medico= $1 ',[rut],(err,result)=>{
        if(err){
        console.log("hay error");
        }else{
      //  console.log(result.rows);
        return res.json({

            data: result.rows

        })
        }
    });
})


//FIN CHAT


app.post('/auth', function(req, res) {
    const body = req.body;
    console.log(req.body.rut);
    console.log(req.body.pass);
    console.log(req.body.cargo);

    if(req.body.cargo=="Paciente"){
        const select_query=`SELECT COUNT(*) as total FROM usuario as u, paciente as p where u.rut='${req.body.rut}' and u.password='${req.body.pass}' and u.rut=p.rut;`
        con.query(select_query, (err, result) => {
        console.log("total: "+result.rows[0].total);
        if (err){
            return res.sendStatus(401);
        }else if(result.rows[0].total>0){
            console.log("Paciente");
            var cargo ="Paciente";
            var token = jwt.sign({userID: req.body.rut}, 'todo-app-super-shared-secret');
            res.send({token,cargo});
        }else{
            return res.sendStatus(401);
        }

     });
    }else if(req.body.cargo=="Especialista"){
        const select_query=`SELECT COUNT(*) as total FROM usuario as u, especialista as e where u.rut='${req.body.rut}' and u.password='${req.body.pass}' and u.rut=e.rut;`
        con.query(select_query, (err, result) => {
        console.log("total: "+result.rows[0].total);
        if (err){
            return res.sendStatus(401);
        }else if(result.rows[0].total>0){
            console.log("Especialista");
            var cargo ="Especialista";
            var token = jwt.sign({userID: req.body.rut}, 'todo-app-super-shared-secret');
            res.send({token,cargo});
        }else{
            return res.sendStatus(401);
        }

     });
    }else if(req.body.opcion=="verrut"){
        const select_query=`SELECT rut FROM usuario as u where u.rut='${req.body.rut}'`
        con.query(select_query,(err,result) => {
            if(err){
                return res.sendStatus(401);
            }else if(result.rows[0]){
                console.log(result);
                return res.send({});
            }else{
                return res.sendStatus(401);
            }
        })
    }
    
    
});


app.get('/perfilPaciente', (req, res) => {
    const  id=req.query.rut;
    console.log(id);
    const values = [id]
    const select_query=`select *, to_char(u.fechaderegistro, 'YYYY:MM:DD') as fecharegistro, to_char(u.fechaderegistro, 'HH24:MI:SS') as horaregistro from usuario as u, paciente as p where u.rut=p.rut and u.rut=$1;`
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


app.get('/especialistas', (req, res) => {
    console.log("holaaaaaaaaaaa")
       const select_query=`select u.nombres, u.apellidos, u.rut, e.especialidad, e.formacionacademica, e.experiencia, e.cantcitasrealizadas, e.horariodisponible, u.contacto from especialista as e, usuario as u where e.rut=u.rut;`
    con.query(select_query, (err, result) => {
        console.log(result);
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

    const select_query=`select * , to_char(u.fechaderegistro, 'YYYY:MM:DD') as fecharegistro, to_char(u.fechaderegistro, 'HH24:MI:SS') as horaregistro from especialista as e, usuario as u where e.rut =u.rut and e.rut='${id}'`
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

app.get('/verHorarios', (req, res) => {
    var id=req.query.rut;
    console.log(id);
    console.log("llegue")
    const select_query=`select *, to_char(c.fecha, 'DD-MM-YYYY') as fecha from citas_medicas as c where c.rut_medico ='${id}' order by c.fecha`
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



app.get('/borrarHora', (req, res) => {
    var fecha=req.query.fecha;
    var bloque=req.query.bloque;
    var rut_medico=req.query.rut_medico;
    var rut_paciente=req.query.rut_paciente;
    console.log(fecha,bloque,rut_medico,rut_paciente);
    console.log("llegue")
    if(bloque=='bloque 1'){
        con.query(`update citas_medicas set bloque_1='0000000-0' where rut_medico='${rut_medico}' and fecha='${fecha}'`,(err,result)=>{
            if(err){
                console.log(err);
                return res.sendStatus(401);
            }else{
                console.log("Se eliminó hora");
                return res.send(result);
            }
        });
        
    }else if(bloque=='bloque 2'){
        con.query(`update citas_medicas set bloque_2='0000000-0' where rut_medico='${rut_medico}' and fecha='${fecha}'`,(err,result)=>{
            if(err){
                console.log(err);
                return res.sendStatus(401);
            }else{
                console.log("Se eliminó hora");
                return res.send(result);
            }
        });
    }else if(bloque=='bloque 3'){
        con.query(`update citas_medicas set bloque_3='0000000-0' where rut_medico='${rut_medico}' and fecha='${fecha}'`,(err,result)=>{
            if(err){
                console.log(err);
                return res.sendStatus(401);
            }else{
                console.log("Se eliminó hora");
                return res.send(result);
            }
        });
    }else if(bloque=='bloque 4'){
        con.query(`update citas_medicas set bloque_4='0000000-0' where rut_medico='${rut_medico}' and fecha='${fecha}'`,(err,result)=>{
            if(err){
                console.log(err);
                return res.sendStatus(401);
            }else{
                console.log("Se eliminó hora");
                return res.send(result);
            }
        });
    }          
                
                
    
    
});
app.get('/agendarHora', (req, res) => {
    var fecha=req.query.fecha;
    var bloque=req.query.bloque;
    var rut_medico=req.query.rut_medico;
    var rut_paciente=req.query.rut_paciente;
    console.log(fecha,bloque,rut_medico,rut_paciente);
    console.log("llegue")

    const select_query=`select count(*) as total 
    from citas_medicas 
    where rut_medico='${rut_medico}' and (bloque_1='${rut_paciente}' or bloque_2='${rut_paciente}' or
    bloque_3='${rut_paciente}' or bloque_4='${rut_paciente}');`
    con.query(select_query, (err, result) => {
        if (err){
            return res.send(err)
        }else{
            if(result.rows[0].total>0){
                return res.sendStatus(401);
            }else{
                
                if(bloque=='bloque 1'){
                    con.query(`update citas_medicas set bloque_1='${rut_paciente}' where rut_medico='${rut_medico}' and fecha='${fecha}'`,(err,result)=>{
                        if(err){
                            console.log(err);
                            return res.sendStatus(401);
                        }else{
                            console.log("Se agendo hora");
                            return res.send(result);
                        }
                    });
                    
                }else if(bloque=='bloque 2'){
                    con.query(`update citas_medicas set bloque_2='${rut_paciente}' where rut_medico='${rut_medico}' and fecha='${fecha}'`,(err,result)=>{
                        if(err){
                            console.log(err);
                            return res.sendStatus(401);
                        }else{
                            console.log("Se agendo hora");
                            return res.send(result);
                        }
                    });
                }else if(bloque=='bloque 3'){
                    con.query(`update citas_medicas set bloque_3='${rut_paciente}' where rut_medico='${rut_medico}' and fecha='${fecha}'`,(err,result)=>{
                        if(err){
                            console.log(err);
                            return res.sendStatus(401);
                        }else{
                            console.log("Se agendo hora");
                            return res.send(result);
                        }
                    });
                }else if(bloque=='bloque 4'){
                    con.query(`update citas_medicas set bloque_4='${rut_paciente}' where rut_medico='${rut_medico}' and fecha='${fecha}'`,(err,result)=>{
                        if(err){
                            console.log(err);
                            return res.sendStatus(401);
                        }else{
                            console.log("Se agendo hora");
                            return res.send(result);
                        }
                    });
                }
                
            }
            
        }
    });
    
});

//Nelsota
var transporter = nodemailer.createTransport({
    service: 'smtp.gmail.com',
    host: 'smtp.gmail.com',
    auth: {
        user: 'atencionmedicaremotais2@gmail.com',
        pass: 'asd123,.'
    }
});
app.post('/authen', function(req, res) {
    const body = req.body;
    console.log(req.body.rut);
    console.log(req.body.opcion);
    if(req.body.opcion=="verrut"){
        const select_query=`SELECT rut FROM usuario as u where u.rut='${req.body.rut}'`
        con.query(select_query,(err,result) => {
            if(err){
                return res.sendStatus(401);
            }else if(result.rows[0]){
                console.log(result);
                return res.send({});
            }else{
                return res.sendStatus(401);
            }
        })
    }else{
        return res.sendStatus(401)
    }
    
    
});
app.post('/newUsuario',(req,res)=>{
    console.log(req.body.rut);
    if(req.body.tipocliente=="paciente"){
        con.query('INSERT INTO usuario (rut,nombres,apellidos,correo,contacto,password) values ($1,$2,$3,$4,$5,$6) ',[req.body.rut,req.body.nombres,req.body.apellidos,req.body.gmail,req.body.telefono,req.body.contrasena],(err,result)=>{
            if(err){
                console.log(err);
                return res.sendStatus(401);
            }
        });
        con.query('INSERT INTO paciente (rut) values ($1)', [req.body.rut],(err,result)=>{
            if(err){
                console.log(err);
                return res.sendStatus(401);
            }else{
                console.log("Se insertó paciente: ",req.body);
                return res.send(result);
            }
        });
    }else if(req.body.tipocliente=="especialista"){
        var mailOptions = {
            from: `atencionmedicaremotais2@gmail.com`, // sender address
            to: `atencionmedicaremotais2@gmail.com`, // list of receivers
            subject: `Solicitud de registro ${req.body.nombres} ${req.body.apellidos}`,
            text: `Rut: ${req.body.rut}\nNombres: ${req.body.nombres}\nApellidos: ${req.body.apellidos}\nEmail: ${req.body.gmail}\nTeléfono: ${req.body.telefono}\nContraseña: ${req.body.contrasena}`
        };
        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error);
                return res.send(err);
            }else{
                console.log('Message sent: ' + info.response);
                return res.send(true);
            }
        });

    }else{   
        return res.sendStatus(401);
    }
    
});

//claudio

//para buscar especialistas especificos por especialidad


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
    con.query(`SELECT cirugias.id,  to_char(cirugias.fecha, 'YYYY:MM:DD') as fecha,  cirugias.nombre FROM cirugias,datos_cirugias,paciente WHERE cirugias.id = datos_cirugias.id_cirugias and datos_cirugias.rut = paciente.rut and paciente.rut = $1`,[rut], (err,result) => {
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



//Rodrigo

app.get('/perfilEspecialista', (req, res) => {
    var id=req.param('rut');
    const select_query=`SELECT *,  to_char(u.fechaderegistro, 'YYYY:MM:DD') as fecharegistro, to_char(u.fechaderegistro, 'HH24:MI:SS') as horaregistro FROM especialista as e, usuario as u where e.rut=u.rut and e.rut='${id}';`
    con.query(select_query, (err, result) => {
     //console.log(result);
     if (err){
           return res.send(err)
        }else{
            return res.json({

                data: result.rows

            })
     }
    });
    
});

app.post('/updateDatosEspecialista', (req,res) =>{
    con.query('UPDATE especialista SET especialidad = $1, experiencia = $2, formacionacademica = $3, horariodisponible = $4 WHERE rut = $5;',
    [req.body[1][4],req.body[1][2],req.body[1][3],req.body[1][5],req.body[0]],(err,result)=>{
        if(err){
            return res.send(err);
        }
    });
    console.log(req.body);
    console.log(req.body[1][1]);
    con.query('UPDATE usuario SET nombres = $1, apellidos = $2,contacto = $3 WHERE rut = $4;',
    [req.body[1][0],req.body[1][6],req.body[1][1],req.body[0]],(err,result)=>{
        if(err){
            return res.send(err);
        }
    });
    
    console.log("updated");
});

app.get('/getPacientes', (req, res) => {
    var id=req.param('rut');
    const select_query=`SELECT * FROM citas as c,usuario as u WHERE c.rut_paciente = u.rut and c.rut_medico = '${id}';`
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

app.get('/getPaciente', (req, res) => {
    var id=req.param('rut');
    const select_query=`SELECT nombres, apellidos FROM usuario WHERE usuario.rut = '${id}';`
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

app.get('/getEspecialistas', (req, res) => {
    var id=req.param('rut');
    const select_query=`SELECT * FROM citas as c,usuario as u WHERE c.rut_medico = u.rut and c.rut_paciente = '${id}';`
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

app.post('/postTratamiento', (req,res) =>{
    con.query('UPDATE citas SET tratamiento = $1 WHERE rut_paciente = $2 and rut_medico = $3;',
    [req.body[0],req.body[1],req.body[2]],(err,result)=>{
        if(err){
            return res.send(err);
        }
    });
    console.log(req.body[0][0]);
    console.log(req.body[2]);
    console.log("updated");
});

app.post('/postDiagnostico', (req,res) =>{
    con.query('UPDATE citas SET diagnostico = $1 WHERE rut_paciente = $2 and rut_medico = $3;',
    [req.body[0],req.body[1],req.body[2]],(err,result)=>{
        if(err){
            return res.send(err);
        }
    });
    console.log(req.body[0][0]);
    console.log(req.body[2]);
    console.log("updated");
});

app.get('/getDiagnostico', (req, res) => {
    var id=req.param('rut');
    const select_query=`SELECT * FROM citas as c,usuario as u WHERE c.rut_paciente = '${id}' and c.rut_medico = u.rut;`
    con.query(select_query, (err, result) => {
        console.log(result.rows);
     if (err){
           return res.send(err)
        }else{
            return res.json({
                data: result.rows
            })
     }
    });

    
});

//Rodrigo




/*var server = app.listen(8000, function () {
    console.log('Server is running..');
});*/
