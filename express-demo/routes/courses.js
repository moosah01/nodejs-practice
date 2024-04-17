const express = require('express');
const router = express.Router()
const Joi = require('joi');


const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'}
]
router.get('/', (req, res)=> { 
    res.send(courses);
});

router.post('/', (req, res)=> {

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

router.put('/:id', (req,res)=>{
    const course = courses.find(c=> c.id === parseInt(req.params.id));
    if(!course){
        res.status(404).send('The course with the given ID was not found');
        return;
    }

    const {error} = validateCourse(req.body); // equivalent to result.error

    if(error){
        res.status(400).send(error.details[0].message);
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

router.delete('/:id', (req, res)=> {
    const course  = courses.find( c=> c.id === parseInt(req.params.id));
    if(!course) {
        res.status(404).send('The course with the given ID was not found');
        return;
    }
    const index = courses.indexOf(course);
    courses.splice(index, 1); //go to the index and remove 1 object
    res.send({
        message: 'Course deleted',
        course: course
    });

});

router.get('/:id', (req, res)=> { 
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
// router.get('/api/posts/:year/:month', (req,res)=>{
//     res.send({
//         year: req.params.year,
//         month: req.params.month,
//         query: req.query
//     });
// });

function validateCourse(course){
    const schema = Joi.object({
        name: Joi.string().min(5).required()
    });
    
    return schema.validate(course);
}

module.exports = router;