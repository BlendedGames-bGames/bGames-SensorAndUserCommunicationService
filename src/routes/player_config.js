const express = require('express');
const player_config = express.Router();
const userHost = "bgames-UserManagementService:3010"
const cryptoRandomString = require('crypto-random-string');
var bodyParser =require('body-parser');
var jsonParser = bodyParser.json()
const axios = require('axios').default;

const wrap = fn => (...args) => fn(...args).catch(args[2])
/*
Input: Id of a player (range 0 to positive int)
Output: Name, password and age of that player
Description: Calls the b-Games-Configurationservice service to get the player's information
*/
player_config.get('/getPlayerConfig/:id', (req,res,next)=>{
    var post_data = req.body;
    const{id}= req.params;
    var options = {
        host : 'bgames-configurationservice.herokuapp.com',
        path: ('/players/'+id),
        method: 'GET'
      };
    common.getJson(options,function(err,result){
        if(err){
            console.log("No hay resultado");//ACA ESTA EL RESULTADO
            res.json("Error in user config: get");
        }
        else{
            console.log(result);//ACA ESTA EL RESULTADO
            res.json(result);
        }
    });

})
function createKey(){
    let key = cryptoRandomString({length:15})
    return key
}

player_config.get('/create_desktop_key/:id_player',jsonParser,  wrap(async(req,res,next)=>{
    var id_player = req.params.id_player;

    var path = '/create_desktop_key/'+id_player.toString()
    var url = "http://"+userHost + path;
    const MEDIUM_POST_URL = url;
    console.log('Forcing push')
    
    let key = createKey()
    console.log(key)
    const data = {
        "key": key
    }

    try {
        const response = await axios.post(MEDIUM_POST_URL,data)
        res.status(200).json(response)
        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores, intente nuevamente' })

    }
}))

player_config.post('/desktop_authentication_key',jsonParser,  wrap(async(req,res,next)=>{
    var email = req.body.email;
    var password = req.body.password;
    var desktop_key = req.body.key;
    var provider = req.body.provider;

    var path = '/create_desktop_key/'+id_player.toString()
    var url = "http://"+userHost + path;
    const MEDIUM_POST_URL = url;
    
    let key = createKey()
    console.log(key)
    const data = {
        "key": key
    }

    try {
        const response = await axios.post(MEDIUM_POST_URL,data)
        res.status(200).json(response.data)
        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores, intente nuevamente' })

    }
}))
/*
Input: Id of a player (range 0 to positive int)
Output: Void (Modifies the name, pass and age of a player)
Description: Calls the b-Games-Configurationservice service to edit the player's information
*/
//Faltan todos los verificadores de si cumple con los requerimientos o faltan datos!
player_config.put('/getPlayerConfig/edit/:id', (req,res,next)=>{
    //var headersIN = req.body;
    const headersIN = JSON.stringify(req.body);

    

    const {name,pass,age} = req.body;
    const{id}= req.params;
    console.log("cuanto es: "+headersIN);
    if ( !common.isNumber(Number(id)) || !common.isString(name) || !common.isString(pass) || !(common.isNumber(age))){
        console.log('This is not a player'+  typeof(Number(id)) + common.isString(name) + common.isString(pass) + common.isNumber(age));
        res.json("Error in user config: not user");
    }
    else{
        const data = JSON.stringify({
            name: name,
            pass:pass,
            age:age
          });
        console.log("cuanto es2: "+data);
        
        var options = {
            host : 'bgames-configurationservice.herokuapp.com',
            path: ('/players/'+id),
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
              }
        };
        common.getJsonSend(options,data,function(err,result){
            if(err){
                console.log("No hay resultado");//ACA ESTA EL RESULTADO
                res.json("Error in user config: get");
            }
            else{
                console.log(result);//ACA ESTA EL RESULTADO
                res.json(result);
            }
        });
    }

})



