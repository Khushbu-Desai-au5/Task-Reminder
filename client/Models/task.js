const db = require('../database')
const sequelize = require('sequelize')
const moment = require('moment')
const {Users} = require('./users')
let Task = db.define('task', {
    title: {
        type: sequelize.STRING(50)
    },
    date: {
        type: sequelize.DATEONLY,
        get: function () {
            return moment.utc(this.getDataValue('date')).format('YYYY-MM-DD');
        }
    },
    start_time: {
        type: sequelize.TIME
    },
    end_time: {
        type: sequelize.TIME
    },
    attendees: {
        type: sequelize.TEXT()
    },
    meeting_link: {
        type: sequelize.STRING(100)
    },
    taskCompleted: {
        type: sequelize.BOOLEAN
    },
    timeZone: {
        type:sequelize.STRING(10)
    }
},
    {
        timestamps: false
    }
)

Task.belongsTo(Users)
Users.hasMany(Task)
db.sync().then(res => {

})


module.exports = Task
