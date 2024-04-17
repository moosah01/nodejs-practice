require("dotenv").config();
const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
        {id: 1, name: 'course1'},
        {id: 2, name: 'course2'},
        {id: 3, name: 'course3'}
]

app.get('/', (req, res)=> {
    res.send('Hello World!!!');
});

app.get('/api/courses', (req, res)=> { 
    res.send(courses);
});

app.post('/api/courses', (req, res)=> {

    const schema = Joi.object({
        name: Joi.string().min(5).required()
    });
    
    const validationResult = schema.validate(req.body);
    // console.log(validationResult);

    // console.log("break => next thing is error")
    // console.log(validationResult.error)

    // console.log("break => next thing is details")
    // console.log(validationResult.error.details);



    if(validationResult.error){
        res.status(400).send(validationResult.error.details[0].message);
        return;
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course);
    res.send({
        message: 'Course created',
        course: course
    })
});

app.put('/api/courses/:id', (req,res)=>{
    const course = courses.find(c=> c.id === parseInt(req.params.id));
    if(!course){
        res.status(404).send('The course with the given ID was not found');
        return;
    }
    const schema = Joi.object({
        name: Joi.string().min(5).required()
    });

    const validationResult = schema.validate(req.body);
    if(validationResult.error){
        res.status(400).send(validationResult.error.details[0].message);
        return;
    }
    course.name = req.body.name;
    const {id, ...updatedCourse} = course;
    // res.send({
    //     message: 'Course updated',
    //     course: course
    // })
    res.send({
        message: 'Course updated',
        course: updatedCourse
    })
})

app.get('/api/courses/:id', (req, res)=> { 
    const course = courses.find(c=> c.id === parseInt(req.params.id));
    if(!course){
        res.status(404).send('The course with the given ID was not found');
    } else {
        res.send(course);
    }
});


// app.get('/api/posts/:year/:month', (req,res)=>{
//     res.send(req.params);
// });

// /api/posts/2018/1?sortBy=name => query string is stored in key value pairs
app.get('/api/posts/:year/:month', (req,res)=>{
    res.send({
        year: req.params.year,
        month: req.params.month,
        query: req.query
    });
});

const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`Listneing on port ${port}...`);
})