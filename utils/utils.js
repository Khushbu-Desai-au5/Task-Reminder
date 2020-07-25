const crypto = require('crypto');
const Task = require('../Models/task')
module.exports.JWTKEY = "calendarAppJWTKey"
module.exports.JWTEXPTIMEINSECONDS = 60 * 60 *24   //1 day
const nodemailer = require("nodemailer");
const { Op } = require('sequelize')

module.exports.encryptPassword = (password) =>{
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = crypto.pbkdf2Sync(password,salt, 10000, 512, 'sha512').toString('hex');
    return {salt,passwordHash}
}

module.exports.validatePassword = function(currentPassword,salt,passwordHash) {
    const hash = crypto.pbkdf2Sync(currentPassword, salt, 10000, 512, 'sha512').toString('hex');
    return passwordHash === hash;
  };


  getLocalTime = (utcTime,offset,minOffset) =>{

    const utcHour = utcTime.split(':')[0] 
    const utcMinute = utcTime.split(':')[1]
    const localTimeStr = new Date().setUTCHours(utcHour,utcMinute) 
    const localMinutes = new Date(localTimeStr).getUTCMinutes() - minOffset
    console.log('localMinutes',localMinutes)

    const localhours = new Date(localTimeStr).getUTCHours() - offset
    console.log('localHours',localhours)
    let time = new Date(new Date().setUTCHours(localhours,localMinutes,'00'))
    time =  addZeroBefore(time.getUTCHours()) + ':'+ addZeroBefore(time.getUTCMinutes())
    console.log(time)
    return time
}

addZeroBefore = (n) =>{
        return (n < 10 ? '0' : '') + n;
}
module.exports.sendReminder = async () =>{
    let now = new Date()
    let current = new Date(new Date().getTime() + 15 * 60 * 1000 )
    const currentTime = current.getHours() + ':' + current.getMinutes() + ':' + '00'
    try{
         const alltasks = await Task.findAll({ where:{
             date:{
                 [Op.eq]:now
             },
            start_time:{
                [Op.eq]:currentTime
            },taskCompleted:false } 
         })

         if(alltasks){
            alltasks.map( async task =>{
                console.log('task',task.dataValues)
                const email = task.userEmail
                const title = task.title
                const date = task.date
                const endTime= task.end_time
                const startTime = task.start_time
                const attendees = task.attendees
                const meetingLink = task.meeting_link
                const offset = parseInt(parseInt(task.timeZone) / 60)
                const minOffset = parseInt(task.timeZone) % 60 
                const localStartTime = getLocalTime(startTime,offset,minOffset)
                const localEndTime = getLocalTime(endTime,offset,minOffset)

                const mailOptions = {
                    to: email,
                    from: process.env.FROM_EMAIL,
                    subject: "Task Reminder: " + title,
                    text: `Hello,\n\n' 
                     This is a gentle Reminder for your today's task. Below are the task details:\n
                     Title       : ${title}\n
                     Date        : ${date}\n
                     Start Time  : ${localStartTime}\n
                     End TIme    : ${localEndTime}\n
                     Attnedees   : ${attendees}\n
                     Meeting Link: ${meetingLink}\n`
                    };

                    const smtpTransport =  nodemailer.createTransport({
                        service:process.env.SERVICE || 'Gmail',
                        auth:{
                            user: process.env.EMAIL_USERNAME,
                            pass:process.env.EMAIL_PASSOWRD
                        }
                   })

                   try{
                    const info = await smtpTransport.sendMail(mailOptions)
                    console.log('Successfully send mail',info)
                    
                 }catch(err){
                        console.log('Error in sending mail',err)
                    }

            }) 

         }
    }catch(err){
        console.log(err)
    }
}