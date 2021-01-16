const express = require('express');
const router = express.Router();
const axios = require('axios').default;

var http = require('http');

const fetch = require('node-fetch');
var common = require('./extras');
const mysqlConnection = require('../database');

/* Ejemplo de Json del online sensor
    {
        "id_online_sensor": 2,
        "name": "Chess.com Public api",
        "description": "Public API of the chess website chess.com",
        "base_url": "https://api.chess.com/pub/",
        "intiated_date": "2019-05-16 13:17:17" //Cuando se creo
    }
*/
/* Ejemplo de Json del sensor_endpoint
    {
        "id_online_sensor": 2,
        "name": "Instagram",
        "description": "General instagram api",
        "base_url": "graph.instagram.com",
        "intiated_date": "2019-05-16 13:17:17" //Cuando se creo
    }
*/

/* 
CRUD de sensor_endpoints 
*/

/*
RETRIEVE ONLINE_SENSORS:

1) Obtener UN sensor_endpoint en particular relacionado a un player y online_sensor

2) Obtener TODOS los sensor_endpoint (activated y desactivated) relacionados a un player y online_sensor

3) Obtener TODOS los sensor_endpoint (activated) relacionados a un player y online_sensor

4) Obtener TODOS los sensor_endpoint (desactivated) relacionados a un player y online_sensor

5) Obtener TODOS los sensor_endpoint de un player en particular (activated y deactivated)(tomando en cuenta todos los online_sensor que tiene)

6) Obtener TODOS los sensor_endpoint de un player en particular (activated)(tomando en cuenta todos los online_sensor que tiene)

7) Obtener TODOS los sensor_endpoint de un player en particular (deactivated)(tomando en cuenta todos los online_sensor que tiene)

8) Obtener TODOS los sensor_endpoint relacionados a un online_sensor (activated y deactivated)(sin importar de que players son)

9) Obtener TODOS los sensor_endpoint relacionados a un online_sensor (activated )(sin importar de que players son)

10) Obtener TODOS los sensor_endpoint relacionados a un online_sensor (deactivated)(sin importar de que players son)

11) Obtener TODOS los sensor_endpoints (activated y deactivated) de TODOS los players

12) Obtener TODOS los sensor_endpoints (activated) de TODOS los players

13) Obtener TODOS los sensor_endpoints (deactivated) de TODOS los players

*/

/* WORKS 
SELECT DISTINCT
    `playerss`.`id_players`,
    `online_sensor`.`id_online_sensor`,
    `sensor_endpoint`.`id_sensor_endpoint`,
    `playerss_online_sensor`.`tokens`,
    `online_sensor`.`name`,
    `online_sensor`.`description`, 
    `online_sensor`.`base_url`,
    `online_sensor`.`initiated_date`,
    `online_sensor`.`last_modified`,
    `sensor_endpoint`.`name`,
    `sensor_endpoint`.`description`,
    `sensor_endpoint`.`url_endpoint`,
    `sensor_endpoint`.`token_parameters`,
    `sensor_endpoint`.`specific_parameters`,
    `sensor_endpoint`.`parameters_watched`,
    `sensor_endpoint`.`activated`,
    `sensor_endpoint`.`schedule_time`,
    `sensor_endpoint`.`initiated_date`,
    `sensor_endpoint`.`last_modified`

FROM
    `playerss`
JOIN `playerss_online_sensor` ON `playerss`.`id_players` = `playerss_online_sensor`.`id_players`
JOIN `online_sensor` ON `online_sensor`.`id_online_sensor` = `playerss_online_sensor`.`id_online_sensor`
JOIN `sensor_endpoint` ON `sensor_endpoint`.`sensor_endpoint_id_online_sensor` = `online_sensor`.`id_online_sensor`
WHERE
    `playerss`.`id_players` IN(1, 2, 3, 4, 5, 6)  
ORDER BY `playerss`.`id_players` ASC


*/
//1) Obtener UN sensor_endpoint en particular relacionado a un player y online_sensor

