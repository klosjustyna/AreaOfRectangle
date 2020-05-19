const keys = require('./keys');

const express = require('express');

const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

const redis = require('redis');
const client = redis.createClient(
    keys.redisPort,
    keys.redisHost
);


const { Pool } = require('pg');
const pgClient = new Pool({
     user: keys.pgUser,
     host: keys.pgHost,
     database: keys.pgDatabase,
     password: keys.pgPassword,
     port: keys.pgPort,    
 });

  pgClient.on('error', () => {
      console.log('Error pg');
  });

 pgClient.query('CREATE TABLE IF NOT EXISTS areaResults (area INT)')
     .catch((err) => {
         console.log(err);
     });
 

app.get('/',(req, resp) => {
    console.log(req); 
    resp.send('hello  from backend')
});

app.get('/results', (req, resp) => {
    pgClient
    .query("SELECT DISTINCT * FROM areaResults")
    .then(data => { resp.send(data.rows)});
});

app.post('/api', (req, resp) => {
   
    const param1 = parseInt(req.body.param1) || 0;
    const param2 = parseInt(req.body.param2) || 0;

    const redisKey = `${param1}:${param2}`; 

    client.get(redisKey,  async (err, redisVal) => {
        if(redisVal == null) redisVal = areaRectangle(param1, param2);

        pgClient
        .query(
        "INSERT INTO areaResults (area) VALUES ($1)",
        [parseInt(redisVal)])
        .catch(err => console.log(err));
       
        resp.send({
                "x": param1,
                "y": param2,
                "out": redisVal});
        client.set(redisKey, parseInt(redisVal));
    });
});


app.listen(4000, () => {
    console.log('Server from base app is in 4000');
});

function areaRectangle(n, g){
    return n*g;
}