/*
Input: Nothing
Output: List of all the players of Blended Games
Description: Simple MYSQL query
*/
player_config.get('/players/',(req,res)=>{
    var aux = undefined;
    mysqlConnection.query('SELECT*FROM playerss',(err,rows,fields)=>{
        try{
            aux = JSON.parse(JSON.stringify(rows))[0]
        }catch{
            res.json("Error in parse Json, please retry");
        }
        if (undefined == aux){
            res.json("Error on obtain resume");
        }else{
            if(!err){
                res.json(rows);
            } else {
                console.log(err);
            }
        }
    })
})
player_config.get('/players/id',(req,res)=>{
    var aux = undefined;
    mysqlConnection.query('SELECT id_players FROM playerss',(err,rows,fields)=>{
        try{
            aux = JSON.parse(JSON.stringify(rows))[0]
        }catch{
            res.json("Error in parse Json, please retry");
        }
        if (undefined == aux){
            res.json("Error on obtain resume");
        }else{
            if(!err){
                res.json(rows);
            } else {
                console.log(err);
            }
        }
    })
})
/*
Input: Id of a player (range 0 to positive int)
Output: Name, pass and age of that player
Description: Simple MYSQL query
*/
player_config.get('/players/:id', (req,res) =>{
    const {id} = req.params;
    console.log("entro en el GET");
    var aux = undefined;
    mysqlConnection.query('SELECT*FROM playerss WHERE id_players = ?',[id],(err,rows,fields) =>{
        try{
            aux = JSON.parse(JSON.stringify(rows))[0]
        }catch{
            res.json("Error in parse Json, please retry");
        }
        if (undefined == aux){
            res.json("Error on GET player information.");
        }else{
            if(!err){
                console.log("Entro a Configuración");
                res.json(rows); 
            } else {
                console.log(err);
            }
        }
    })
})
/*
Input: Id of a player (range 0 to positive int)
Output: Void (authentication of the player in the system)
Description: Simple MYSQL query
*/
player_config.get('/player/:name/:pass', (req,res) =>{
    var aux = undefined;
    const name = req.params.name
    const pass = req.params.pass
    mysqlConnection.query('SELECT*FROM playerss WHERE name = ? AND password = ?',[name, pass],(err,rows,fields) =>{
        try{
            aux = JSON.parse(JSON.stringify(rows))[0]
        }catch{
            res.json("Error in parse Json, please retry");
        }
        if (undefined == aux){
            res.status(400).json("Error on GET player information.");
        }else{
            if(!err){
                console.log("Entro a Configuración");
                res.json(rows[0].id_players);
            } else {
                res.status(404).json("Player doesnt exist or incorrect password");
                console.log(err);
            }
        }
    })
    
})


// OPCIONES DE CONFIGURACION

// add or eddit player, hay que probarlo!!!!! parece que esta malo un Not o un True del 1er if
/*
Input: Name, pass and age of that player
Output: Void (Creates a new player with the input information)
Description: Simple MYSQL query
*/
player_config.post('/players/',(req,res)=>{
    const {name,pass,age} = req.body;
    console.log(req.body);
    const id = 0;
    const query = `
        SET @id = ?;
        SET @name = ?;
        SET @pass = ?;
        SET @age = ?;
        CALL playerAddOrEdit(@id,@name,@pass,@age);
    `;
    // Mirar este select!!!
    mysqlConnection.query('SELECT*FROM playerss WHERE id_players = ?',[id],(err,rows,fields)=>{
        console.log("El selec entrega: "+!err);
        if(!err){
            if(!!rows){
                mysqlConnection.query(query,[id,name,pass,age],(err,rows,fields) =>{
                    if(!err){
                        res.json({Status:'Player Saved'});
                    } else {
                        console.log(err);
                    }
                })
            }
        } else {
            console.log(err);
            res.json({Status:'ERROR: Player Saved'});
        }
    })
})

/*
Input: Name, pass and age of that player
Output: Void (Edits an existing player in the db)
Description: Simple MYSQL query
*/
//Con id en 0 se ingresa un nuevo jugador, con cualquier otro id se edita el existente
player_config.put('/players/:id',(req,res)=>{
    console.log("entro en el PUT");
    const {name,pass,age} = req.body;
    const {id} = req.params;
    //console.log("El selec entrega: "+JSON.parse(JSON.stringify(req.body))[0]);
    const query = `
            SET @id = ?;
            SET @name = ?;
            SET @pass = ?;
            SET @age = ?;
            CALL playerAddOrEdit(@id,@name,@pass,@age);
    `;
    mysqlConnection.query('SELECT*FROM playerss WHERE id_players = ?',[id],(err,rows,fields)=>{
        console.log("El selec entrega: "+rows);try{
            aux = JSON.parse(JSON.stringify(rows))[0]
        }catch{
            res.json("Error in parse Json, please retry");
        }
        if (undefined != aux){
            mysqlConnection.query(query,[id,name,pass,age],(err,rows,fields) =>{
                if(!err){
                    res.json({Status:'Player Update'});
                    console.log("Lo logró");
                } else {
                    res.json({Status:'ERROR: Player Update'});
                    console.log(err);
                }
            })
        }else{
            res.json({Status:'ERROR: Player not exists'});
        }
    })

})
/*
Input: Id of a player (range 0 to positive int)
Output: Void (Deletes the player of the database)
Description: Simple MYSQL query
*/
player_config.delete('/players/:id',(req,res)=>{
    const {id} = req.params;
    mysqlConnection.query('DELETE FROM playerss WHERE id_players =?',[id],(err,rows,fields)=>{
        if(!err){
            res.json({Status:'Player Deleted'});
        } else {
            console.log(err);
        }
    })
})

export default player_config;