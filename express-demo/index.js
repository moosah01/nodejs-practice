require("dotenv").config();

const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');

const config = require('config');
const Joi = require('joi');
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./middleware/logger');
const express = require('express');

const courseRouter = require('./routes/courses');

const app = express();

app.set('view engine', 'pug');
app.set('views', './views'); //default  

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(helmet());

// Routes
app.use('/api/courses', courseRouter);

//Configuration
console.log('Application Name: ' + config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));
 

if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    startupDebugger('Morgan enabled... => Development Environment');
}

app.use(logger);

const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`Listneing on port ${port}...`);
})