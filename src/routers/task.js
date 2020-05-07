const express = require('express');
const Task = require('../models/task')
const router = new express.Router()
const auth = require('../middleware/auth')


router.post('/tasks', auth, async (req, res) => {
    try {
        const task = new Task({
            ...req.body, // es6 spread oprator copy all prorperty from body 
            owner: req.user._id
        })


        await task.save()
        res.status(201).send(task)

    } catch (e) {
        res.status(500).send(e)
    }


})

// GET /tasks?completed=true // fitreing
// GET/tasks?limit=10&skip=0  // pagination
// GET/tasks?sortBy=createdAt:desc // sorting 
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){

        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc'? -1 : 1
    }

    try {
        // const task = await Task.find({ owner: req.user._id })
      await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit: parseInt(req.query.limit), // connvert a string into integer
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()

        // if (!task) {
        //     res.status(400).send()
        // }
        res.status(200).send(req.user.tasks)
    } catch (e) {

        res.status(500).send()

    }

})


router.get('/tasks/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id

        const task = await Task.findOne({ _id, owner: req.user._id });
        if (!task) {
            res.status(400).send()
        }
        res.status(201).send(task);
    } catch (e) {
        res.status(500).send(e);

    }

})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowUpdates = ['description', 'completed']
    const isvalidators = updates.every((update) => allowUpdates.includes(update))

    if (!isvalidators) {
        res.status(400).send({ 'error': 'Invalid  updates' })
    }

    try {

        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        console.log(task ,'task');

        if (!task) {
            res.status(400).send()
        }

        updates.forEach((update) =>  task[update] = req.body[update])

        await task.save()
        res.send(task)
    } catch (e) {
        res.status(500).send(e);
    }

})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!task) {
            res.status(400).send()
        }
        res.send(task)

    } catch (e) {

        res.status(500).send()

    }



})


module.exports = router