/*
SELECT 
    `playerss`.`id_players`,
    `online_sensor`.`id_online_sensor`,
    `sensor_endpoint`.`id_sensor_endpoint`,
    `playerss_online_sensor`.`tokens`,
    `online_sensor`.`name`,
    `online_sensor`.`description`,
    `online_sensor`.`base_url`,
    `online_sensor`.`initiated_date`,
    `online_sensor`.`last_modified`,
    `sensor_endpoint`.`name`,
    `sensor_endpoint`.`description`,
    `sensor_endpoint`.`url_endpoint`,
    `sensor_endpoint`.`token_parameters`,
    `sensor_endpoint`.`specific_parameters`,
    `sensor_endpoint`.`parameters_watched`,
    `sensor_endpoint`.`activated`,
    `sensor_endpoint`.`schedule_time`,
    `sensor_endpoint`.`initiated_date`,
    `sensor_endpoint`.`last_modified`
FROM
    `playerss`
JOIN `playerss_online_sensor` ON `playerss`.`id_players` = `playerss_online_sensor`.`id_players`
JOIN `online_sensor` ON `online_sensor`.`id_online_sensor` = `playerss_online_sensor`.`id_online_sensor`
JOIN `sensor_endpoint` ON `sensor_endpoint`.`sensor_endpoint_id_online_sensor` = `online_sensor`.`id_online_sensor`
WHERE
     `playerss`.`id_players` = 1 AND `sensor_endpoint`.`sensor_endpoint_id_online_sensor` = 1  AND `sensor_endpoint`.`id_players` = 1 AND `sensor_endpoint`.`url_endpoint` = "player/{username}/stats"

*/
//1) Obtener UN sensor_endpoint en particular relacionado a un player y online_sensor

//WORKS
router.get('/sensor_endpoint/:id_player/:id_online_sensor/:id_sensor_endpoint',(req,res,next)=>{
    var id_player = req.params.id_player;
    var id_online_sensor = req.params.id_online_sensor;
    var id_sensor_endpoint = req.params.id_sensor_endpoint;

    var options = {
        host : 'bgames-sensormanagement.herokuapp.com',
        path: ('/sensor_endpoint/'+id_player.toString()+'/'+id_online_sensor.toString+'/'+id_sensor_endpoint.toString())       
    };
    var url = "https://"+options.host + options.path;
    const MEDIUM_GET_URL = url;
    
    var headers = {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
    };

    try {
        const response = await axios.get(MEDIUM_GET_URL,{ headers:headers})
        res.status(200).json({ response: response.data })
        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores, intente nuevamente' })

    }

})

//2) Obtener TODOS los sensor_endpoint (activated y desactivated) relacionados a un player y online_sensor
//WORKS
router.get('/sensor_endpoints/:id_player/:id_online_sensor',(req,res,next)=>{
    var id_player = req.params.id_player;
    var id_online_sensor = req.params.id_online_sensor;

    var options = {
        host : 'bgames-sensormanagement.herokuapp.com',
        path: ('/sensor_endpoint/'+id_player.toString()+'/'+id_online_sensor.toString())       
    };
    var url = "https://"+options.host + options.path;
    const MEDIUM_GET_URL = url;
    
    var headers = {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
    };

    try {
        const response = await axios.get(MEDIUM_GET_URL,{ headers:headers})
        res.status(200).json({ response: response.data })
        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores, intente nuevamente' })

    }
})

//3) Obtener TODOS los sensor_endpoint (activated) relacionados a un player y online_sensor
//WORKS

router.get('/sensor_endpoints_activated/:id_player/:id_online_sensor',(req,res,next)=>{
    var id_player = req.params.id_player;
    var id_online_sensor = req.params.id_online_sensor;

    var options = {
        host : 'bgames-sensormanagement.herokuapp.com',
        path: ('/sensor_endpoints_activated/'+id_player.toString()+'/'+id_online_sensor.toString())       
    };
    var url = "https://"+options.host + options.path;
    const MEDIUM_GET_URL = url;
    
    var headers = {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
    };

    try {
        const response = await axios.get(MEDIUM_GET_URL,{ headers:headers})
        res.status(200).json({ response: response.data })
        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores, intente nuevamente' })

    }
})

//4) Obtener TODOS los sensor_endpoint (desactivated) relacionados a un player y online_sensor
//WORKS

router.get('/sensor_endpoints_deactivated/:id_player/:id_online_sensor',(req,res,next)=>{
    var id_player = req.params.id_player;
    var id_online_sensor = req.params.id_online_sensor;

    
    var options = {
        host : 'bgames-sensormanagement.herokuapp.com',
        path: ('/sensor_endpoints_deactivated/'+id_player.toString()+'/'+id_online_sensor.toString())       
    };
    var url = "https://"+options.host + options.path;
    const MEDIUM_GET_URL = url;
    
    var headers = {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
    };

    try {
        const response = await axios.get(MEDIUM_GET_URL,{ headers:headers})
        res.status(200).json({ response: response.data })
        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores, intente nuevamente' })

    }
})

