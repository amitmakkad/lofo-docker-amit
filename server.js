const express = require('express');
const mongoose = require('mongoose');
const url = require('url');
const path = require('path')
const app = express();
require('dotenv').config()

// const clientdir = url.fileURLToPath(new URL('.', 'client'))
app.use(express.static(path.join('.','client','build')))

//Connection to Database
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("mongoDB connected...");
    })
    .catch((err) => {
        console.log("Failed to connect to mongoDB...")
        console.log(err.message);
    });

    
//bodyParser middleware 
app.use(express.json());



//CORS
app.use(require('cors')())

//API
app.get('/', (req, res) => res.send("Welcome to the lofo server!"));
app.use('/api', require('./API/api'));

app.use((req, res, next) => {
    // res.sendFile(path.join('.', 'client', 'build', 'index.html'))
    res.sendFile('client/build/index.html',{root : '.'});
})

//Error middleWare
app.use((err, req, res, next) => {
    console.log(err.message);
    res.status(500).send("Something went wrong...");
})

//Listening to requests
const port = process.env.PORT || 5000;
var server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
const io = require('./config/socket').init(server);
io.on('connection', function (socket) {
    socket.on('join', function (email) {
        socket.join(email);
    });
})