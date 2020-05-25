const express = require('express')
const router = express.Router();
const Task = require('../Models/task')


//-------------------------------------Create task-------------------------------------------------------
router.post("/create", async (req, res) => {
    try {
        const { title, date, start_time, end_time, attendees, meeting_link, taskCompleted } = req.body;
        let newDate = new Date(date).toISOString()
       // console.log(newDate)
        const taskCreate = await Task.create({
            title: title,
            date: newDate,
            start_time: start_time,
            end_time: end_time,
            attendees: attendees,
            meeting_link: meeting_link,
            taskCompleted: false

        })
        res.status(201).send({ statusCode: "201", message: taskCreate })
    }
    catch (error) {
     //   console.log(error)
        res.status(400).send({ statusCode: "400", message: error })
    }
})

//------------------------------------get all tasks-------------------------------------------------------
router.get("/all/:date", async (req, res) => {
    try {
        const alltasks = await Task.findAll({ where: { date: req.params.date } })
        res.status(200).send({ statusCode: "200", message: alltasks })
    }
    catch (error) {
        res.status(400).send({ statusCode: "400", message: error })
    }
})

//-------------------------------------update task-------------------------------------------------------
router.put("/update/:id", async (req, res) => {
    try {
        const { body, params } = req;
       // console.log('body:' + body)
       // console.log('link:'+ body.meeting_link)
        const updatedTask = await Task.update(
            {
                title: body.title,
                date: body.date,
                start_time: body.start_time,
                end_time: body.end_time,
                attendees: body.attendees,
                meeting_link: body.meeting_link,
                taskCompleted: body.taskCompleted
            }, { where: { id: params.id } })

        res.status(200).send({ statusCode: "200", message: updatedTask })
    }
    catch (error) {
        res.status(400).send({ statusCode: "400", message: error })
    }
})

//-------------------------------------delete task-------------------------------------------------------

router.delete("/delete/:id", async (req, res) => {
    try {
        const { params } = req;
        const deleteTask = await Task.destroy(
            { where: { id: params.id } })
        res.status(200).send({ statusCode: "200", message: deleteTask })
    }
    catch (error) {
        res.status(400).send({ statusCode: "400", message: error })
    }
})




module.exports = router