//5) Obtener TODOS los sensor_endpoint de un player en particular (activated y deactivated)(tomando en cuenta todos los online_sensor que tiene)

//WORKS

router.get('/sensor_endpoints/:id_player',(req,res,next)=>{
    var id_player = req.params.id_player;
    var options = {
        host : 'bgames-sensormanagement.herokuapp.com',
        path: ('/sensor_endpoints/'+id_player.toString())       
    };
    var url = "https://"+options.host + options.path;
    const MEDIUM_GET_URL = url;
    
    var headers = {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
    };

    try {
        const response = await axios.get(MEDIUM_GET_URL,{ headers:headers})
        res.status(200).json({ response: response.data })
        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores, intente nuevamente' })

    }
})
//6) Obtener TODOS los sensor_endpoint de un player en particular (activated)(tomando en cuenta todos los online_sensor que tiene)

//WORKS
router.get('/sensor_endpoints_activated/:id_player',(req,res,next)=>{
    var id_player = req.params.id_player;

    var options = {
        host : 'bgames-sensormanagement.herokuapp.com',
        path: ('/sensor_endpoints_activated/'+id_player.toString())       
    };
    var url = "https://"+options.host + options.path;
    const MEDIUM_GET_URL = url;
    
    var headers = {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
    };

    try {
        const response = await axios.get(MEDIUM_GET_URL,{ headers:headers})
        res.status(200).json({ response: response.data })
        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores, intente nuevamente' })

    }
})
//7) Obtener TODOS los sensor_endpoint de un player en particular (deactivated)(tomando en cuenta todos los online_sensor que tiene)

//WORKS
router.get('/sensor_endpoints_deactivated/:id_player',(req,res,next)=>{
    var id_player = req.params.id_player;
    var options = {
        host : 'bgames-sensormanagement.herokuapp.com',
        path: ('/sensor_endpoints_deactivated/'+id_player.toString())       
    };
    var url = "https://"+options.host + options.path;
    const MEDIUM_GET_URL = url;
    
    var headers = {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
    };

    try {
        const response = await axios.get(MEDIUM_GET_URL,{ headers:headers})
        res.status(200).json({ response: response.data })
        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores, intente nuevamente' })

    }
})

//8) Obtener TODOS los sensor_endpoint relacionados a un online_sensor (activated y deactivated)(sin importar de que players son)
//WORKS
router.get('/online_sensor/:id_online_sensor/sensor_endpoints',(req,res,next)=>{
    var id_online_sensor = req.params.id_online_sensor;

    var options = {
        host : 'bgames-sensormanagement.herokuapp.com',
        path: ('/online_sensor/'+id_online_sensor.toString()+'/sensor_endpoints')       
    };
    var url = "https://"+options.host + options.path;
    const MEDIUM_GET_URL = url;
    
    var headers = {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
    };

    try {
        const response = await axios.get(MEDIUM_GET_URL,{ headers:headers})
        res.status(200).json({ response: response.data })
        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores, intente nuevamente' })

    }
})
//9) Obtener TODOS los sensor_endpoint relacionados a un online_sensor (activated)(sin importar de que players son)
//WORKS
router.get('/online_sensor/:id_online_sensor/sensor_endpoints_activated',(req,res,next)=>{
    var id_online_sensor = req.params.id_online_sensor;

    
    var options = {
        host : 'bgames-sensormanagement.herokuapp.com',
        path: ('/online_sensor/'+id_online_sensor.toString()+'/sensor_endpoints_activated')       
    };
    var url = "https://"+options.host + options.path;
    const MEDIUM_GET_URL = url;
    
    var headers = {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
    };

    try {
        const response = await axios.get(MEDIUM_GET_URL,{ headers:headers})
        res.status(200).json({ response: response.data })
        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores, intente nuevamente' })

    }
})
//10) Obtener TODOS los sensor_endpoint relacionados a un online_sensor (deactivated)(sin importar de que players son)
//WORKS
router.get('/online_sensor/:id_online_sensor/sensor_endpoints_deactivated',(req,res,next)=>{
    var id_online_sensor = req.params.id_online_sensor;

   
    var options = {
        host : 'bgames-sensormanagement.herokuapp.com',
        path: ('/online_sensor/'+id_online_sensor.toString()+'/sensor_endpoints_deactivated')       
    };
    var url = "https://"+options.host + options.path;
    const MEDIUM_GET_URL = url;
    
    var headers = {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
    };

    try {
        const response = await axios.get(MEDIUM_GET_URL,{ headers:headers})
        res.status(200).json({ response: response.data })
        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores, intente nuevamente' })

    }
})

