require("dotenv").config();
const express = require('express');
const app = express();

app.get('/', (req, res)=> {
    res.send('Hello World!!!');
});

app.get('/api/courses', (req, res)=> { 
    res.send([1, 2, 3]);
});

app.get('/api/posts/:year/:month', (req,res)=>{
    res.send(req.params);
});

// /api/posts/2018/1?sortBy=name => query string is stored in key value pairs
app.get('/api/posts/:year/:month', (req,res)=>{
    res.send(req.query);
});

const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`Listneing on port ${port}...`);
})