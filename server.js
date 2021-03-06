//heroku container:push web -a urbanio-travels
//heroku container:release web -a urbanio-travels

var express = require('express');
var bodyParser = require('body-parser');
const Travel = require('./travels');

var BASE_API_PATH = "/api/v1";
var app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("<html><body><h1>My server</h1></body></html>");
});


// POST crear viaje
app.post(BASE_API_PATH + "/travels", (req, res) => {
    console.log(Date() + " - POST /travels");
    var travel = req.body;
    Travel.create(travel, (err) => {
        if (err) {
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        } else {
            res.sendStatus(201);
        }
    });
});


// GET todos los viajes
app.get(BASE_API_PATH + "/travels", (req, res) => {
    console.log(Date() + " - GET /travels");
    Travel.find({}, (err, travels) => {
        if (err) {
            console.log(Date() + "-" + err);
            res.sendStatus(500);
        } else{
            console.log(req.query);
            res.send(travels)
        }
    });
});


// Busqueda de viajes a través de una variable ej /travels/find?CLAVE=VALOR
app.get(BASE_API_PATH + "/travels/find", (req, res) => {
    console.log(Date() + " - GET /travels");
    Travel.find(req.query, (err, travels) => {
        if (err) {
            console.log(Date() + "-" + err);
            res.sendStatus(500);
        } else{
            console.log(req.query);
            res.send(travels)
        }
    });
});


//PATCH modificar estado viaje ej /travels/1234567
app.patch(BASE_API_PATH+'/travels/:id', async (req, res) => {
    try{
        console.log(Date() + " - PATCH /travels");
        const updatedPost = await Travel.updateOne(
        {_id: req.params.id},
        {$set: {estado: req.body.estado}});
        res.json(updatedPost)
    }catch(err){
        console.log(Date() + "-" + err);
        res.sendStatus(500);
        }
});

//DELETE viaje por ID ej /travels/1234567
app.delete(BASE_API_PATH+'/travels/:id', async (req, res) => {
    try{
        console.log(Date() + " - DELETE /travels");
        const updatedPost = await Travel.deleteOne(
        {_id: req.params.id},
        {$set: {estado: req.body.estado}});
        res.sendStatus(200);
    }catch(err){
        console.log(Date() + "-" + err);
        res.sendStatus(500);
        }
});

// // GET viajes por ID
// app.get(BASE_API_PATH + "/travels/:id", (req, res) => {
//     console.log(Date() + " - GET /travels");
//     Travel.findById(req.params.id, (err, travels) => {
//         if (err) {
//             console.log(Date() + "-" + err);
//             res.sendStatus(500);
//         } else {
//             res.send(travels)
//         }
//     });
// });


module.exports = app;