//11) Obtener TODOS los sensor_endpoints (activated y deactivated) de TODOS los players
/* WORKS */

router.get('/sensor_endpoints',(req,res,next)=>{
  
   
    var options = {
        host : 'bgames-sensormanagement.herokuapp.com',
        path: ('/sensor_endpoints')       
    };
    var url = "https://"+options.host + options.path;
    const MEDIUM_GET_URL = url;
    
    var headers = {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
    };

    try {
        const response = await axios.get(MEDIUM_GET_URL,{ headers:headers})
        res.status(200).json({ response: response.data })
        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores, intente nuevamente' })

    }
})

//12) Obtener TODOS los sensor_endpoints (activated) de TODOS los players
/* WORKS */

router.get('/sensor_endpoints_activated',(req,res,next)=>{
    var options = {
        host : 'bgames-sensormanagement.herokuapp.com',
        path: ('/sensor_endpoints_activated')       
    };
    var url = "https://"+options.host + options.path;
    const MEDIUM_GET_URL = url;
    
    var headers = {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
    };

    try {
        const response = await axios.get(MEDIUM_GET_URL,{ headers:headers})
        res.status(200).json({ response: response.data })
        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores, intente nuevamente' })

    }
})


//13) Obtener TODOS los sensor_endpoints (deactivated) de TODOS los players
/* WORKS */


router.get('/sensor_endpoints_deactivated',(req,res,next)=>{
    var options = {
        host : 'bgames-sensormanagement.herokuapp.com',
        path: ('/sensor_endpoints_deactivated')       
    };
    var url = "https://"+options.host + options.path;
    const MEDIUM_GET_URL = url;
    
    var headers = {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
    };

    try {
        const response = await axios.get(MEDIUM_GET_URL,{ headers:headers})
        res.status(200).json({ response: response.data })
        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores, intente nuevamente' })

    }
})


/*
CREATE ENDPOINTS:


1) Crear un sensor_endpoint asociado a un jugador y online_sensor 
    `sensor_endpoint`.`name`,
    `sensor_endpoint`.`description`,
    `sensor_endpoint`.`url_endpoint`,
    `sensor_endpoint`.`token_parameters`,
    `sensor_endpoint`.`specific_parameters`,
    `sensor_endpoint`.`parameters_watched`,
    `sensor_endpoint`.`activated`,
    `sensor_endpoint`.`schedule_time` 

*/

//1)Crea asociacion de un jugador a un sensor_endpoint en especifico

router.post('/sensor_endpoint/:id_player/:id_sensor_endpoint',(req,res,next)=>{
    var id_player = req.params.id_player;
    var id_sensor_endpoint = req.params.id_sensor_endpoint;
    var sensor_endpoint_data = req.body

    var options = {
        host : 'bgames-sensormanagement.herokuapp.com',
        path: ('/sensor_endpoint/'+id_player.toString()+'/'+id_sensor_endpoint.toString())       
    };
    var url = "https://"+options.host + options.path;
    console.log("URL "+url);
    // construct the URL to post to a publication
    const MEDIUM_POST_URL = url;
    try {
       
        const response = await axios.post(MEDIUM_POST_URL, sensor_endpoint_data);
        res.status(200).json({ response: response.data })
        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores y usuarios, intente nuevamente' })

    } 
})

//2)Crea un sensor_endpoint template 

