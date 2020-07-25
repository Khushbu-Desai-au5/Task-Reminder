const express = require('express')
const router = express.Router();
const Task = require('../Models/task')
const authenticate = require('./authentication')

//-------------------------------------Create task-------------------------------------------------------
router.post("/create", authenticate ,async (req, res) => {
    try {
        const { title, date, start_time, end_time, attendees, meeting_link, taskCompleted,timeZone } = req.body;
        console.log(timeZone)
        console.log(new Date(date))
        const taskCreate = await Task.create({
            title: title,
            date: date,
            start_time: start_time,
            end_time: end_time,
            attendees: attendees,
            meeting_link: meeting_link,
            taskCompleted: false,
            userEmail:req.body.username,
            timeZone:timeZone
        })
        res.status(201).send({ statusCode: "201", message: taskCreate })
    }
    catch (error) {
        //   console.log(error)
        res.status(400).send({ statusCode: "400", message: error })
    }
})

//------------------------------------get all tasks-------------------------------------------------------
router.get("/all/:date",authenticate, async (req, res) => {
    try {
        let date = req.params.date

        console.log(date)
       // console.log(new Date(date).toUTCString())
        console.log('username',req.body.username)
        const alltasks = await Task.findAll({ where: { date:date,userEmail:req.body.username } })
        res.status(200).send({ statusCode: "200", message: alltasks })
    }
    catch (error) {
        console.log('in all:',error)
        res.status(400).send({ statusCode: "400", message: error })
    }
})

//-------------------------------------update task-------------------------------------------------------
router.put("/update/:id",authenticate, async (req, res) => {
    try {
        const { body, params } = req;
        // console.log('body:' + body)
        // console.log('link:'+ body.meeting_link)
        const updatedTask = await Task.update(
            {
                title: body.title,
                start_time: body.start_time,
                end_time: body.end_time,
                attendees: body.attendees,
                meeting_link: body.meeting_link,
                taskCompleted: body.taskCompleted
            }, { where: { id: params.id,userEmail:req.body.username } })

        res.status(200).send({ statusCode: "200", message: updatedTask })
    }
    catch (error) {
        res.status(400).send({ statusCode: "400", message: error })
    }
})

//-------------------------------------delete task-------------------------------------------------------

router.delete("/delete/:id", authenticate,async (req, res) => {
    try {
        const { params } = req;
        const deleteTask = await Task.destroy(
            { where: { id: params.id,userEmail:req.body.username } })
        res.status(200).send({ statusCode: "200", message: deleteTask })
    }
    catch (error) {
        res.status(400).send({ statusCode: "400", message: error })
    }
})




module.exports = router