router.post('/sensor_endpoint/:id_online_sensor',(req,res,next)=>{
    var id_online_sensor = req.params.id_online_sensor;

    var sensor_endpoint_data = req.body
    var options = {
        host : 'bgames-sensormanagement.herokuapp.com',
        path: ('/sensor_endpoint/'+id_online_sensor.toString())       
    };
    var url = "https://"+options.host + options.path;
    console.log("URL "+url);
    // construct the URL to post to a publication
    const MEDIUM_POST_URL = url;
    try {
       
        const response = await axios.post(MEDIUM_POST_URL, sensor_endpoint_data);
        res.status(200).json({ response: response.data })
        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores y usuarios, intente nuevamente' })

    } 
})
/*
UPDATE ENDPOINTS:

1) Modificar la info del sensor endpoint asociado a un player y un online_sensor

    `sensor_endpoint`.`name`,
    `sensor_endpoint`.`description`,
    `sensor_endpoint`.`url_endpoint`,
    `sensor_endpoint`.`token_parameters`,
    `sensor_endpoint`.`specific_parameters`,
    `sensor_endpoint`.`parameters_watched`,
    `sensor_endpoint`.`activated`,
    `sensor_endpoint`.`schedule_time` 

*/
//1) Modificar la info del sensor endpoint asociado a un player

router.put('/sensor_endpoint/:id_players/:id_sensor_endpoint',(req,res,next)=>{
    var id_players = req.params.id_players
    var id_sensor_endpoint = req.params.id_sensor_endpoint

    var sensor_endpoint_data = req.body

    var options = {
        host : 'bgames-sensormanagement.herokuapp.com',
        path: ('/sensor_endpoint/'+id_players.toString()+'/id_sensor_endpoint/'+id_sensor_endpoint.toString())       
    };
    var url = "https://"+options.host + options.path;
    console.log("URL "+url);
    // construct the URL to post to a publication
    const MEDIUM_PUT_URL = url;
    try {
        const response = axios.put(MEDIUM_PUT_URL,sensor_endpoint_data);
        console.log(response)
        res.status(200).json({response: response.data })

        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores y usuarios, intente nuevamente' })

    } 

})
//2) Modificar la info del sensor endpoint template 

router.put('/sensor_endpoint/:id_online_sensor/:id_sensor_endpoint',(req,res,next)=>{
    var id_online_sensor = req.params.id_online_sensor
    var id_sensor_endpoint = req.params.id_sensor_endpoint

    var sensor_endpoint_data = req.body

    var options = {
        host : 'bgames-sensormanagement.herokuapp.com',
        path: ('/sensor_endpoint/'+id_online_sensor.toString()+'/'+id_sensor_endpoint.toString())       
    };
    var url = "https://"+options.host + options.path;
    console.log("URL "+url);
    // construct the URL to post to a publication
    const MEDIUM_PUT_URL = url;
    try {
        const response = axios.put(MEDIUM_PUT_URL,sensor_endpoint_data);
        console.log(response)
        res.status(200).json({response: response.data })

        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores y usuarios, intente nuevamente' })

    } 
})
/*
DELETE ENDPOINTS:

1) Borrar el sensor_endpoint template
Causa: No existen repercusiones a otras tablas actualmente
*/

router.delete('/sensor_endpoint/:id_sensor_endpoint',(req,res,next)=>{

    var id_sensor_endpoint = req.params.id_sensor_endpoint


    var options = {
        host : 'bgames-sensormanagement.herokuapp.com',
        path: ('/sensor_endpoint/'+id_sensor_endpoint.toString())       
    };
    var url = "https://"+options.host + options.path;
    console.log("URL "+url);
    // construct the URL to post to a publication
    const MEDIUM_PUT_URL = url;
    try {
        const response = axios.delete(MEDIUM_PUT_URL);
        console.log(response)
        res.status(200).json({response: response.data })

        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores y usuarios, intente nuevamente' })

    } 
})
/*
2) Borrar la relacion entre jugador y sensor_endpoint (players_sensor_endpoint)
Causa: No existen repercusiones a otras tablas actualmente
*/

router.delete('/sensor_endpoint/:id_players/:id_sensor_endpoint',(req,res,next)=>{
    var id_players = req.params.id_players

    var id_sensor_endpoint = req.params.id_sensor_endpoint

    var options = {
        host : 'bgames-sensormanagement.herokuapp.com',
        path: ('/sensor_endpoint/'+id_players.toString()+'/'+id_sensor_endpoint.toString())       
    };
    var url = "https://"+options.host + options.path;
    console.log("URL "+url);
    // construct the URL to post to a publication
    const MEDIUM_PUT_URL = url;
    try {
        const response = axios.delete(MEDIUM_PUT_URL);
        console.log(response)
        res.status(200).json({response: response.data })

        
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'No responde el servicio de administracion de sensores y usuarios, intente nuevamente' })

    } 
})





module.exports = router;
